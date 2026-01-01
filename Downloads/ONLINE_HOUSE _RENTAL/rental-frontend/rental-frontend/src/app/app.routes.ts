import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'properties',
		loadChildren: () => import('./features/properties/properties.module').then(m => m.PropertiesModule),
		canActivate: [authGuard(['tenant'])]
	},
	{
		path: 'booking',
		loadChildren: () => import('./features/booking/booking.module').then(m => m.BookingModule),
		canActivate: [authGuard(['tenant'])]
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
		canActivate: [authGuard(['owner'])]
	},
	{
		path: 'admin',
		loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
		canActivate: [authGuard(['admin'])]
	},
	{
		path: '',
		redirectTo: '/properties',
		pathMatch: 'full'
	},
	{
		path: '**',
		loadComponent: () => import('./shared/not-found.component').then(m => m.NotFoundComponent)
	}
];
