import { NativeFederationResult } from '@angular-architects/native-federation';
import {
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { NavigationError, RedirectCommand, Router } from '@angular/router';

type FederationManifest = Record<string, string>;

const NATIVE_FEDERATION = new InjectionToken<NativeFederationResult>(
  'NATIVE_FEDERATION',
);

export function provideNativeFederation(federation: NativeFederationResult) {
  return makeEnvironmentProviders([
    { provide: NATIVE_FEDERATION, useValue: federation },
  ]);
}

export class RemoteLoadError extends Error {
  constructor(
    readonly remoteName: string,
    cause: unknown,
  ) {
    super(`Remote "${remoteName}" could not be loaded`, { cause });
  }
}

@Injectable({ providedIn: 'root' })
export class RemoteLoader {
  private readonly federation = inject(NATIVE_FEDERATION);
  private manifest?: Promise<FederationManifest>;

  async load<T>(remoteName: string, exposedModule: string): Promise<T> {
    try {
      return await this.federation.loadRemoteModule<T>(
        remoteName,
        exposedModule,
      );
    } catch {
      return this.reinitializeAndLoad<T>(remoteName, exposedModule);
    }
  }

  private async reinitializeAndLoad<T>(
    remoteName: string,
    exposedModule: string,
  ): Promise<T> {
    try {
      const remoteEntryUrl = (await this.loadManifest())[remoteName];
      const federation = await this.federation.initRemoteEntry(
        remoteEntryUrl,
        remoteName,
      );
      return await federation.loadRemoteModule<T>(remoteName, exposedModule);
    } catch (err) {
      throw new RemoteLoadError(remoteName, err);
    }
  }

  private loadManifest(): Promise<FederationManifest> {
    this.manifest ??= fetch('federation.manifest.json')
      .then((response) => response.json() as Promise<FederationManifest>)
      .catch((err) => {
        this.manifest = undefined;
        throw err;
      });
    return this.manifest;
  }
}

export function redirectToRemoteUnavailable(
  event: NavigationError,
): RedirectCommand | void {
  if (!(event.error instanceof RemoteLoadError)) {
    return;
  }
  const router = inject(Router);
  return new RedirectCommand(
    router.createUrlTree(['/remote-unavailable', event.error.remoteName]),
    { browserUrl: event.url },
  );
}
