import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

function runQuiet(command) {
  try {
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const version = pkg.version;
const tag = `v${version}`;
const repoUrl = pkg.repository?.url ?? '';
const repo = repoUrl.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');

if (!repo) {
  throw new Error('Unable to resolve repository from package.json');
}

if (!runQuiet('gh --version') || !runQuiet('gh auth status')) {
  throw new Error('GitHub CLI must be installed and authenticated (`gh auth login`).');
}

const artifactsDir = path.resolve('artifacts');
if (!existsSync(artifactsDir)) {
  mkdirSync(artifactsDir, { recursive: true });
}

const files = readdirSync(artifactsDir)
  .filter((file) => file.endsWith('.tgz'))
  .map((file) => path.join('artifacts', file));

if (files.length === 0) {
  throw new Error('No package artifacts found in ./artifacts. Run npm pack first.');
}

const quotedFiles = files.map((file) => `"${file}"`).join(' ');

if (runQuiet(`gh release view "${tag}" --repo "${repo}"`)) {
  run(`gh release upload "${tag}" ${quotedFiles} --repo "${repo}" --clobber`);
} else {
  run(`gh release create "${tag}" ${quotedFiles} --repo "${repo}" --title "${tag}" --notes "Release ${tag}"`);
}
