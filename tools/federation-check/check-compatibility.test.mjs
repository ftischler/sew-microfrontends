import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkCompatibility } from './check-compatibility.mjs';

const angular = (version, requiredVersion, strictVersion = true) => ({
  packageName: '@angular/core',
  version,
  requiredVersion,
  singleton: true,
  strictVersion,
});

const host = { shared: [angular('22.2.3', '~22.2.0')] };

describe('checkCompatibility', () => {
  it('accepts a remote whose range covers the host version', () => {
    const [result] = checkCompatibility(host, {
      mfe1: { shared: [angular('22.2.1', '~22.2.0')] },
    });
    assert.deepEqual(result, {
      remoteName: 'mfe1',
      isolated: false,
      errors: [],
      warnings: [],
    });
  });

  it('rejects a strict singleton that does not accept the host version', () => {
    const [result] = checkCompatibility(host, {
      legacy: { shared: [angular('21.0.0', '~21.0.0')] },
    });
    assert.deepEqual(result.errors, [
      '@angular/core: requires ~21.0.0, host provides 22.2.3',
    ]);
  });

  it('only warns for a non strict singleton', () => {
    const [result] = checkCompatibility(host, {
      legacy: { shared: [angular('21.0.0', '~21.0.0', false)] },
    });
    assert.deepEqual(result.errors, []);
    assert.equal(result.warnings.length, 1);
  });

  it('warns when a loose range lets a remote run on another major', () => {
    const [result] = checkCompatibility(host, {
      loose: { shared: [angular('21.0.0', '>=21.0.0')] },
    });
    assert.deepEqual(result.warnings, [
      '@angular/core: built with 21.0.0, runs on host 22.2.3',
    ]);
  });

  it('treats a remote that shares nothing as isolated', () => {
    const [result] = checkCompatibility(host, { mfe3: { shared: [] } });
    assert.equal(result.isolated, true);
    assert.deepEqual(result.errors, []);
  });
});
