import { Component, input, output } from '@angular/core';

@Component({
  selector: 'shell-remote-unavailable',
  template: `
    <h2>{{ name() }} is currently unavailable</h2>
    <p>The rest of the application keeps working.</p>
    <button type="button" (click)="retry.emit()">Try again</button>
  `,
})
export class RemoteUnavailable {
  readonly name = input.required<string>();
  readonly retry = output();
}
