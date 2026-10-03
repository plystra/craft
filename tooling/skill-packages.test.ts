// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 immoses (Moses Qiu)
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
type Source = { path: string; output: string; sections?: string[] };
type Skill = { name: string; sources: Source[] };
const manifest = JSON.parse(await fs.readFile(path.join(root, 'tooling/skills-manifest.json'), 'utf8')) as { schemaVersion: number; skills: Skill[] };

async function files(directory: string, prefix = ''): Promise<string[]> {
  const result: string[] = [];
  for (const name of (await fs.readdir(path.join(directory, prefix))).sort()) {
    const relative = path.posix.join(prefix, name);
    const stat = await fs.lstat(path.join(directory, relative));
    assert.equal(stat.isSymbolicLink(), false, `Package must contain real resources: ${relative}`);
    if (stat.isDirectory()) result.push(...await files(directory, relative));
    else result.push(relative);
  }
  return result;
}

// Inspect the actual distributed Markdown, excluding literal code examples.
// These packages use inline links; generator tests cover the broader syntax.
function localLinks(markdown: string): string[] {
  let fence: string | undefined;
  const prose = markdown.split('\n').map(line => {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (marker?.[0] === fence[0] && marker.length >= fence.length) fence = undefined;
      return '';
    }
    if (marker) { fence = marker; return ''; }
    if (/^(?: {4}|\t)/.test(line)) return '';
    return line.replace(/(`+)[\s\S]*?\1/g, '');
  }).join('\n');
  return [...prose.matchAll(/\[[^\]\n]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)]
    .map(match => match[1] ?? match[2])
    .filter(target => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target))
    .map(target => decodeURIComponent(target.split(/[?#]/, 1)[0]));
}

const CORE = 'plystra-craft';
const MODULES = ['plystra-craft-code', 'plystra-craft-design', 'plystra-craft-website', 'plystra-craft-stewardship'];

test('skills are one required base skill plus surface modules', async () => {
  assert.equal(manifest.schemaVersion, 2);
  assert.deepEqual(manifest.skills.map(skill => skill.name).sort(), [CORE, ...MODULES].sort());
  const website = manifest.skills.find(skill => skill.name === 'plystra-craft-website')!;
  assert.ok(website.sources.some(source => source.path === 'principles/13-websites-search-and-sharing.md' && !source.sections),
    'An official site needs the complete website standard');
  for (const name of MODULES) {
    const entry = await fs.readFile(path.join(root, 'skills', name, 'SKILL.md'), 'utf8');
    const description = /^description:\s*"?(.*?)"?$/m.exec(entry)?.[1] ?? '';
    assert.match(description, /Requires plystra-craft\./, `${name} must declare its dependency on plystra-craft in its description`);
    assert.match(entry, /--skill plystra-craft/, `${name} must tell the user how to install plystra-craft`);
  }
});

test('each canonical section is distributed by exactly one skill', () => {
  const owners = new Map<string, { skill: string; sections: string[] | null }[]>();
  for (const skill of manifest.skills) {
    for (const source of skill.sources) {
      if (source.path === 'LICENSE') continue;
      owners.set(source.path, [...(owners.get(source.path) ?? []), { skill: skill.name, sections: source.sections ?? null }]);
    }
  }
  for (const [file, uses] of owners) {
    for (let i = 0; i < uses.length; i++) {
      for (let j = i + 1; j < uses.length; j++) {
        const [a, b] = [uses[i], uses[j]];
        assert.ok(a.sections && b.sections, `${file} is complete in ${a.sections ? b.skill : a.skill} and must not also appear in ${a.sections ? a.skill : b.skill}`);
        const shared = a.sections.filter(section => b.sections!.includes(section));
        assert.deepEqual(shared, [], `${file} sections shipped by both ${a.skill} and ${b.skill}`);
      }
    }
  }
});

test('each real skill can be copied alone with only its declared task resources', async t => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'craft-distribution-'));
  t.after(() => fs.rm(temporary, { recursive: true, force: true }));
  for (const skill of manifest.skills) {
    await t.test(skill.name, async () => {
      const destination = path.join(temporary, skill.name);
      await fs.cp(path.join(root, 'skills', skill.name), destination, { recursive: true });
      const realDestination = await fs.realpath(destination);
      const actual = await files(destination);
      const expected = ['SKILL.md', 'references/index.md', 'references/sources.json', ...skill.sources.map(source => source.output)].sort();
      assert.deepEqual(actual.sort(), expected, 'Distribute only the entry point, declared resources, and provenance');
      for (const source of skill.sources) {
        assert.ok(/^(?:references\/[^/]+|assets\/templates\/[^/]+)$/.test(source.output), `Use task-specific flat resources: ${source.output}`);
        if (source.path === 'README.md') assert.ok(source.sections?.length, 'Distribute only the README sections a skill needs, never the repository front page');
        assert.ok(!/^references\/(?:README|CHARTER|ADOPTION)\.md$/.test(source.output));
      }
      for (const name of actual.filter(name => name.endsWith('.md'))) {
        for (const target of localLinks(await fs.readFile(path.join(destination, name), 'utf8'))) {
          const resolved = path.resolve(destination, path.dirname(name), target);
          assert.ok(resolved.startsWith(destination + path.sep), `${skill.name}/${name} escapes its package: ${target}`);
          const realTarget = await fs.realpath(resolved);
          assert.ok(realTarget.startsWith(realDestination + path.sep), `${skill.name}/${name} requires another checkout: ${target}`);
          assert.equal((await fs.stat(resolved)).isFile(), true);
        }
      }
      await assert.rejects(fs.access(path.join(destination, 'references/principles')));
    });
  }
});
