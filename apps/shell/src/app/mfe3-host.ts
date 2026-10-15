import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  resource,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { RemoteLoader } from './remote-loader';
import { RemoteUnavailable } from './remote-unavailable';

interface Mfe3WebComponentModule {
  registerMfe3Element(): Promise<void>;
}

@Component({
  selector: 'shell-mfe3-host',
  imports: [RemoteUnavailable],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @switch (element.status()) {
      @case ('resolved') {
        <sew-mfe3 [path]="path()" (mfe3-navigate)="navigate($event)"></sew-mfe3>
      }
      @case ('error') {
        <shell-remote-unavailable name="mfe3" (retry)="element.reload()" />
      }
      @default {
        <p>Loading mfe3 ...</p>
      }
    }
  `,
})
export class Mfe3Host {
  private readonly router = inject(Router);
  private readonly remoteLoader = inject(RemoteLoader);

  protected readonly path = toSignal(
    inject(ActivatedRoute).url.pipe(
      map((segments) => segments.map((segment) => segment.path).join('/')),
    ),
    { initialValue: '' },
  );

  protected readonly element = resource({
    loader: () =>
      this.remoteLoader
        .load<Mfe3WebComponentModule>('mfe3', './web-component')
        .then((module) => module.registerMfe3Element()),
  });

  protected navigate(event: Event): void {
    const path = (event as CustomEvent<string>).detail;
    this.router.navigate(['/mfe3', ...path.split('/').filter(Boolean)]);
  }
}
