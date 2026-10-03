// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 immoses (Moses Qiu)
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test, { type TestContext } from 'node:test';
import { buildSkills, checkSkills } from './build-skills.ts';

const NAME = 'plystra-test';
const SKILL = `skills/${NAME}`;
const ADOPTION = '# Adoption\n\n| Version | Effective date | Notes |\n| --- | --- | --- |\n| 1.2.3 | 2026-10-04 | Current. |\n\n## 2. Levels\n\nCanonical obligations.\n';
const TEMPLATE = '# Template\n\n[Levels](../ADOPTION.md#2-levels)\n\n```markdown\n[Project](./PROJECT_PRINCIPLES.md)\n[Architecture](./docs/architecture.md)\n```\n';
const ENTRY = `---\nname: ${NAME}\ndescription: Apply test standards when testing generated materials.\n---\n\n# Test\n\n[Index](references/index.md)\n[Sources](references/sources.json)\n[Core](references/principles/engineering.md#1-boundaries)\n[Template](assets/templates/example.md)\n`;
const BASE = 'https://github.com/plystra/craft/blob/main/';

async function write(root: string, name: string, text: string): Promise<void> {
  await fs.mkdir(path.dirname(path.join(root, name)), { recursive: true });
  await fs.writeFile(path.join(root, name), text);
}

async function fixture(t: TestContext) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'craft-skills-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const manifest = {
    schemaVersion: 1,
    canonicalBaseUrl: BASE,
    skills: [{ name: NAME, sources: ['README.md', 'ADOPTION.md', 'LICENSE', 'principles/engineering.md', 'templates/example.md'].map(name => ({ path: name, when: `Work concerns ${name}.` })) }],
  };
  const saveManifest = () => write(root, 'tooling/skills-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  await saveManifest();
  await write(root, 'ADOPTION.md', ADOPTION);
  await write(root, 'LICENSE', 'Canonical documentation license.\n');
  await write(root, 'README.md', '# Craft\n\n[Core](principles/engineering.md#1-boundaries)\n[Template](templates/example.md)\n[License](LICENSE)\n[External](https://example.com/hello_(there))\n');
  await write(root, 'principles/engineering.md', '# Engineering\n\n## 1. Boundaries\n\nThe source rule.\n\n[Adoption](../ADOPTION.md#2-levels)\n[Omitted](omitted.md#an-omitted-rule)\n[Again](#1-boundaries)\n');
  await write(root, 'principles/omitted.md', '# Omitted\n\n## An omitted rule\n\nNot bundled automatically.\n');
  await write(root, 'templates/example.md', TEMPLATE);
  await write(root, `${SKILL}/SKILL.md`, ENTRY);
  return { root, manifest, saveManifest, read: (name: string) => fs.readFile(path.join(root, name), 'utf8') };
}

async function snapshot(root: string): Promise<Record<string, { content: string; modified: string }>> {
  const result: Record<string, { content: string; modified: string }> = {};
  async function walk(name: string) {
    const stat = await fs.lstat(path.join(root, name), { bigint: true });
    if (stat.isDirectory()) {
      for (const child of (await fs.readdir(path.join(root, name))).sort()) await walk(path.posix.join(name, child));
    } else {
      result[name] = { content: (await fs.readFile(path.join(root, name))).toString('base64'), modified: String(stat.mtimeNs) };
    }
  }
  await walk('.');
  return result;
}

test('generation is deterministic, traceable, and never changes handwritten sources or the entrypoint', async t => {
  const { root, read } = await fixture(t);
  const first = await buildSkills({ root });
  assert.equal(first.skills, 1);
  assert.equal(first.changed.length, 7);
  const before = await snapshot(root);
  assert.deepEqual(await buildSkills({ root }), { skills: 1, changed: [], removed: [] });
  await checkSkills({ root });
  assert.deepEqual(await snapshot(root), before);
  assert.equal(await read(`${SKILL}/SKILL.md`), ENTRY);
  assert.equal(await read('ADOPTION.md'), ADOPTION);
  assert.equal(await read('templates/example.md'), TEMPLATE);
  assert.equal(await read(`${SKILL}/references/LICENSE`), await read('LICENSE'));
  const ledger = JSON.parse(await read(`${SKILL}/references/sources.json`));
  const adoption = ledger.sources.find((source: { path: string }) => source.path === 'ADOPTION.md');
  assert.equal(adoption.sha256, createHash('sha256').update(ADOPTION).digest('hex'));
  assert.equal(ledger.craftVersion, '1.2.3');
  assert.equal(ledger.sources.length, 5);
  await assert.rejects(fs.access(path.join(root, `${SKILL}/references/principles/omitted.md`)));
});

