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
    schemaVersion: 2,
    canonicalBaseUrl: BASE,
    skills: [{ name: NAME, sources: ['README.md', 'ADOPTION.md', 'LICENSE', 'principles/engineering.md', 'templates/example.md'].map(name => ({ path: name, when: `Work concerns ${name}.` } as { path: string; when: string; sections?: string[]; output?: string })) }],
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
  assert.equal(ledger.schemaVersion, 2);
  assert.equal(adoption.selection, null);
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

const SELECTED_SECTION = '## 2. Kept\r\n\r\nKeep this paragraph and its exact spacing.  \r\n\r\n```markdown\r\n# Not a boundary\r\n## Fake fenced section\r\n[Example](missing-example.md)\r\n```\r\n\r\n    ## Fake indented section\r\n    [Example](also-missing.md)\r\n\r\n### Shared\r\n\r\nThe second shared heading.\r\n\r\n[Local](#shared-1)\r\n[Excluded](#1-omitted)\r\n[Whole](engineering.md)\r\n\r\n';
const SELECTIVE_SOURCE = '# Engineering\r\n\r\nThis introduction is excluded.\r\n\r\n## 1. Omitted\r\n\r\nOmitted rules.\r\n\r\n### Shared\r\n\r\nThe first shared heading.\r\n\r\n' + SELECTED_SECTION + '## 3. Later\r\n\r\nLater rules.\r\n';

async function selectiveFixture(t: TestContext) {
  const setup = await fixture(t);
  const { root, manifest, saveManifest } = setup;
  const core = manifest.skills[0].sources.find(source => source.path === 'principles/engineering.md')!;
  core.sections = ['2. Kept'];
  core.output = 'references/implementation.md';
  const adoption = manifest.skills[0].sources.find(source => source.path === 'ADOPTION.md')!;
  adoption.sections = ['2. Levels'];
  adoption.output = 'references/requirements.md';
  await saveManifest();
  await write(root, 'principles/engineering.md', SELECTIVE_SOURCE);
  await write(root, 'README.md', '# Craft\n\n[Selected](principles/engineering.md#2-kept)\n[Repeated heading](principles/engineering.md#shared-1)\n[Excluded](principles/engineering.md#1-omitted)\n[Complete document](principles/engineering.md)\n[Levels](ADOPTION.md#2-levels)\n');
  await write(root, `${SKILL}/SKILL.md`, ENTRY.replace('references/principles/engineering.md#1-boundaries', 'references/implementation.md#2-kept') + '\n[Requirements](references/requirements.md#2-levels)\n');
  return setup;
}

test('exact section excerpts preserve code bytes, carry selections and hashes, and keep source order', async t => {
  const { root, manifest, saveManifest, read } = await selectiveFixture(t);
  await buildSkills({ root });
  const generated = await read(`${SKILL}/references/implementation.md`);
  assert.ok(generated.includes('# Engineering\r\n\r\n'));
  assert.ok(generated.includes(SELECTED_SECTION.slice(0, SELECTED_SECTION.indexOf('[Local]'))));
  assert.ok(!generated.includes('This introduction is excluded.'));
  assert.ok(!generated.includes('Omitted rules.'));
  assert.ok(!generated.includes('Later rules.'));
  assert.match(generated, /Excerpt only: "2\. Kept"/);
  const ledger = JSON.parse(await read(`${SKILL}/references/sources.json`));
  const core = ledger.sources.find((source: { path: string }) => source.path === 'principles/engineering.md');
  assert.deepEqual(core.selection, ['2. Kept']);
  assert.equal(core.sha256, createHash('sha256').update(SELECTIVE_SOURCE).digest('hex'));
  assert.equal(core.output, 'references/implementation.md');
  assert.ok(!(await read(`${SKILL}/references/requirements.md`)).includes('2026-10-04'));
  assert.match(await read(`${SKILL}/references/index.md`), /https:\/\/github.com\/plystra\/craft\/blob\/main\/ADOPTION.md/);
  const source = manifest.skills[0].sources.find(source => source.path === core.path)!;
  source.sections = ['3. Later', '2. Kept'];
  await saveManifest();
  await buildSkills({ root });
  const ordered = await read(`${SKILL}/references/implementation.md`);
  assert.ok(ordered.indexOf('## 2. Kept\r\n') < ordered.indexOf('## 3. Later\r\n'));
  const updated = JSON.parse(await read(`${SKILL}/references/sources.json`));
  assert.deepEqual(updated.sources.find((item: { path: string }) => item.path === core.path).selection, ['2. Kept', '3. Later']);
  await checkSkills({ root });
});

