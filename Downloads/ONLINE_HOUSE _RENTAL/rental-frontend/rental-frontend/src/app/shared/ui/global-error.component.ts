import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-global-error',
  standalone: true,
  template: `<div class="global-error"><h2>{{ code }}</h2><p>{{ message }}</p></div>`,
  styles: [`.global-error { text-align: center; color: #e53935; margin: 3rem 0; } h2 { font-size: 2.5rem; }`]
})
export class GlobalErrorComponent {
  @Input() code = 'Error';
  @Input() message = 'An unexpected error occurred.';
}