test('a copied skill has self-contained references and templates; omitted canonical links use the repository URL', async t => {
  const { root, read } = await fixture(t);
  await buildSkills({ root });
  const portable = await fs.mkdtemp(path.join(os.tmpdir(), 'craft-portable-'));
  t.after(() => fs.rm(portable, { recursive: true, force: true }));
  await fs.cp(path.join(root, SKILL), portable, { recursive: true });
  const realPortable = await fs.realpath(portable);
  const copied = (name: string) => fs.readFile(path.join(portable, name), 'utf8');
  assert.match(await copied('references/README.md'), /\[Template\]\(\.\.\/assets\/templates\/example\.md\)/);
  assert.match(await copied('assets/templates/example.md'), /\[Levels\]\(\.\.\/\.\.\/references\/ADOPTION\.md#2-levels\)/);
  assert.match(await copied('references/principles/engineering.md'), /\[Adoption\]\(\.\.\/ADOPTION\.md#2-levels\)/);
  assert.ok((await copied('references/principles/engineering.md')).includes(`[Omitted](${BASE}principles/omitted.md#an-omitted-rule)`));
  assert.ok((await copied('assets/templates/example.md')).endsWith(TEMPLATE.replace('../ADOPTION.md#2-levels', '../../references/ADOPTION.md#2-levels')));
  assert.equal(await copied('SKILL.md'), await read(`${SKILL}/SKILL.md`));
  await fs.rm(root, { recursive: true });
  for (const target of ['references/index.md', 'references/sources.json', 'references/ADOPTION.md', 'references/principles/engineering.md', 'assets/templates/example.md']) {
    assert.ok((await copied(target)).length > 0);
    assert.ok((await fs.realpath(path.join(portable, target))).startsWith(realPortable + path.sep));
  }
});

test('--check detects source and output drift without writing; build repairs owned current outputs', async t => {
  const { root, read } = await fixture(t);
  await buildSkills({ root });
  await write(root, 'principles/engineering.md', (await read('principles/engineering.md')) + '\nA new rule.\n');
  const before = await snapshot(root);
  await assert.rejects(checkSkills({ root }), /Generated materials are out of date/);
  assert.deepEqual(await snapshot(root), before);
  await buildSkills({ root });
  assert.match(await read(`${SKILL}/references/principles/engineering.md`), /A new rule/);
  await write(root, `${SKILL}/references/ADOPTION.md`, 'Tampered generated copy.\n');
  await fs.unlink(path.join(root, `${SKILL}/references/README.md`));
  const tampered = await snapshot(root);
  await assert.rejects(checkSkills({ root }), /Generated materials are out of date/);
  assert.deepEqual(await snapshot(root), tampered);
  await buildSkills({ root });
  await checkSkills({ root });
  assert.ok((await read(`${SKILL}/references/ADOPTION.md`)).endsWith(ADOPTION));
});

test('removing a source clears only a recorded, unchanged generated output', async t => {
  const { root, manifest, saveManifest, read } = await fixture(t);
  await buildSkills({ root });
  // The entrypoint no longer offers the template once it leaves this bundle.
  await write(root, `${SKILL}/SKILL.md`, ENTRY.replace('[Template](assets/templates/example.md)\n', ''));
  manifest.skills[0].sources = manifest.skills[0].sources.filter(source => source.path !== 'templates/example.md');
  await saveManifest();
  await write(root, `${SKILL}/SKILL.md`, ENTRY);
  await assert.rejects(buildSkills({ root }), /Missing generated skill target/);
  await write(root, `${SKILL}/SKILL.md`, ENTRY.replace('[Template](assets/templates/example.md)\n', ''));
  await assert.rejects(checkSkills({ root }), /remove .*assets\/templates\/example.md/);
  const result = await buildSkills({ root });
  assert.deepEqual(result.removed, [`${SKILL}/assets/templates/example.md`]);
  await assert.rejects(fs.access(path.join(root, result.removed[0])));
  assert.equal(await read('templates/example.md'), TEMPLATE);
  assert.equal(await read(`${SKILL}/SKILL.md`), ENTRY.replace('[Template](assets/templates/example.md)\n', ''));
  await checkSkills({ root });
});

test('modified stale output and untracked files are preserved, with no partial writes', async t => {
  const { root, manifest, saveManifest, read } = await fixture(t);
  await buildSkills({ root });
  await write(root, `${SKILL}/references/handwritten.md`, 'Keep this.\n');
  await write(root, 'ADOPTION.md', ADOPTION + '\nNew canonical sentence.\n');
  const unknown = await snapshot(root);
  await assert.rejects(buildSkills({ root }), /Unknown file in generated area/);
  assert.deepEqual(await snapshot(root), unknown);
  await fs.unlink(path.join(root, `${SKILL}/references/handwritten.md`));
  await write(root, `${SKILL}/assets/templates/example.md`, 'Manually changed template.\n');
  manifest.skills[0].sources = manifest.skills[0].sources.filter(source => source.path !== 'templates/example.md');
  await saveManifest();
  await write(root, `${SKILL}/SKILL.md`, ENTRY.replace('[Template](assets/templates/example.md)\n', ''));
  const stale = await snapshot(root);
  await assert.rejects(buildSkills({ root }), /Refusing to remove modified generated file/);
  assert.deepEqual(await snapshot(root), stale);
  assert.equal(await read(`${SKILL}/assets/templates/example.md`), 'Manually changed template.\n');
});

test('existing files cannot be claimed on an initial build or through a forged ownership path', async t => {
  const { root, read } = await fixture(t);
  await write(root, `${SKILL}/references/README.md`, 'Handwritten source.\n');
  await assert.rejects(buildSkills({ root }), /Unknown file in generated area/);
  assert.equal(await read(`${SKILL}/references/README.md`), 'Handwritten source.\n');
  await fs.unlink(path.join(root, `${SKILL}/references/README.md`));
  await buildSkills({ root });
  const ledger = JSON.parse(await read(`${SKILL}/references/sources.json`));
  ledger.outputs.push({ path: '../SKILL.md', sha256: createHash('sha256').update(ENTRY).digest('hex') });
  await write(root, `${SKILL}/references/sources.json`, JSON.stringify(ledger));
  await assert.rejects(buildSkills({ root }), /invalid owned output/);
  assert.equal(await read(`${SKILL}/SKILL.md`), ENTRY);
});

test('broken file links and fragments fail before any generated files are written', async t => {
  const { root, read } = await fixture(t);
  const original = await read('README.md');
  for (const link of ['[Missing](missing.md)', '[Missing heading](ADOPTION.md#missing)', '[Escape](../outside.md)', '[File](file:///tmp/secret)', '[Encoded](%2Ftmp%2Fsecret)']) {
    await write(root, 'README.md', original + '\n' + link + '\n');
    const before = await snapshot(root);
    await assert.rejects(buildSkills({ root }), /Broken link|Broken anchor|safe repository-relative|not portable|Unsafe link/);
    assert.deepEqual(await snapshot(root), before);
    await assert.rejects(fs.access(path.join(root, `${SKILL}/references`)));
  }
});

test('inline code, fenced examples, reference links, HTML links, duplicate headings and directory navigation are handled', async t => {
  const { root, read } = await fixture(t);
  await write(root, 'ADOPTION.md', ADOPTION + '\n## 2. Levels\n\nA duplicate heading.\n');
  await write(root, 'README.md', '# Craft\n\n[Reference][levels]\n\n[levels]: <ADOPTION.md#2-levels-1> "Levels"\n\n<a href="principles/omitted.md#an-omitted-rule">Omitted</a>\n\n[Folder](principles/)\n\n`[Literal](missing.md)`\n\n~~~~markdown\n[Literal](also-missing.md)\n~~~~\n');
  await buildSkills({ root });
  const generated = await read(`${SKILL}/references/README.md`);
  assert.match(generated, /\[levels\]: <ADOPTION.md#2-levels-1> "Levels"/);
  assert.ok(generated.includes(`<a href="${BASE}principles/omitted.md#an-omitted-rule">`));
  assert.match(generated, /\[Folder\]\(https:\/\/github.com\/plystra\/craft\/tree\/main\/principles\)/);
  assert.match(generated, /`\[Literal\]\(missing.md\)`/);
  assert.match(generated, /\[Literal\]\(also-missing.md\)/);
  await checkSkills({ root });
});

test('manifest traversal, duplicate paths and unknown schema fields are rejected', async t => {
  const { root, manifest, saveManifest } = await fixture(t);
  const original = JSON.stringify(manifest);
  for (const invalidPath of ['../README.md', '/tmp/README.md', 'principles/../../README.md', 'principles\\secret.md', 'tooling/build-skills.ts']) {
    manifest.skills[0].sources[0].path = invalidPath;
    await saveManifest();
    await assert.rejects(buildSkills({ root }), /safe repository-relative|Not a canonical source/);
  }
  Object.assign(manifest, JSON.parse(original));
  manifest.skills[0].sources.push({ ...manifest.skills[0].sources[0] });
  await saveManifest();
  await assert.rejects(buildSkills({ root }), /duplicate source/);
  Object.assign(manifest, JSON.parse(original));
  await write(root, 'tooling/skills-manifest.json', JSON.stringify({ ...manifest, recursive: true }));
  await assert.rejects(buildSkills({ root }), /expected exactly/);
});

test('symlinks in source and generated paths are rejected without following them', async t => {
  const { root } = await fixture(t);
  const external = await fs.mkdtemp(path.join(os.tmpdir(), 'craft-external-'));
  t.after(() => fs.rm(external, { recursive: true, force: true }));
  await fs.writeFile(path.join(external, 'sentinel'), 'Untouched.\n');
  await fs.symlink(external, path.join(root, SKILL, 'references'));
  await assert.rejects(buildSkills({ root }), /Symlinks are not permitted/);
  assert.equal(await fs.readFile(path.join(external, 'sentinel'), 'utf8'), 'Untouched.\n');
  await fs.unlink(path.join(root, SKILL, 'references'));
  await fs.rename(path.join(root, 'principles'), path.join(external, 'principles'));
  await fs.symlink(path.join(external, 'principles'), path.join(root, 'principles'));
  await assert.rejects(buildSkills({ root }), /Symlinks are not permitted/);
  assert.equal(await fs.readFile(path.join(external, 'sentinel'), 'utf8'), 'Untouched.\n');
});

test('handwritten skill metadata and local links must be valid and portable', async t => {
  const { root } = await fixture(t);
  for (const entry of [ENTRY.replace(`name: ${NAME}`, 'name: another-skill'), ENTRY.replace(/description: .*/, 'description: ""')]) {
    await write(root, `${SKILL}/SKILL.md`, entry);
    await assert.rejects(buildSkills({ root }), /frontmatter name|description must/);
  }
  for (const target of ['references/not-bundled.md', '../../README.md', 'references/ADOPTION.md#missing']) {
    await write(root, `${SKILL}/SKILL.md`, ENTRY + `\n[Invalid](${target})\n`);
    await assert.rejects(buildSkills({ root }), /Missing regular file|Missing generated skill target|safe repository-relative|Broken skill anchor/);
  }
});

test('removing a skill from the manifest does not silently leave its old generated distribution unverified', async t => {
  const { root, manifest, saveManifest } = await fixture(t);
  await buildSkills({ root });
  manifest.skills[0].name = 'plystra-replacement';
  await saveManifest();
  await write(root, 'skills/plystra-replacement/SKILL.md', ENTRY.replace(`name: ${NAME}`, 'name: plystra-replacement'));
  await assert.rejects(checkSkills({ root }), /Unlisted generated skill/);
});
