import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span [ngClass]="status" class="status-badge">{{ status | titlecase }}</span>` ,
  styles: [`
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.9rem; color: #fff; }
    .pending { background: #ffb300; }
    .approved { background: #43a047; }
    .rejected { background: #e53935; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: 'pending' | 'approved' | 'rejected' = 'pending';
}
