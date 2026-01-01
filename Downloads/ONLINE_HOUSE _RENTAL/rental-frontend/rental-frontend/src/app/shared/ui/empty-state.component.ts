import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<div class="empty-state"><mat-icon>info</mat-icon><p>{{ message }}</p></div>`,
  styles: [`.empty-state { text-align: center; color: #888; margin: 2rem 0; } mat-icon { font-size: 2rem; }`]
})
export class EmptyStateComponent {
  @Input() message = 'No data available.';
}
