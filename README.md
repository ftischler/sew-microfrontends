# sew-microfrontends

Nx monorepo with an Angular shell and two micro frontends, integrated via Native Federation.

| App   | Port | Role   |
| ----- | ---- | ------ |
| shell | 4200 | Host   |
| mfe1  | 4201 | Remote |
| mfe2  | 4202 | Remote |

```sh
npm install
npx nx serve shell
npx nx run-many -t build lint test
```
