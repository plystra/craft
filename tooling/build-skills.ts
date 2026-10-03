// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 immoses (Moses Qiu)
import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Source = { path: string; when: string };
type Skill = { name: string; sources: Source[] };
type Manifest = { schemaVersion: 1; canonicalBaseUrl: string; skills: Skill[] };
type SourceRecord = { path: string; sha256: string; output: string };
type OutputRecord = { path: string; sha256: string };
type Inventory = {
  schemaVersion: 1;
  generator: string;
  skill: string;
  craftVersion: string;
  canonicalBaseUrl: string;
  sources: SourceRecord[];
  outputs: OutputRecord[];
};
type BuildOptions = { root?: string; check?: boolean };
type BuildResult = { skills: number; changed: string[]; removed: string[] };
type Link = { start: number; end: number; target: string };

const GENERATOR = 'tooling/build-skills.ts';
const INVENTORY = 'references/sources.json';
const INDEX = 'references/index.md';
const hash = (value: string | Buffer): string => createHash('sha256').update(value).digest('hex');
const fail = (message: string): never => { throw new Error(message); };
const isHash = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

function object(value: unknown, keys: string[], label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label}: expected an object`);
  const result = value as Record<string, unknown>;
  if (Object.keys(result).some(key => !keys.includes(key)) || keys.some(key => !(key in result))) {
    fail(`${label}: expected exactly ${keys.join(', ')}`);
  }
  return result;
}

function relativePath(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value || value.includes('\\') || /[\x00-\x1f]/.test(value)
    || path.posix.isAbsolute(value) || value.split('/').some(part => !part || part === '.' || part === '..')) {
    fail(`${label}: expected a safe repository-relative path`);
  }
  return value as string;
}

function canonicalPath(value: unknown): string {
  const name = relativePath(value, 'Source');
  if (!/^(?:README\.md|CHARTER\.md|ADOPTION\.md|LICENSE|(?:principles|templates)\/[a-zA-Z0-9_./-]+\.md)$/.test(name)) {
    fail(`Not a canonical source: ${name}`);
  }
  return name;
}

function outputPath(source: string): string {
  return source.startsWith('templates/') ? `assets/${source}` : `references/${source}`;
}

function parseManifest(input: unknown): Manifest {
  const data = object(input, ['schemaVersion', 'canonicalBaseUrl', 'skills'], 'Manifest');
  if (data.schemaVersion !== 1) fail('Unsupported manifest schemaVersion');
  if (typeof data.canonicalBaseUrl !== 'string' || !/^https:\/\/[^?#]+\/$/.test(data.canonicalBaseUrl)) {
    fail('canonicalBaseUrl must be an HTTPS URL ending with /');
  }
  if (!Array.isArray(data.skills) || data.skills.length === 0) fail('Manifest must declare at least one skill');
  const names = new Set<string>();
  const skills = (data.skills as unknown[]).map((input, index): Skill => {
    const skill = object(input, ['name', 'sources'], `Skill ${index}`);
    if (typeof skill.name !== 'string' || skill.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.name)) {
      fail(`Skill ${index}: invalid name`);
    }
    const name = skill.name as string;
    if (names.has(name)) fail(`Duplicate skill: ${name}`);
    names.add(name);
    if (!Array.isArray(skill.sources) || skill.sources.length === 0) fail(`${name}: sources must not be empty`);
    const paths = new Set<string>();
    const sources = (skill.sources as unknown[]).map(input => {
      const source = object(input, ['path', 'when'], `${name} source`);
      const sourcePath = canonicalPath(source.path);
      if (paths.has(sourcePath)) fail(`${name}: duplicate source ${sourcePath}`);
      paths.add(sourcePath);
      if (typeof source.when !== 'string' || !source.when.trim() || /[\r\n]/.test(source.when)) {
        fail(`${name}: each source needs a single-line reading condition`);
      }
      return { path: sourcePath, when: source.when as string };
    });
    if (!paths.has('LICENSE') || !paths.has('ADOPTION.md')) fail(`${name}: LICENSE and ADOPTION.md must be explicit sources`);
    return { name, sources };
  });
  return { schemaVersion: 1, canonicalBaseUrl: data.canonicalBaseUrl as string, skills };
}

// Follow no symlink, including ancestor directories. All operations use this
// boundary, rather than trusting a path that merely looks repository-relative.
async function inspect(root: string, relative: string): Promise<Awaited<ReturnType<typeof fs.lstat>> | null> {
  relativePath(relative, 'Filesystem path');
  let current = root;
  const parts = relative.split('/');
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]);
    let stat;
    try { stat = await fs.lstat(current); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
    if (stat.isSymbolicLink()) fail(`Symlinks are not permitted: ${relative}`);
    if (index < parts.length - 1 && !stat.isDirectory()) fail(`Not a directory: ${current}`);
    if (index === parts.length - 1) return stat;
  }
  return null;
}

async function read(root: string, relative: string): Promise<Buffer> {
  const stat = await inspect(root, relative);
  if (!stat?.isFile()) fail(`Missing regular file: ${relative}`);
  return fs.readFile(path.join(root, relative));
}

// Mask code before finding links or headings. This keeps examples verbatim,
// including the target-project links in the canonical README template.
function codeMask(markdown: string): Uint8Array {
  const mask = new Uint8Array(markdown.length);
  let fence: { character: string; length: number } | null = null;
  let offset = 0;
  for (const line of markdown.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    const match = /^ {0,3}(`{3,}|~{3,})(.*?)(?:\r?\n)?$/.exec(line);
    if (fence) {
      mask.fill(1, offset, offset + line.length);
      if (match && match[1][0] === fence.character && match[1].length >= fence.length && !match[2].trim()) fence = null;
    } else if (match && !(match[1][0] === '`' && match[2].includes('`'))) {
      fence = { character: match[1][0], length: match[1].length };
      mask.fill(1, offset, offset + line.length);
    }
    offset += line.length;
  }
  for (let index = 0; index < markdown.length; index++) {
    if (mask[index] || markdown[index] !== '`') continue;
    const opening = /^`+/.exec(markdown.slice(index))![0];
    let end = index + opening.length;
    while ((end = markdown.indexOf(opening, end)) !== -1) {
      if (!mask[end] && markdown[end - 1] !== '`' && markdown[end + opening.length] !== '`') break;
      end += opening.length;
    }
    if (end !== -1) {
      mask.fill(1, index, end + opening.length);
      index = end + opening.length - 1;
    } else index += opening.length - 1;
  }
  return mask;
}

function escaped(text: string, index: number): boolean {
  let slashes = 0;
  while (index > 0 && text[--index] === '\\') slashes++;
  return slashes % 2 === 1;
}

function markdownLinks(markdown: string): Link[] {
  const mask = codeMask(markdown);
  const links: Link[] = [];
  for (let index = 0; index < markdown.length; index++) {
    if (mask[index] || markdown[index] !== '[' || escaped(markdown, index)) continue;
    let nesting = 1;
    let end = index + 1;
    for (; end < markdown.length && nesting; end++) {
      if (mask[end] || escaped(markdown, end)) continue;
      if (markdown[end] === '[') nesting++;
      if (markdown[end] === ']') nesting--;
    }
    if (nesting || markdown[end] !== '(') continue;
    let start = end + 1;
    while (/\s/.test(markdown[start] ?? '') && start < markdown.length) start++;
    let stop = start;
    if (markdown[start] === '<') {
      start++;
      stop = start;
      while (stop < markdown.length && (markdown[stop] !== '>' || escaped(markdown, stop))) stop++;
      if (stop === markdown.length) continue;
      end = stop + 1;
    } else {
      let depth = 0;
      while (stop < markdown.length) {
        if (!escaped(markdown, stop)) {
          if (markdown[stop] === '(') depth++;
          else if (markdown[stop] === ')') { if (!depth) break; depth--; }
          else if (/\s/.test(markdown[stop]) && !depth) break;
        }
        stop++;
      }
      end = stop;
    }
    const closing = /^(?:\s+(?:"[^"\n]*"|'[^'\n]*'|\([^\n]*\)))?\s*\)/.exec(markdown.slice(end));
    if (closing) {
      links.push({ start, end: stop, target: markdown.slice(start, stop) });
      index = end + closing[0].length - 1;
    }
  }
  // Reference-style link definitions are also portable after rewriting.
  const definitions = /^ {0,3}\[[^\]\n]+\]:[ \t]*(?:<([^>\n]+)>|(\S+))(?:[ \t]+(?:"[^"\n]*"|'[^'\n]*'|\([^\n]*\)))?[ \t]*$/gm;
  for (const match of markdown.matchAll(definitions)) {
    if (mask[match.index!]) continue;
    const target = match[1] ?? match[2];
    const start = match.index! + match[0].indexOf(target, match[0].indexOf(']:') + 2);
    links.push({ start, end: start + target.length, target });
  }
  // Markdown permits HTML links and images; do not leave their relative URLs
  // pointing outside an independently copied skill.
  for (const tag of markdown.matchAll(/<[^!\s>][^>]*>/g)) {
    if (mask[tag.index!]) continue;
    for (const attribute of tag[0].matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
      const target = attribute[2];
      const start = tag.index! + attribute.index! + attribute[0].indexOf(attribute[1]) + 1;
      links.push({ start, end: start + target.length, target });
    }
  }
  return links.sort((a, b) => a.start - b.start);
}

function anchors(markdown: string): Set<string> {
  // Inline code contributes its visible text to heading slugs, unlike fences.
  const mask = codeMask(markdown);
  const result = new Set<string>();
  let offset = 0;
  const lines = markdown.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const atx = /^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    const setext = index + 1 < lines.length && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1]);
    if (!mask[offset] && (atx || (line.trim() && setext))) {
      const label = (atx?.[1] ?? line).replace(/<[^>]+>/g, '').replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1');
      const base = label.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
      let slug = base;
      let suffix = 0;
      while (result.has(slug)) slug = `${base}-${++suffix}`;
      result.add(slug);
    }
    offset += line.length + 1;
  }
  for (const match of markdown.matchAll(/<[^>]+\b(?:id|name)\s*=\s*(["'])(.*?)\1[^>]*>/gi)) {
    if (!mask[match.index!]) result.add(match[2]);
  }
  return result;
}

function localTarget(target: string): { pathname: string; suffix: string; fragment: string } | null {
  const decodedEscapes = target.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~])/g, '$1');
  if (/^file:/i.test(decodedEscapes)) fail(`Local file URL is not portable: ${target}`);
  if (/^[a-z][a-z0-9+.-]*:/i.test(decodedEscapes) || decodedEscapes.startsWith('//')) return null;
  if (decodedEscapes.startsWith('/') || decodedEscapes.includes('\\')) fail(`Absolute or platform-local link is not portable: ${target}`);
  const split = /^([^?#]*)([^#]*)(?:#(.*))?$/.exec(decodedEscapes)!;
  let pathname;
  let fragment;
  try { pathname = decodeURIComponent(split[1]); fragment = decodeURIComponent(split[3] ?? ''); }
  catch { return fail(`Malformed URL escape in ${target}`); }
  if (pathname.startsWith('/') || pathname.includes('\\') || /[\x00-\x1f]/.test(pathname)) fail(`Unsafe link: ${target}`);
  return { pathname, suffix: split[2] + (split[3] === undefined ? '' : `#${split[3]}`), fragment };
}

