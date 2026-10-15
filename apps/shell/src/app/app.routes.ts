import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';
import { Home } from './home';

export const appRoutes: Route[] = [
  { path: '', component: Home },
  {
    path: 'mfe1',
    loadChildren: () =>
      loadRemoteModule('mfe1', './routes').then((m) => m.appRoutes),
  },
  {
    path: 'mfe2',
    loadChildren: () =>
      loadRemoteModule('mfe2', './routes').then((m) => m.appRoutes),
  },
  { path: '**', redirectTo: '' },
];
