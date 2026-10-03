// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 immoses (Moses Qiu)
import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Source = { path: string; when: string; sections?: string[]; output?: string };
type Skill = { name: string; sources: Source[] };
type Manifest = { schemaVersion: 2; canonicalBaseUrl: string; skills: Skill[] };
type SourceRecord = { path: string; sha256: string; selection: string[] | null; output: string };
type OutputRecord = { path: string; sha256: string };
type Inventory = {
  schemaVersion: 2;
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
type Heading = { start: number; lineEnd: number; level: number; text: string };
type Anchor = { start: number; slug: string };
type SelectedSource = {
  content: string;
  selection: string[] | null;
  output: string;
  anchors: Map<string, string>;
};

const GENERATOR = 'tooling/build-skills.ts';
const INVENTORY = 'references/sources.json';
const INDEX = 'references/index.md';
const hash = (value: string | Buffer): string => createHash('sha256').update(value).digest('hex');
const fail = (message: string): never => { throw new Error(message); };
const isHash = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

function object(value: unknown, keys: string[], label: string, optional: string[] = []): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label}: expected an object`);
  const result = value as Record<string, unknown>;
  if (Object.keys(result).some(key => !keys.includes(key) && !optional.includes(key)) || keys.some(key => !(key in result))) {
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

function safeOutput(value: unknown): string {
  const output = relativePath(value, 'Output');
  if ((!output.startsWith('references/') && !output.startsWith('assets/templates/'))
    || [INDEX, INVENTORY].some(reserved => output === reserved || output.startsWith(reserved + '/'))
    || output.split('/').some(part => part.startsWith('.'))) {
    fail(`Output must stay inside generated references or templates and avoid reserved paths: ${output}`);
  }
  return output;
}

function selectors(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.some(item => typeof item !== 'string' || !item.trim() || /[\r\n]/.test(item))) {
    fail(`${label}: sections must be a nonempty array of exact heading text`);
  }
  const result = value as string[];
  if (new Set(result).size !== result.length) fail(`${label}: duplicate section selector`);
  return result;
}

function parseManifest(input: unknown): Manifest {
  const data = object(input, ['schemaVersion', 'canonicalBaseUrl', 'skills'], 'Manifest');
  if (data.schemaVersion !== 2) fail('Unsupported manifest schemaVersion; expected 2');
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
    const outputs = new Set<string>();
    const sources = (skill.sources as unknown[]).map(input => {
      const source = object(input, ['path', 'when'], `${name} source`, ['sections', 'output']);
      const sourcePath = canonicalPath(source.path);
      if (paths.has(sourcePath)) fail(`${name}: duplicate source ${sourcePath}`);
      paths.add(sourcePath);
      if (typeof source.when !== 'string' || !source.when.trim() || /[\r\n]/.test(source.when)) {
        fail(`${name}: each source needs a single-line reading condition`);
      }
      const sections = 'sections' in source ? selectors(source.sections, sourcePath) : undefined;
      const output = 'output' in source ? safeOutput(source.output) : outputPath(sourcePath);
      if (outputs.has(output)) fail(`${name}: duplicate output ${output}`);
      if ([...outputs].some(other => other.startsWith(output + '/') || output.startsWith(other + '/'))) fail(`${name}: overlapping output paths`);
      if (sourcePath === 'LICENSE' && (sections || output !== 'references/LICENSE')) fail(`${name}: LICENSE must remain complete at references/LICENSE`);
      if (sourcePath !== 'LICENSE' && (!output.endsWith('.md') || output === 'references/LICENSE')) fail(`${name}: documentation output must be a Markdown file`);
      outputs.add(output);
      return { path: sourcePath, when: source.when as string, ...(sections ? { sections } : {}), output };
    });
    if (!paths.has('LICENSE')) fail(`${name}: LICENSE must be an explicit source`);
    return { name, sources };
  });
  return { schemaVersion: 2, canonicalBaseUrl: data.canonicalBaseUrl as string, skills };
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
    } else if (/^(?: {4}|\t)/.test(line)) {
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

function atxHeading(line: string): { level: number; text: string } | null {
  const match = /^ {0,3}(#{1,6})(?:[ \t]+(.*)|[ \t]*)\r?$/.exec(line.replace(/\r?\n$/, ''));
  if (!match) return null;
  return { level: match[1].length, text: (match[2] ?? '').replace(/[ \t]+#+[ \t]*$/, '').trim() };
}

function headings(markdown: string): Heading[] {
  const mask = codeMask(markdown);
  const result: Heading[] = [];
  let offset = 0;
  for (const line of markdown.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    const heading = atxHeading(line);
    if (heading && !mask[offset]) result.push({ start: offset, lineEnd: offset + line.length, ...heading });
    offset += line.length;
  }
  return result;
}

function anchorEntries(markdown: string): Anchor[] {
  // Inline code contributes its visible text to heading slugs, unlike fences.
  const mask = codeMask(markdown);
  const used = new Set<string>();
  const result: Anchor[] = [];
  let offset = 0;
  const lines = markdown.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const atx = atxHeading(line);
    const setext = index + 1 < lines.length && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1]);
    if (!mask[offset] && (atx || (line.trim() && setext))) {
      const label = (atx?.text ?? line).replace(/<[^>]+>/g, '').replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1');
      const base = label.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
      let slug = base;
      let suffix = 0;
      while (used.has(slug)) slug = `${base}-${++suffix}`;
      used.add(slug);
      result.push({ start: offset, slug });
    }
    offset += line.length + 1;
  }
  for (const match of markdown.matchAll(/<[^>]+\b(?:id|name)\s*=\s*(["'])(.*?)\1[^>]*>/gi)) {
    if (!mask[match.index!]) result.push({ start: match.index!, slug: match[2] });
  }
  return result;
}

function anchors(markdown: string): Set<string> {
  return new Set(anchorEntries(markdown).map(anchor => anchor.slug));
}

function selectSource(content: string, source: Source): SelectedSource {
  const originalAnchors = anchorEntries(content);
  if (!source.sections) {
    return { content, output: source.output!, selection: null, anchors: new Map(originalAnchors.map(anchor => [anchor.slug, anchor.slug])) };
  }
  const all = headings(content);
  const selected = source.sections.map(selector => {
    const matches = all.filter(heading => heading.text === selector);
    if (matches.length === 0) fail(`${source.path}: unknown section selector ${JSON.stringify(selector)}`);
    if (matches.length !== 1) fail(`${source.path}: ambiguous section selector ${JSON.stringify(selector)}`);
    const heading = matches[0];
    const end = all.find(next => next.start > heading.start && next.level <= heading.level)?.start ?? content.length;
    return { start: heading.start, end, text: selector };
  }).sort((a, b) => a.start - b.start);
  for (let index = 1; index < selected.length; index++) {
    if (selected[index].start < selected[index - 1].end) fail(`${source.path}: overlapping section selectors`);
  }
  const ranges = selected.map(({ start, end }) => ({ start, end }));
  const title = all.find(heading => heading.level === 1);
  if (title && !ranges.some(range => range.start <= title.start && title.start < range.end)) {
    ranges.push({ start: title.start, end: title.lineEnd });
  }
  ranges.sort((a, b) => a.start - b.start);
  let excerpt = '';
  const spans: { start: number; end: number; generatedStart: number }[] = [];
  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  for (const range of ranges) {
    if (excerpt && !excerpt.endsWith(newline + newline)) excerpt += excerpt.endsWith(newline) ? newline : newline + newline;
    spans.push({ ...range, generatedStart: excerpt.length });
    excerpt += content.slice(range.start, range.end);
  }
  // Blank lines separating the last selected section from its next heading
  // are excerpt boundaries, not code or paragraph content. Keep one original
  // line ending without trimming spaces on a nonempty line or inside a fence.
  const separator = /(\r?\n)(?:[ \t]*\r?\n)+$/.exec(excerpt);
  if (separator && !codeMask(excerpt).subarray(separator.index + separator[1].length).some(Boolean)) {
    excerpt = excerpt.slice(0, separator.index) + separator[1];
  }
  const generatedAnchors = new Map(anchorEntries(excerpt).map(anchor => [anchor.start, anchor.slug]));
  const mapped = new Map<string, string>();
  for (const anchor of originalAnchors) {
    const span = spans.find(range => range.start <= anchor.start && anchor.start < range.end);
    const generated = span && generatedAnchors.get(span.generatedStart + anchor.start - span.start);
    if (generated !== undefined) mapped.set(anchor.slug, generated);
  }
  return { content: excerpt, selection: selected.map(section => section.text), output: source.output!, anchors: mapped };
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

async function rewriteMarkdown(root: string, source: string, content: string, included: Map<string, SelectedSource>, base: string): Promise<string> {
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
    const selected = included.get(target);
    const includedFragment = local.fragment ? selected?.anchors.get(local.fragment) : undefined;
    const useLocal = selected && (local.fragment ? includedFragment !== undefined : selected.selection === null);
    const suffix = includedFragment !== undefined && includedFragment !== local.fragment
      ? local.suffix.replace(/#.*$/, `#${encodeURIComponent(includedFragment)}`) : local.suffix;
    const replacement = useLocal
      ? (local.pathname ? path.posix.relative(path.posix.dirname(included.get(source)!.output), selected.output).split('/').map(encodeURIComponent).join('/') : '') + suffix
      : canonicalUrl(base, target, stat.isDirectory()) + local.suffix;
    replacements.push({ ...link, replacement });
  }
  let result = content;
  for (const link of replacements.reverse()) result = result.slice(0, link.start) + link.replacement + result.slice(link.end);
  return result;
}

