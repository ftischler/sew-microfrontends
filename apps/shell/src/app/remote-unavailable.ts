import { Component, input } from '@angular/core';

@Component({
  selector: 'shell-remote-unavailable',
  template: `
    <h2>{{ name() }} is currently unavailable</h2>
    <p>The rest of the application keeps working. Please try again later.</p>
  `,
})
export class RemoteUnavailable {
  readonly name = input.required<string>();
}
