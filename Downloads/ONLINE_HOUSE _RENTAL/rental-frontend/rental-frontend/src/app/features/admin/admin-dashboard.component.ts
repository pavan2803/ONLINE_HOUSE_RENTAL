import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `<div class="admin-dashboard"><h2>Admin Dashboard</h2><p>Admin analytics and moderation will appear here.</p></div>`,
  styles: [`.admin-dashboard { padding: 2rem; }`]
})
export class AdminDashboardComponent {}
