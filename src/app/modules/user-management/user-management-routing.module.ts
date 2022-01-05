import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		children: [
			{
				path: 'users',
				children: [
					{
						path: '',
						component: UsersComponent,
					},
					{
						path: ':id',
						component: UserEditComponent,
					},
				],
			},
			{
				path: 'roles',
				component: RolesComponent,
			},
			{ path: '', redirectTo: 'users', pathMatch: 'full' },
			{ path: '**', redirectTo: 'users', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserManagementRoutingModule {}
