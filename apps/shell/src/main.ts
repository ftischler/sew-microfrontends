import { initFederation } from '@angular-architects/native-federation';
import { consoleLogger } from '@softarc/native-federation-orchestrator/options';

initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
  strict: false,
  logger: consoleLogger,
  logLevel: 'warn',
})
  .then((federation) =>
    import('./bootstrap').then(({ bootstrap }) => bootstrap(federation)),
  )
  .catch((err) => console.error(err));
