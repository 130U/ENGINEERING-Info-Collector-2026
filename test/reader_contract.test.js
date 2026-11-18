import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('README presents the reader workflow in English', () => {
  const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
  for (const phrase of ['collect', 'understand', 'organize', 'keep', 'review']) {
    assert.ok(readme.toLowerCase().includes(phrase), `README is missing: ${phrase}`);
  }
  assert.equal(/[\u3400-\u9fff\uf900-\ufaff]/u.test(readme), false, 'README should use English throughout');
  for (const page of ['docs/engineering-route.md', 'docs/prior-art.md']) {
    assert.ok(readme.includes(`](${page})`), `README should link ${page}`);
  }
});

test('Pages 部署只允许手动触发，避免项目站自动占用账号自定义域名路径', () => {
  const workflow = readFileSync(join(ROOT, '.github', 'workflows', 'deploy-reading-site.yml'), 'utf8');
  assert.match(workflow, /workflow_dispatch:/);
  assert.equal(workflow.includes('push:'), false);
  assert.equal(workflow.includes('pull_request:'), false);
});
