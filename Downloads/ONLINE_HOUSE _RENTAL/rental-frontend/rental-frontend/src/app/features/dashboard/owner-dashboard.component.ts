import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  template: `<div class="owner-dashboard"><h2>Owner Dashboard</h2><p>Dashboard overview and property management will appear here.</p></div>`,
  styles: [`.owner-dashboard { padding: 2rem; }`]
})
export class OwnerDashboardComponent {}
