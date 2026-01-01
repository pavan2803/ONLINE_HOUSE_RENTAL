import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed RouterModule import
import { MaterialModule } from '../core/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [NavbarComponent, SidenavComponent, BreadcrumbsComponent],
  imports: [CommonModule, MaterialModule],
  exports: [NavbarComponent, SidenavComponent, BreadcrumbsComponent, MaterialModule]
})
export class SharedModule {}