test('excerpt links route omitted and whole-document targets remotely, with retained and renumbered anchors local', async t => {
  const { root, read } = await selectiveFixture(t);
  await buildSkills({ root });
  const core = await read(`${SKILL}/references/implementation.md`);
  const overview = await read(`${SKILL}/references/README.md`);
  assert.ok(core.includes('[Local](#shared)'));
  assert.ok(core.includes(`[Excluded](${BASE}principles/engineering.md#1-omitted)`));
  assert.ok(core.includes(`[Whole](${BASE}principles/engineering.md)`));
  assert.ok(overview.includes('[Selected](implementation.md#2-kept)'));
  assert.ok(overview.includes('[Repeated heading](implementation.md#shared)'));
  assert.ok(overview.includes(`[Excluded](${BASE}principles/engineering.md#1-omitted)`));
  assert.ok(overview.includes(`[Complete document](${BASE}principles/engineering.md)`));
  assert.ok(overview.includes('[Levels](requirements.md#2-levels)'));
  assert.ok((await read(`${SKILL}/assets/templates/example.md`)).includes('[Levels](../../references/requirements.md#2-levels)'));
});

test('source changes outside an excerpt still invalidate its full-source provenance without changing selected text', async t => {
  const { root, read } = await selectiveFixture(t);
  await buildSkills({ root });
  const before = await read(`${SKILL}/references/implementation.md`);
  await write(root, 'principles/engineering.md', SELECTIVE_SOURCE.replace('Omitted rules.', 'Revised omitted rules.'));
  const state = await snapshot(root);
  await assert.rejects(checkSkills({ root }), /Generated materials are out of date/);
  assert.deepEqual(await snapshot(root), state);
  await buildSkills({ root });
  const after = await read(`${SKILL}/references/implementation.md`);
  assert.notEqual(before, after);
  assert.equal(before.slice(before.indexOf('# Engineering\r\n')), after.slice(after.indexOf('# Engineering\r\n')));
  await checkSkills({ root });
});

test('excerpt boundaries have one original line ending while fenced bytes and nonempty-line spacing stay unchanged', async t => {
  const { root, manifest, saveManifest, read } = await fixture(t);
  const source = manifest.skills[0].sources.find(source => source.path === 'principles/engineering.md')!;
  source.sections = ['1. Boundaries'];
  await saveManifest();
  for (const newline of ['\n', '\r\n']) {
    const fenced = ['```text', 'Code keeps its trailing spaces.  ', '', '', '```'].join(newline);
    const section = ['## 1. Boundaries', '', fenced, '', 'The final nonempty line keeps its spaces.  '].join(newline);
    await write(root, source.path, ['# Engineering', '', section, '', '', '## 2. Next', '', 'Excluded.'].join(newline) + newline);
    await buildSkills({ root });
    const generated = await read(`${SKILL}/references/principles/engineering.md`);
    // Only the final section separator is normalized. The entire selected
    // section, including blank lines inside fenced code, remains byte-exact.
    assert.ok(generated.endsWith(section + newline));
    assert.ok(!generated.endsWith(newline + newline));
    assert.ok(generated.includes(fenced));
    await checkSkills({ root });
    const openFence = ['# Engineering', '', '## 1. Boundaries', '', '```text', 'Unclosed fenced code.', '', '', ''].join(newline);
    await write(root, source.path, openFence);
    await buildSkills({ root });
    assert.ok((await read(`${SKILL}/references/principles/engineering.md`)).endsWith(openFence.slice(openFence.indexOf('## 1. Boundaries'))));
  }
});

