import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { redirectToRemoteUnavailable } from './remote-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withNavigationErrorHandler(redirectToRemoteUnavailable),
    ),
  ],
};
