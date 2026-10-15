import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { Home } from './home';
import { Mfe3Host } from './mfe3-host';
import { RemoteLoader } from './remote-loader';
import { RemoteUnavailablePage } from './remote-unavailable-page';

interface RemoteRoutesModule {
  appRoutes: Route[];
}

function loadRemoteRoutes(remoteName: string): () => Promise<Route[]> {
  return () =>
    inject(RemoteLoader)
      .load<RemoteRoutesModule>(remoteName, './routes')
      .then((module) => module.appRoutes);
}

export const appRoutes: Route[] = [
  { path: '', component: Home },
  { path: 'mfe1', loadChildren: loadRemoteRoutes('mfe1') },
  { path: 'mfe2', loadChildren: loadRemoteRoutes('mfe2') },
  { path: 'mfe3', children: [{ path: '**', component: Mfe3Host }] },
  { path: 'remote-unavailable/:name', component: RemoteUnavailablePage },
  { path: '**', redirectTo: '' },
];
