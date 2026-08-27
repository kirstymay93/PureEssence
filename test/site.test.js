const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

test('website source files exist', () => {
  for (const file of ['index.html', 'styles.css', 'script.js']) {
    assert.equal(fs.existsSync(path.join(publicDir, file)), true);
  }
});

test('home page includes core sections', () => {
  const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

  for (const section of ['PureEssence', 'Services', 'Gallery', 'Contact']) {
    assert.match(html, new RegExp(section));
  }
});

test('build output is created when present', () => {
  const distIndex = path.join(root, 'dist', 'index.html');

  if (fs.existsSync(distIndex)) {
    assert.match(fs.readFileSync(distIndex, 'utf8'), /PureEssence/);
  }
});
