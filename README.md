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
`remoteEntry.json` URL. Routes then load a remote's exposed `./routes` with
`loadRemoteModule('<remote>', './routes')`.

Each remote exposes its routes in `apps/<remote>/federation.config.mjs` and still
runs standalone on its own port.

## Remotes on a different Angular version

[mfe3](https://github.com/ftischler/sew-microfrontends-mfe3) lives in its own repo on
Angular 21. It shares no packages with the shell, ships its own zoneless runtime and is
exposed as the web component `<sew-mfe3>`. `apps/shell/src/app/mfe3-host.ts` loads it,
passes the sub path below `/mfe3` and turns its `mfe3-navigate` events into router
navigation, so the shell stays the only owner of the URL.

If a remote cannot be loaded, the shell renders `RemoteUnavailable` for that route and
everything else keeps working.
