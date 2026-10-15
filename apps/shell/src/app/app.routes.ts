import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';
import { Home } from './home';
import { Mfe3Host } from './mfe3-host';
import { RemoteUnavailable } from './remote-unavailable';

function loadRemoteRoutes(name: string): () => Promise<Route[]> {
  return () =>
    loadRemoteModule(name, './routes')
      .then((module) => module.appRoutes)
      .catch((err) => {
        console.error(err);
        return [{ path: '**', component: RemoteUnavailable, data: { name } }];
      });
}

export const appRoutes: Route[] = [
  { path: '', component: Home },
  { path: 'mfe1', loadChildren: loadRemoteRoutes('mfe1') },
  { path: 'mfe2', loadChildren: loadRemoteRoutes('mfe2') },
  { path: 'mfe3', children: [{ path: '**', component: Mfe3Host }] },
  { path: '**', redirectTo: '' },
];
