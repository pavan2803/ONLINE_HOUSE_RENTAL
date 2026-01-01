import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-request',
  standalone: true,
  template: `<div class="booking-request"><h2>Booking Request</h2><p>Booking request form will appear here.</p></div>`,
  styles: [`.booking-request { padding: 2rem; }`]
})
export class BookingRequestComponent {}
