import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerComponent } from './owner.component';
import { OwnerEditComponent } from './owners/owner-edit/owner-edit.component';
import { OwnersComponent } from './owners/owners.component';

const routes: Routes = [
	{
		path: '',
		component: OwnerComponent,
		children: [
			{
				path: 'owners',
				children: [
					{
						path: '',
						component: OwnersComponent,
					},
					{
						path: ':id',
						component: OwnerEditComponent,
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
export class OwnerRoutingModule {}