function resolvedTarget(source: string, pathname: string): string {
  const target = pathname ? path.posix.normalize(path.posix.join(path.posix.dirname(source), pathname)).replace(/\/$/, '') : source;
  relativePath(target, `Link in ${source}`);
  if (target === '.git' || target.startsWith('.git/')) fail(`Link must not address Git internals: ${source}`);
  return target;
}

function canonicalUrl(base: string, relative: string, directory = false): string {
  return (directory ? base.replace('/blob/', '/tree/') : base) + relative.split('/').map(encodeURIComponent).join('/');
}

async function rewriteMarkdown(root: string, source: string, content: string, included: Map<string, string>, base: string): Promise<string> {
  const replacements: (Link & { replacement: string })[] = [];
  for (const link of markdownLinks(content)) {
    const local = localTarget(link.target);
    if (!local) continue;
    const target = resolvedTarget(source, local.pathname);
    const stat = await inspect(root, target);
    if (!stat || (!stat.isFile() && !stat.isDirectory())) fail(`Broken link in ${source}: ${link.target}`);
    if (local.fragment && target.endsWith('.md')) {
      if (!anchors((await read(root, target)).toString('utf8')).has(local.fragment)) {
        fail(`Broken anchor in ${source}: ${link.target}`);
      }
    }
    if (!local.pathname) continue;
    const output = included.get(target);
    const replacement = output
      ? path.posix.relative(path.posix.dirname(included.get(source)!), output).split('/').map(encodeURIComponent).join('/') + local.suffix
      : canonicalUrl(base, target, stat.isDirectory()) + local.suffix;
    replacements.push({ ...link, replacement });
  }
  let result = content;
  for (const link of replacements.reverse()) result = result.slice(0, link.start) + link.replacement + result.slice(link.end);
  return result;
}

