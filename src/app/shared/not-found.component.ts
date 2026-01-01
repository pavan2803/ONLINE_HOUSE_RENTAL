import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `<div class="not-found"><h2>404 - Page Not Found</h2></div>`,
  styles: [`.not-found { text-align: center; margin-top: 3rem; color: #888; }`]
})
export class NotFoundComponent {}
