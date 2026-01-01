import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', loadComponent: () => import('./my-bookings.component').then(m => m.MyBookingsComponent) },
  { path: 'request/:propertyId', loadComponent: () => import('./booking-request.component').then(m => m.BookingRequestComponent) }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BookingModule {}