function parseInventory(input: unknown, skillName: string): Inventory {
  const keys = ['schemaVersion', 'generator', 'skill', 'craftVersion', 'canonicalBaseUrl', 'sources', 'outputs'];
  const data = object(input, keys, `${skillName} generated inventory`);
  if (data.schemaVersion !== 1 || data.generator !== GENERATOR || data.skill !== skillName
    || typeof data.craftVersion !== 'string' || typeof data.canonicalBaseUrl !== 'string'
    || !Array.isArray(data.sources) || !Array.isArray(data.outputs)) fail(`${skillName}: unrecognized generated inventory`);
  const permitted = new Set([INDEX]);
  for (const item of data.sources as unknown[]) {
    const source = object(item, ['path', 'sha256', 'output'], 'Inventory source');
    const name = canonicalPath(source.path);
    if (!isHash(source.sha256) || source.output !== outputPath(name) || permitted.has(source.output as string)) fail(`${skillName}: invalid inventory source`);
    permitted.add(source.output as string);
  }
  const seen = new Set<string>();
  for (const item of data.outputs as unknown[]) {
    const output = object(item, ['path', 'sha256'], 'Inventory output');
    if (!permitted.has(output.path as string) || seen.has(output.path as string) || !isHash(output.sha256)) fail(`${skillName}: invalid owned output`);
    seen.add(output.path as string);
  }
  if (seen.size !== permitted.size) fail(`${skillName}: incomplete generated inventory`);
  return data as unknown as Inventory;
}

