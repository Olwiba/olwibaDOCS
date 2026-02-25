import { execSync, spawnSync } from 'node:child_process';
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

function runPublish() {
  const result = spawnSync('npm', ['publish'], { encoding: 'utf8' });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

  if (result.status === 0) {
    process.stdout.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    return { ok: true, ignored: false };
  }

  const alreadyPublished =
    /cannot publish over the previously published versions/i.test(output) ||
    /you cannot publish over the previously published versions/i.test(output) ||
    /previously published/i.test(output);

  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');

  if (alreadyPublished) {
    console.warn('npm publish skipped: version is already published.');
    return { ok: true, ignored: true };
  }

  console.warn('npm publish failed. Continuing to upload release assets.');
  return { ok: false, ignored: false, output };
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
const publishResult = runPublish();

if (runQuiet(`gh release view "${tag}" --repo "${repo}"`)) {
  run(`gh release upload "${tag}" ${quotedFiles} --repo "${repo}" --clobber`);
} else {
  run(`gh release create "${tag}" ${quotedFiles} --repo "${repo}" --title "${tag}" --notes "Release ${tag}"`);
}

if (!publishResult.ok) {
  process.exitCode = 1;
}
