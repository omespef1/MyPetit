import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroomerScheduleComponent } from './groomer-schedule/groomer-schedule.component';
import { ScheduleComponent } from './schedule.component';

const routes: Routes = [
	{
		path: '',
		component: ScheduleComponent,
		children: [
			{
				path: 'groomer-schedule',
				children: [
					{
						path: '',
						component: GroomerScheduleComponent,
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
export class ScheduleRoutingModule {}