async function generatedFiles(root: string, skill: string): Promise<Map<string, Buffer>> {
  const files = new Map<string, Buffer>();
  async function walk(relative: string): Promise<void> {
    const location = `skills/${skill}/${relative}`;
    const stat = await inspect(root, location);
    if (!stat) return;
    if (stat.isDirectory()) {
      for (const child of (await fs.readdir(path.join(root, location))).sort()) await walk(`${relative}/${child}`);
    } else if (stat.isFile()) files.set(relative, await read(root, location));
    else fail(`Not a regular generated file: ${location}`);
  }
  await walk('references');
  await walk('assets/templates');
  return files;
}

async function validateEntrypoint(root: string, skill: Skill, expected: Map<string, string>): Promise<void> {
  const location = `skills/${skill.name}/SKILL.md`;
  const content = (await read(root, location)).toString('utf8');
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  const name = frontmatter && /^name:\s*["']?([^"'\r\n]+?)["']?\s*$/m.exec(frontmatter[1]);
  if (!name || name[1] !== skill.name) fail(`${location}: frontmatter name must match the manifest`);
  const description = frontmatter && /^description:[ \t]*(.+)$/m.exec(frontmatter[1]);
  if (!description || !description[1].replace(/^["']|["']$/g, '').trim()
    || /^[\[\]{}|>*&!]/.test(description[1]) || /^(?:null|true|false|~)\s*$/i.test(description[1])) {
    fail(`${location}: description must be a nonempty single-line scalar`);
  }
  for (const link of markdownLinks(content)) {
    const local = localTarget(link.target);
    if (!local) continue;
    const target = resolvedTarget('SKILL.md', local.pathname);
    const generated = expected.get(target);
    if (generated === undefined && (target.startsWith('references/') || target.startsWith('assets/templates/'))) {
      fail(`Missing generated skill target in ${location}: ${link.target}`);
    }
    const targetContent = generated ?? (await read(root, `skills/${skill.name}/${target}`)).toString('utf8');
    if (local.fragment && target.endsWith('.md') && !anchors(targetContent).has(local.fragment)) fail(`Broken skill anchor in ${location}: ${link.target}`);
  }
}

async function writeAtomic(root: string, relative: string, content: string): Promise<void> {
  const parent = path.posix.dirname(relative);
  await inspect(root, parent);
  await fs.mkdir(path.join(root, parent), { recursive: true });
  await inspect(root, relative);
  const temporary = path.join(root, parent, `.craft-${randomUUID()}.tmp`);
  try {
    await fs.writeFile(temporary, content, { encoding: 'utf8', flag: 'wx' });
    await fs.rename(temporary, path.join(root, relative));
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export async function buildSkills(options: BuildOptions = {}): Promise<BuildResult> {
  const root = path.resolve(options.root ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
  const rootStat = await fs.lstat(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) fail('Repository root must be a real directory');
  const manifest = parseManifest(JSON.parse((await read(root, 'tooling/skills-manifest.json')).toString('utf8')));
  const adoption = (await read(root, 'ADOPTION.md')).toString('utf8');
  const version = /^\|\s*(\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?)\s*\|\s*\d{4}-\d{2}-\d{2}\s*\|/m.exec(adoption)?.[1];
  if (!version) fail('ADOPTION.md must contain its current version as the first version table entry');
  const skillsDirectory = await inspect(root, 'skills');
  if (skillsDirectory?.isDirectory()) {
    for (const name of await fs.readdir(path.join(root, 'skills'))) {
      if (manifest.skills.some(skill => skill.name === name)) continue;
      if (await inspect(root, `skills/${name}/references/sources.json`)) fail(`Unlisted generated skill: ${name}; retire its generated files explicitly`);
    }
  }
  const plans: { skill: string; expected: Map<string, string>; actual: Map<string, Buffer>; stale: string[] }[] = [];
  const result: BuildResult = { skills: manifest.skills.length, changed: [], removed: [] };
  for (const skill of manifest.skills) {
    const included = new Map(skill.sources.map(source => [source.path, outputPath(source.path)]));
    const expected = new Map<string, string>();
    const sources: SourceRecord[] = [];
    for (const source of skill.sources) {
      const raw = await read(root, source.path);
      const digest = hash(raw);
      const output = included.get(source.path)!;
      const content = raw.toString('utf8');
      sources.push({ path: source.path, sha256: digest, output });
      if (source.path === 'LICENSE') expected.set(output, content);
      else {
        const origin = canonicalUrl(manifest.canonicalBaseUrl, source.path);
        const header = `<!-- Generated by ${GENERATOR}. Edit the canonical source, not this copy. -->\n\n> Source: [${source.path}](${origin}) · Craft ${version}\n> Author: immoses (Moses Qiu) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)\n> Source SHA-256: \`${digest}\`\n> Distribution changes: provenance added and relative links adapted for this skill. The source text is otherwise preserved. This snapshot adds no requirements; the canonical source governs.\n\n`;
        expected.set(output, header + await rewriteMarkdown(root, source.path, content, included, manifest.canonicalBaseUrl));
      }
    }
    const rows = skill.sources.map(source => {
      const link = path.posix.relative('references', included.get(source.path)!);
      return `| [${source.path}](${link}) | ${source.when.replace(/\|/g, '\\|')} |`;
    }).join('\n');
    expected.set(INDEX, `<!-- Generated by ${GENERATOR}. Do not edit. -->\n\n# Sources for ${skill.name}\n\nThese files distribute selected canonical Plystra Craft material (version ${version}). Read the files relevant to the task; this selection does not narrow any applicable Craft obligations. The copies add no independent requirements and are not an assertion of compliance or automatic freshness.\n\n| Source | Read when |\n| --- | --- |\n${rows}\n\n[Source hashes and generated-file inventory](sources.json) identify this snapshot. Canonical updates follow [ADOPTION.md](ADOPTION.md). Documentation by immoses (Moses Qiu) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); see [LICENSE](LICENSE). Distribution changes are limited to provenance and navigation; copies retain their canonical source information.\n`);
    const inventory: Inventory = {
      schemaVersion: 1, generator: GENERATOR, skill: skill.name, craftVersion: version,
      canonicalBaseUrl: manifest.canonicalBaseUrl, sources,
      outputs: [...expected].map(([name, content]) => ({ path: name, sha256: hash(content) })).sort((a, b) => a.path.localeCompare(b.path, 'en')),
    };
    expected.set(INVENTORY, JSON.stringify(inventory, null, 2) + '\n');
    await validateEntrypoint(root, skill, expected);
    const actual = await generatedFiles(root, skill.name);
    const old = actual.has(INVENTORY) ? parseInventory(JSON.parse(actual.get(INVENTORY)!.toString('utf8')), skill.name) : null;
    const owned = new Map(old?.outputs.map(output => [output.path, output.sha256]) ?? []);
    for (const name of actual.keys()) {
      if (name !== INVENTORY && !owned.has(name)) fail(`Unknown file in generated area: skills/${skill.name}/${name}; it was preserved`);
    }
    const stale = [...actual.keys()].filter(name => !expected.has(name));
    for (const name of stale) {
      if (hash(actual.get(name)!) !== owned.get(name)) fail(`Refusing to remove modified generated file: skills/${skill.name}/${name}`);
      result.removed.push(`skills/${skill.name}/${name}`);
    }
    for (const [name, content] of expected) {
      if (!actual.get(name)?.equals(Buffer.from(content))) result.changed.push(`skills/${skill.name}/${name}`);
    }
    plans.push({ skill: skill.name, expected, actual, stale });
  }
  if (options.check) {
    if (result.changed.length || result.removed.length) fail(`Generated materials are out of date:\n${result.changed.map(name => `  update ${name}`).concat(result.removed.map(name => `  remove ${name}`)).join('\n')}\nRun node tooling/build-skills.ts.`);
    return result;
  }
  // Validate every skill before applying any changes. Inventory is written last
  // so ownership is never claimed for files that have not been produced.
  for (const plan of plans) {
    for (const [name, content] of plan.expected) {
      if (name !== INVENTORY && !plan.actual.get(name)?.equals(Buffer.from(content))) await writeAtomic(root, `skills/${plan.skill}/${name}`, content);
    }
    for (const name of plan.stale) await fs.unlink(path.join(root, 'skills', plan.skill, name));
    const inventory = plan.expected.get(INVENTORY)!;
    if (!plan.actual.get(INVENTORY)?.equals(Buffer.from(inventory))) await writeAtomic(root, `skills/${plan.skill}/${INVENTORY}`, inventory);
  }
  return result;
}

export async function checkSkills(options: Omit<BuildOptions, 'check'> = {}): Promise<BuildResult> {
  return buildSkills({ ...options, check: true });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length > 1 || args.some(argument => argument !== '--check')) {
    console.error('Usage: node tooling/build-skills.ts [--check]');
    process.exitCode = 1;
  } else {
    try {
      const result = await buildSkills({ check: args.includes('--check') });
      console.log(args.includes('--check') ? `Verified generated materials for ${result.skills} skills.` : `Built ${result.skills} skills: ${result.changed.length} files updated, ${result.removed.length} stale files removed.`);
    } catch (error) {
      console.error((error as Error).message);
      process.exitCode = 1;
    }
  }
}
