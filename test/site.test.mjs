import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

test('homepage includes core landing page sections', async () => {
  const html = await read('src/index.html');

  assert.match(html, /PureEssence/);
  assert.match(html, /id="collection"/);
  assert.match(html, /id="ritual"/);
  assert.match(html, /id="stories"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /autocomplete="email"/);
  assert.match(html, /aria-labelledby="newsletter-heading"/);
  assert.match(html, /required/);
});

test('build output preserves stylesheet and script references', async () => {
  const html = await read('dist/index.html');
  const css = await read('dist/styles.css');
  const script = await read('dist/main.js');

  assert.match(html, /styles\.css/);
  assert.match(html, /main\.js/);
  assert.match(css, /--accent-dark/);
  assert.match(script, /PureEssence updates are on the way/);
});
