import { Component } from '@angular/core';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  template: `<div class="my-bookings"><h2>My Bookings</h2><p>Booking list will appear here.</p></div>`,
  styles: [`.my-bookings { padding: 2rem; }`]
})
export class MyBookingsComponent {}
