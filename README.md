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
