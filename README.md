# sew-microfrontends

Nx monorepo with an Angular shell and two micro frontends, integrated via Native Federation.

| App   | Port | Role   |
| ----- | ---- | ------ |
| shell | 4200 | Host   |
| mfe1  | 4201 | Remote |
| mfe2  | 4202 | Remote |

```sh
pnpm install
pnpm nx run-many -t serve
pnpm nx run-many -t build lint test
```

## Dynamic federation

The shell knows no remote at build time. On startup it reads
`apps/shell/public/federation.manifest.json`, which maps each remote name to its
`remoteEntry.json` URL. `main.ts` hands the result of `initFederation` to the app,
and `RemoteLoader` (`apps/shell/src/app/remote-loader.ts`) loads a remote's exposed
`./routes` through it.

Each remote exposes its routes in `apps/<remote>/federation.config.mjs` and still
runs standalone on its own port.

## Remotes on a different Angular version

[mfe3](https://github.com/ftischler/sew-microfrontends-mfe3) lives in its own repo on
Angular 21. It shares no packages with the shell, ships its own zoneless runtime and is
exposed as the web component `<sew-mfe3>`. `apps/shell/src/app/mfe3-host.ts` loads it,
passes the sub path below `/mfe3` and turns its `mfe3-navigate` events into router
navigation, so the shell stays the only owner of the URL.

## Safety nets

**Runtime stays lenient.** `initFederation` runs with `strict: false`. With strict
checks a single incompatible remote stops the import map from being built and takes the
whole shell down. Instead, the orchestrator logs warnings to the console and scopes an
incompatible remote onto its own copy of the shared packages.

**A broken remote only breaks its own route.** If a remote cannot be loaded, the shell
shows `RemoteUnavailable` for that route and keeps the requested URL. "Try again"
re-initializes the remote from the manifest, so a remote that comes back works without
reloading the page.

**Compatibility is enforced before deployment.** `pnpm federation:check` compares the
shared singletons of every remote with the host and fails on a strict version mismatch.
Remotes that share nothing, like mfe3, are reported as isolated. CI runs it against the
remotes built in this repo. Run it against an environment before changing its manifest:

```sh
pnpm federation:check \
  --host https://<env>/remoteEntry.json \
  --manifest https://<env>/federation.manifest.json \
  --remote mfe3=https://<new-mfe3-build>/remoteEntry.json
```
