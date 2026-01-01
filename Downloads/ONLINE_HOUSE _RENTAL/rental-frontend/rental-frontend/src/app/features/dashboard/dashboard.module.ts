import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', loadComponent: () => import('./owner-dashboard.component').then(m => m.OwnerDashboardComponent) },
  { path: 'property/:id', loadComponent: () => import('./manage-property.component').then(m => m.ManagePropertyComponent) }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
