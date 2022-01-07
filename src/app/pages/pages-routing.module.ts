import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () =>
					import('./dashboard/dashboard.module').then(
						(m) => m.DashboardModule
					),
			},
			{
				path: 'builder',
				loadChildren: () =>
					import('./builder/builder.module').then(
						(m) => m.BuilderModule
					),
			},
			{
				path: 'user-management',
				loadChildren: () =>
					import(
						'../modules/user-management/user-management.module'
					).then((m) => m.UserManagementModule),
			},
			{
				path: 'pet-management',
				loadChildren: () =>
					import(
						'../modules/pet-management/pet-management.module'
					).then((m) => m.PetManagementModule),
			},
			{
				path: 'owner',
				loadChildren: () =>
					import('../modules/owner/owner.module').then(
						(m) => m.OwnerModule
					),
			},
			{
				path: 'user-profile',
				loadChildren: () =>
					import('../modules/user-profile/user-profile.module').then(
						(m) => m.UserProfileModule
					),
			},
			{
				path: '',
				redirectTo: '/dashboard',
				pathMatch: 'full',
			},
			{
				path: '**',
				redirectTo: 'error/404',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {}