test('section selectors reject missing, code-only, duplicate, ambiguous and overlapping headings', async t => {
  const { root, manifest, saveManifest } = await selectiveFixture(t);
  const source = manifest.skills[0].sources.find(source => source.path === 'principles/engineering.md')!;
  for (const sections of [[], ['Not present'], ['Fake fenced section'], ['Fake indented section'], ['2. Kept', '2. Kept'], ['2. Kept', 'Shared'], ['Engineering', '2. Kept']]) {
    source.sections = sections;
    await saveManifest();
    await assert.rejects(buildSkills({ root }), /sections must|unknown section selector|duplicate section selector|ambiguous section selector|overlapping section selectors/);
    await assert.rejects(fs.access(path.join(root, `${SKILL}/references`)));
  }
  await write(root, 'principles/engineering.md', SELECTIVE_SOURCE.replace('### Shared\r\n\r\nThe second', '### Unique child\r\n\r\nThe second'));
  source.sections = ['2. Kept', 'Unique child'];
  await saveManifest();
  await assert.rejects(buildSkills({ root }), /overlapping section selectors/);
});

test('custom output paths cannot escape generated roots, collide, shadow reserved files, or relocate the license', async t => {
  const { root, manifest, saveManifest } = await fixture(t);
  const source = manifest.skills[0].sources.find(source => source.path === 'principles/engineering.md')!;
  for (const output of ['../outside.md', 'SKILL.md', 'assets/example.md', 'references/../outside.md', 'references/index.md', 'references/sources.json', 'references/index.md/nested.md', 'references/ADOPTION.md']) {
    source.output = output;
    await saveManifest();
    await assert.rejects(buildSkills({ root }), /safe repository-relative|Output must|duplicate output/);
  }
  delete source.output;
  const license = manifest.skills[0].sources.find(source => source.path === 'LICENSE')!;
  license.output = 'references/terms.md';
  await saveManifest();
  await assert.rejects(buildSkills({ root }), /LICENSE must remain complete/);
  delete license.output;
  license.sections = ['Some terms'];
  await saveManifest();
  await assert.rejects(buildSkills({ root }), /LICENSE must remain complete/);
});

test('ADOPTION, README and CHARTER are not required distribution sources and the index does not link to absent local policy files', async t => {
  const { root, manifest, saveManifest, read } = await fixture(t);
  manifest.skills[0].sources = manifest.skills[0].sources.filter(source => !['ADOPTION.md', 'README.md'].includes(source.path));
  await saveManifest();
  await buildSkills({ root });
  const index = await read(`${SKILL}/references/index.md`);
  assert.ok(index.includes(`[the adoption process](${BASE}ADOPTION.md)`));
  assert.ok(!index.includes('](ADOPTION.md)'));
  await assert.rejects(fs.access(path.join(root, `${SKILL}/references/ADOPTION.md`)));
  await assert.rejects(fs.access(path.join(root, `${SKILL}/references/README.md`)));
  assert.ok((await read(`${SKILL}/references/principles/engineering.md`)).includes(`[Adoption](${BASE}ADOPTION.md#2-levels)`));
  await checkSkills({ root });
});

