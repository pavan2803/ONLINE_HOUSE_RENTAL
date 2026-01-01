import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { path: 'not-authorized', loadComponent: () => import('./not-authorized.component').then(m => m.NotAuthorizedComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
