import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HairLengthEditComponent } from './hair-lengths/hair-length-edit/hair-length-edit.component';
import { HairLengthsComponent } from './hair-lengths/hair-lengths.component';
import { PetManagementComponent } from './pet-management.component';
import { EditServiceComponent } from './pet-service/edit-service/edit-service.component';
import { PetServiceComponent } from './pet-service/pet-service.component';
import { EditTypeComponent } from './pet-type/edit-type/edit-type.component';
import { PetTypeComponent } from './pet-type/pet-type.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';
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
					{
						path: ':id',
						component: EditTypeComponent,
					},
				],
			},
			{
				path: 'tags',
				children: [
					{
						path: '',
						component: TagsComponent,
					},
					{
						path: ':id',
						component: TagEditComponent,
					},
				],
			},
			{
				path: 'hair-lengths',
				children: [
					{
						path: '',
						component: HairLengthsComponent,
					},
					{
						path: ':id',
						component: HairLengthEditComponent,
					},
				],
			},
			{
				path: 'services',
				children: [
					{
						path: '',
						component: PetServiceComponent,
					},
					{
						path: ':id',
						component: EditServiceComponent,
					},
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
