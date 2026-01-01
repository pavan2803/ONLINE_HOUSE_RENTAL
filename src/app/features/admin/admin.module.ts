import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent) }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
