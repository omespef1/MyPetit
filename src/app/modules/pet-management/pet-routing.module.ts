import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetManagementComponent } from './pet-management.component';
import { PetTypeComponent } from './pet-type/pet-type.component';
import { TagsComponent } from './tags/tags.component';

const routes: Routes = [
	{
		path: '',
		component: PetManagementComponent,
		children: [
			{
				path: 'types',
				children: [
					{
						path: '',
						component: PetTypeComponent,
					},
					// {
					// 	path: ':id',
					// 	component: UserEditComponent,
					// },
				],
			},
			{
				path: 'tags',
				children: [
					{
						path: '',
						component: TagsComponent,
					},
					// {
					// 	path: ':id',
					// 	component: UserEditComponent,
					// },
				],
			},
			{ path: '', redirectTo: 'types', pathMatch: 'full' },
			{ path: '**', redirectTo: 'types', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PetManagementRoutingModule {}
