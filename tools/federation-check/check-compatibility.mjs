import semver from 'semver';

export function checkCompatibility(host, remotes) {
  const hostShared = new Map(
    host.shared.map((external) => [external.packageName, external]),
  );
  const results = [];

  for (const [remoteName, remote] of Object.entries(remotes)) {
    const errors = [];
    const warnings = [];
    const sharedWithHost = remote.shared.filter(
      (external) =>
        external.singleton && hostShared.get(external.packageName)?.singleton,
    );

    for (const external of sharedWithHost) {
      const hostVersion = hostShared.get(external.packageName).version;
      const accepted = semver.satisfies(hostVersion, external.requiredVersion, {
        includePrerelease: true,
      });
      const message = `${external.packageName}: requires ${external.requiredVersion}, host provides ${hostVersion}`;

      if (!accepted && external.strictVersion) {
        errors.push(message);
      } else if (!accepted) {
        warnings.push(message);
      } else if (semver.major(hostVersion) !== semver.major(external.version)) {
        warnings.push(
          `${external.packageName}: built with ${external.version}, runs on host ${hostVersion}`,
        );
      }
    }

    results.push({
      remoteName,
      isolated: sharedWithHost.length === 0,
      errors,
      warnings,
    });
  }

  return results;
}
