import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(appRoutes)],
    });
  });

  it('should render the home page on the root path', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe(
      'Microfrontend 2',
    );
  });
});