function parseInventory(input: unknown, skillName: string): { outputs: OutputRecord[] } {
  const keys = ['schemaVersion', 'generator', 'skill', 'craftVersion', 'canonicalBaseUrl', 'sources', 'outputs'];
  const data = object(input, keys, `${skillName} generated inventory`);
  if (![1, 2].includes(data.schemaVersion as number) || data.generator !== GENERATOR || data.skill !== skillName
    || typeof data.craftVersion !== 'string' || typeof data.canonicalBaseUrl !== 'string'
    || !Array.isArray(data.sources) || !Array.isArray(data.outputs)) fail(`${skillName}: unrecognized generated inventory`);
  const permitted = new Set([INDEX]);
  const paths = new Set<string>();
  for (const item of data.sources as unknown[]) {
    const source = object(item, data.schemaVersion === 1 ? ['path', 'sha256', 'output'] : ['path', 'sha256', 'selection', 'output'], 'Inventory source');
    const name = canonicalPath(source.path);
    const output = safeOutput(source.output);
    if (!isHash(source.sha256) || paths.has(name) || permitted.has(output)) fail(`${skillName}: invalid inventory source`);
    if (data.schemaVersion === 1 && output !== outputPath(name)) fail(`${skillName}: invalid legacy inventory source`);
    if (data.schemaVersion === 2 && source.selection !== null) selectors(source.selection, `Inventory ${name}`);
    if (name === 'LICENSE' && (output !== 'references/LICENSE' || (data.schemaVersion === 2 && source.selection !== null))) fail(`${skillName}: invalid inventory license`);
    if (name !== 'LICENSE' && !output.endsWith('.md')) fail(`${skillName}: invalid inventory document`);
    permitted.add(output);
    paths.add(name);
  }
  const seen = new Set<string>();
  for (const item of data.outputs as unknown[]) {
    const output = object(item, ['path', 'sha256'], 'Inventory output');
    if (!permitted.has(output.path as string) || seen.has(output.path as string) || !isHash(output.sha256)) fail(`${skillName}: invalid owned output`);
    seen.add(output.path as string);
  }
  if (seen.size !== permitted.size) fail(`${skillName}: incomplete generated inventory`);
  return { outputs: data.outputs as OutputRecord[] };
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

function retiredDirectories(outputs: string[], expected: Map<string, string>): string[] {
  const result = new Set<string>();
  for (const output of outputs) {
    if (expected.has(output)) continue;
    let directory = path.posix.dirname(output);
    while (directory !== 'references' && directory !== 'assets/templates') {
      // Every candidate must be an ancestor of an owned retired output and
      // remain below a generated root. Arbitrary empty directories are kept.
      if (!directory.startsWith('references/') && !directory.startsWith('assets/templates/')) break;
      result.add(directory);
      directory = path.posix.dirname(directory);
    }
  }
  return [...result].sort((a, b) => b.split('/').length - a.split('/').length || a.localeCompare(b, 'en'));
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
  const plans: { skill: string; expected: Map<string, string>; actual: Map<string, Buffer>; stale: string[]; emptyDirectories: string[] }[] = [];
  const result: BuildResult = { skills: manifest.skills.length, changed: [], removed: [] };
  for (const skill of manifest.skills) {
    const included = new Map<string, SelectedSource>();
    const rawSources = new Map<string, Buffer>();
    for (const source of skill.sources) {
      const raw = await read(root, source.path);
      rawSources.set(source.path, raw);
      // Reject invalid UTF-8 instead of silently replacing bytes in an excerpt.
      const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(raw);
      included.set(source.path, selectSource(text, source));
    }
    const expected = new Map<string, string>();
    const sources: SourceRecord[] = [];
    for (const source of skill.sources) {
      const digest = hash(rawSources.get(source.path)!);
      const { output, content, selection } = included.get(source.path)!;
      sources.push({ path: source.path, sha256: digest, selection, output });
      if (source.path === 'LICENSE') expected.set(output, content);
      else {
        const origin = canonicalUrl(manifest.canonicalBaseUrl, source.path);
        const scope = selection ? `Excerpt only: ${selection.map(heading => JSON.stringify(heading)).join('; ')}. This is not the complete source document.` : 'Complete source document.';
        const header = `<!-- Generated by ${GENERATOR}. Edit the canonical source, not this copy. -->\n\n> Source: [${source.path}](${origin}) · Craft ${version}\n> Author: immoses (Moses Qiu) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)\n> Source SHA-256: \`${digest}\`\n> ${scope}\n> Distribution changes: ${selection ? 'selected sections reproduced with the original title; ' : ''}provenance added and relative links adapted for this skill. Included source text is otherwise preserved. This snapshot adds no requirements; the canonical source governs.\n\n`;
        expected.set(output, header + await rewriteMarkdown(root, source.path, content, included, manifest.canonicalBaseUrl));
      }
    }
    const rows = skill.sources.map(source => {
      const selected = included.get(source.path)!;
      const link = path.posix.relative('references', selected.output).split('/').map(encodeURIComponent).join('/');
      const label = selected.selection ? `${source.path} (excerpt: ${selected.selection.join('; ')})` : source.path;
      return `| [${label.replace(/[\\\[\]|]/g, '\\$&')}](${link}) | ${source.when.replace(/\|/g, '\\|')} |`;
    }).join('\n');
    expected.set(INDEX, `<!-- Generated by ${GENERATOR}. Do not edit. -->\n\n# Sources for ${skill.name}\n\nThese task references distribute selected canonical Plystra Craft material (version ${version}). Read only what the task needs. Excerpts identify their included sections and do not present the complete source. This index is navigation, not a new normative document, a compliance checklist, or a claim of automatic freshness. Selecting excerpts neither creates obligations nor changes obligations already applicable to a project.\n\n| Material and selection | Read when |\n| --- | --- |\n${rows}\n\n[Source hashes, exact selections, and generated-file inventory](sources.json) identify this snapshot. Canonical updates follow [the adoption process](${canonicalUrl(manifest.canonicalBaseUrl, 'ADOPTION.md')}). Documentation by immoses (Moses Qiu) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); see [LICENSE](LICENSE). Distribution changes are limited to section selection, provenance, and navigation; included text retains its canonical source information.\n`);
    const inventory: Inventory = {
      schemaVersion: 2, generator: GENERATOR, skill: skill.name, craftVersion: version,
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
    plans.push({ skill: skill.name, expected, actual, stale, emptyDirectories: retiredDirectories([...owned.keys()], expected) });
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
    for (const directory of plan.emptyDirectories) {
      const relative = `skills/${plan.skill}/${directory}`;
      const stat = await inspect(root, relative);
      if (!stat?.isDirectory()) continue;
      try { await fs.rmdir(path.join(root, relative)); }
      catch (error) {
        if (!['ENOTEMPTY', 'ENOENT', 'EEXIST'].includes((error as NodeJS.ErrnoException).code ?? '')) throw error;
      }
    }
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
