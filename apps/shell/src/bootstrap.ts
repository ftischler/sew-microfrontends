import { NativeFederationResult } from '@angular-architects/native-federation';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideNativeFederation } from './app/remote-loader';

export function bootstrap(federation: NativeFederationResult): Promise<void> {
  return bootstrapApplication(App, {
    providers: [...appConfig.providers, provideNativeFederation(federation)],
  }).then(() => undefined);
}
