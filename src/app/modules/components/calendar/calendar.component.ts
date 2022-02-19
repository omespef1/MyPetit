import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DxSchedulerComponent } from 'devextreme-angular';
import { TimeObjectModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';

export class AppointmentServiceData {
	public id: number;
	public text: string;
	public startDate: Date;
	public endDate: Date;
	public groomerId: number;
	public groomerName: string;
	public ownerName: string;
	public petName: string;
	public state: number;
}

export class Resource {
	id: string;
	text: string;
	color: string;
}

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
	@ViewChild(DxSchedulerComponent, { static: false })
	scheduler: DxSchedulerComponent;
	@Input() dataSource: AppointmentServiceData[] = [];
	@Input() height = 800;
	@Input() groomers: {
		id: number;
		text: string;
		disponibilities: {
			startDate: TimeObjectModel;
			endDate: TimeObjectModel;
		}[];
	}[];
	@Output() onAppointmentAdding = new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentUpdating =
		new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentDeleting =
		new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentFormOpening =
		new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentOpenForm =
		new EventEmitter<AppointmentServiceData>();
	@Output() onChangeDate = new EventEmitter<Date>();

	resourcesData: Resource[] = [
		{
			id: 'Created',
			text: 'Created',
			color: '#1e90ff',
		},
		{
			id: 'Canceled',
			text: 'Canceled',
			color: '#cb6bb2',
		},
		{
			id: 'Executing',
			text: 'Executing',
			color: '#56ca85',
		},
		{
			id: 'Completed',
			text: 'Completed',
			color: '#9F9F9F',
		},
	];
	currentDate: Date = new Date();

	constructor(
		private readonly translateService: TranslateService,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {}

	onAddAppointment(e) {
		this.onAppointmentAdding.next(e.appointmentData);
	}

	onEditAppointment(e) {
		e.cancel = true;
		this.onAppointmentUpdating.next(e.newData);
	}

	onRemoveAppointment(e) {
		e.cancel = true;
		this.onAppointmentDeleting.next(e.appointmentData);
	}

	onOptionChanged(e) {
		if (e.name === 'currentDate') {
			this.onChangeDate.next(e.value);
		}
	}

	onAppointmentFormOpen(data) {
		data.cancel = true;
		console.log('data: ', data);
		if (
			this.isDisableDate({
				groups: {
					groomerId: data.appointmentData.groomerId,
				},
				startDate: data.appointmentData.startDate,
			})
		) {
			this.swal.error(
				this.translateService.instant('COMMON.INVALID_RANGE')
			);
			return;
		}

		this.onAppointmentOpenForm.next(data.appointmentData);
	}

	onContentReady(e) {
		// e.component.scrollTo(this.currentDate);
	}

	isDisableDate(e) {
		if (!e || !e.groups || !e.groups.groomerId) return true;

		const groomerId = e.groups.groomerId;
		const groomer = this.groomers.find((m) => m.id === groomerId);
		const date: Date = e.startDate;
		const disponibility = groomer.disponibilities.find(
			(m) =>
				new Date(
					0,
					0,
					1,
					date.getHours(),
					date.getMinutes(),
					date.getSeconds()
				) >=
					new Date(
						0,
						0,
						1,
						m.startDate.hours,
						m.startDate.minutes,
						m.startDate.seconds
					) &&
				new Date(
					0,
					0,
					1,
					date.getHours(),
					date.getMinutes(),
					date.getSeconds()
				) <
					new Date(
						0,
						0,
						1,
						m.endDate.hours,
						m.endDate.minutes,
						m.endDate.seconds
					)
		);

		return disponibility ? false : true;
	}

	isDinner(e) {
		return false;
	}
}
