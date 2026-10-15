import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Route,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RemoteLoadError, redirectToRemoteUnavailable } from './remote-loader';
import { RemoteUnavailablePage } from './remote-unavailable-page';

@Component({ template: `<h2>Remote page</h2>` })
class RemotePage {}

describe('RemoteUnavailablePage', () => {
  let remoteIsUp: boolean;

  beforeEach(() => {
    remoteIsUp = false;
    const routes: Route[] = [
      {
        path: 'remote',
        loadChildren: async () => {
          if (!remoteIsUp) {
            throw new RemoteLoadError('remote', new Error('offline'));
          }
          return [{ path: '', component: RemotePage }];
        },
      },
      { path: 'remote-unavailable/:name', component: RemoteUnavailablePage },
    ];
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          routes,
          withComponentInputBinding(),
          withNavigationErrorHandler(redirectToRemoteUnavailable),
        ),
      ],
    });
  });

  function heading(harness: RouterTestingHarness): string | undefined {
    return harness.routeNativeElement?.querySelector('h2')?.textContent ?? '';
  }

  it('should show the fallback while keeping the requested url', async () => {
    const harness = await RouterTestingHarness.create('/remote');

    expect(heading(harness)).toBe('remote is currently unavailable');
    expect(TestBed.inject(Location).path()).toBe('/remote');
  });

  it('should load the remote on retry once it is back', async () => {
    const harness = await RouterTestingHarness.create('/remote');
    remoteIsUp = true;

    harness.routeNativeElement?.querySelector('button')?.click();
    await harness.fixture.whenStable();

    expect(heading(harness)).toBe('Remote page');
  });
});
