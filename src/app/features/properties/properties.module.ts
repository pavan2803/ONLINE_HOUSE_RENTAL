import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyListComponent } from './property-list.component';

const routes: Routes = [
  { path: '', loadComponent: () => import('./property-list.component').then(m => m.PropertyListComponent) },
  { path: ':id', loadComponent: () => import('./property-details.component').then(m => m.PropertyDetailsComponent) }
];

@NgModule({
  declarations: [PropertyListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PropertiesModule {}
