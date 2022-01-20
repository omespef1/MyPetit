import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxSchedulerComponent } from 'devextreme-angular';

@Component({
	selector: 'app-disponibility-schedule',
	templateUrl: './disponibility-schedule.component.html',
	styleUrls: ['./disponibility-schedule.component.scss'],
})
export class DisponibilityScheduleComponent implements OnInit {
	@ViewChild(DxSchedulerComponent, { static: false })
	scheduler: DxSchedulerComponent;
	@Input() dataSource: any[] = [];
	@Input() height = 800;

	currentDate: Date = new Date(1901, 0, 1);

	constructor() {}

	ngOnInit(): void {}

	onAddAppointment(e) {
		console.log(e);
	}

	async onEditAppointment(e) {
		e.cancel = true;
	}

	onRemoveAppointment(e) {
		e.cancel = true;
	}
  onAppointmentFormOpening(data) {}
}
