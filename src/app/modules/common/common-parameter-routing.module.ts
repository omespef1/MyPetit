import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CommonParameterComponent } from './common-parameter.component';
import { GroomerEditComponent } from './groomer/groomer-edit/groomer-edit.component';
import { GroomerComponent } from './groomer/groomer.component';
import { ThirdPartyEditComponent } from './third-party/third-party-edit/third-party-edit.component';
import { ThirdPartyComponent } from './third-party/third-party.component';

const routes: Routes = [
	{
		path: '',
		component: CommonParameterComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['SA'],
				redirectTo: 'dashboard',
			},
		},
		children: [
			{
				path: 'thirdparties',
				children: [
					{
						path: '',
						component: ThirdPartyComponent,
					},
					{
						path: ':id',
						component: ThirdPartyEditComponent,
					},
				],
			},
			{
				path: 'groomers',
				children: [
					{
						path: '',
						component: GroomerComponent,
					},
					{
						path: ':id',
						component: GroomerEditComponent,
					},
				],
			},
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'error/404', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CommonParameterRoutingModule {}
