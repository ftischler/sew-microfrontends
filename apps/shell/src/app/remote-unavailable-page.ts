import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { RemoteUnavailable } from './remote-unavailable';

@Component({
  selector: 'shell-remote-unavailable-page',
  imports: [RemoteUnavailable],
  template: `<shell-remote-unavailable [name]="name()" (retry)="retry()" />`,
})
export class RemoteUnavailablePage {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  readonly name = input.required<string>();

  protected retry(): void {
    this.router.navigateByUrl(this.location.path());
  }
}
