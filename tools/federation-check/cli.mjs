import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { checkCompatibility } from './check-compatibility.mjs';

const usage = `Usage:
  node tools/federation-check/cli.mjs --host <file|url> --remote <name>=<file|url> [--remote ...]
  node tools/federation-check/cli.mjs --host <file|url> --manifest <file|url>`;

async function readJson(location) {
  if (/^https?:\/\//.test(location)) {
    const response = await fetch(location);
    if (!response.ok) {
      throw new Error(`${location} returned ${response.status}`);
    }
    return response.json();
  }
  return JSON.parse(await readFile(location, 'utf8'));
}

async function readRemoteLocations({ remote = [], manifest }) {
  const locations = Object.fromEntries(
    remote.map((entry) => {
      const separator = entry.indexOf('=');
      return [entry.slice(0, separator), entry.slice(separator + 1)];
    }),
  );
  return manifest ? { ...(await readJson(manifest)), ...locations } : locations;
}

async function main() {
  const { values } = parseArgs({
    options: {
      host: { type: 'string' },
      remote: { type: 'string', multiple: true },
      manifest: { type: 'string' },
    },
  });
  if (!values.host || (!values.remote && !values.manifest)) {
    console.error(usage);
    return 2;
  }

  const host = await readJson(values.host);
  const remotes = {};
  let unreachable = 0;
  for (const [name, location] of Object.entries(
    await readRemoteLocations(values),
  )) {
    try {
      remotes[name] = await readJson(location);
    } catch (err) {
      console.error(`✗ ${name}: remoteEntry not reachable (${err.message})`);
      unreachable++;
    }
  }

  const results = checkCompatibility(host, remotes);
  for (const { remoteName, isolated, errors, warnings } of results) {
    const mode = isolated ? 'isolated, shares nothing with host' : 'shared';
    console.log(`${errors.length ? '✗' : '✓'} ${remoteName} (${mode})`);
    errors.forEach((message) => console.log(`    error   ${message}`));
    warnings.forEach((message) => console.log(`    warning ${message}`));
  }

  const failed = unreachable + results.filter((r) => r.errors.length).length;
  return failed ? 1 : 0;
}

process.exitCode = await main();