test('schema-1 inventory migrates owned output paths safely and prunes only retired empty directory ancestors', async t => {
  const { root, manifest, saveManifest, read } = await fixture(t);
  await buildSkills({ root });
  const legacy = JSON.parse(await read(`${SKILL}/references/sources.json`));
  legacy.schemaVersion = 1;
  for (const source of legacy.sources) delete source.selection;
  await write(root, `${SKILL}/references/sources.json`, JSON.stringify(legacy, null, 2) + '\n');
  await fs.mkdir(path.join(root, `${SKILL}/references/handwritten-empty`));
  const source = manifest.skills[0].sources.find(source => source.path === 'principles/engineering.md')!;
  source.output = 'references/implementation.md';
  source.sections = ['1. Boundaries'];
  await saveManifest();
  await write(root, `${SKILL}/SKILL.md`, ENTRY.replace('references/principles/engineering.md', 'references/implementation.md'));
  const before = await snapshot(root);
  await assert.rejects(checkSkills({ root }), /Generated materials are out of date/);
  assert.deepEqual(await snapshot(root), before);
  const result = await buildSkills({ root });
  assert.ok(result.removed.includes(`${SKILL}/references/principles/engineering.md`));
  await assert.rejects(fs.access(path.join(root, `${SKILL}/references/principles`)));
  assert.ok((await fs.stat(path.join(root, `${SKILL}/references/handwritten-empty`))).isDirectory());
  assert.equal(JSON.parse(await read(`${SKILL}/references/sources.json`)).schemaVersion, 2);
  assert.equal(await read(`${SKILL}/SKILL.md`), ENTRY.replace('references/principles/engineering.md', 'references/implementation.md'));
  await checkSkills({ root });
});

test('schema-1 migration refuses to delete modified old output and preserves empty unowned child directories', async t => {
  const { root, manifest, saveManifest, read } = await fixture(t);
  await buildSkills({ root });
  const legacy = JSON.parse(await read(`${SKILL}/references/sources.json`));
  legacy.schemaVersion = 1;
  for (const source of legacy.sources) delete source.selection;
  await write(root, `${SKILL}/references/sources.json`, JSON.stringify(legacy));
  const original = await read(`${SKILL}/references/principles/engineering.md`);
  await write(root, `${SKILL}/references/principles/engineering.md`, original + '\nManual change.\n');
  const source = manifest.skills[0].sources.find(source => source.path === 'principles/engineering.md')!;
  source.output = 'references/implementation.md';
  await saveManifest();
  await write(root, `${SKILL}/SKILL.md`, ENTRY.replace('references/principles/engineering.md', 'references/implementation.md'));
  await assert.rejects(buildSkills({ root }), /Refusing to remove modified generated file/);
  await write(root, `${SKILL}/references/principles/engineering.md`, original);
  await fs.mkdir(path.join(root, `${SKILL}/references/principles/handwritten-empty`));
  await buildSkills({ root });
  assert.ok((await fs.stat(path.join(root, `${SKILL}/references/principles/handwritten-empty`))).isDirectory());
  await checkSkills({ root });
});

test('a generated excerpt bundle stays locally self-contained after independent copying and source removal', async t => {
  const { root } = await selectiveFixture(t);
  await buildSkills({ root });
  const portable = await fs.mkdtemp(path.join(os.tmpdir(), 'craft-excerpt-portable-'));
  t.after(() => fs.rm(portable, { recursive: true, force: true }));
  await fs.cp(path.join(root, SKILL), portable, { recursive: true });
  await fs.rm(root, { recursive: true });
  const realRoot = await fs.realpath(portable);
  let checked = 0;
  async function inspectMarkdown(name: string) {
    const file = path.join(portable, name);
    if ((await fs.stat(file)).isDirectory()) {
      for (const child of await fs.readdir(file)) await inspectMarkdown(path.posix.join(name, child));
    } else if (name.endsWith('.md')) {
      const markdown = (await fs.readFile(file, 'utf8')).replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, '').replace(/^ {4}.*$/gm, '').replace(/`[^`]*`/g, '');
      for (const link of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^[a-z][a-z0-9+.-]*:/i.test(link[1])) continue;
        const target = decodeURIComponent(link[1].split(/[?#]/)[0]);
        const location = target ? path.resolve(path.dirname(file), target) : file;
        assert.ok((await fs.realpath(location)).startsWith(realRoot + path.sep), `${name} -> ${target}`);
        checked++;
      }
    }
  }
  await inspectMarkdown('.');
  assert.ok(checked > 10);
});
