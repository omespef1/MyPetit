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
import { AppointmentData } from 'src/app/_metronic/core/models/appointment-data.model';

export class AppointmentServiceData {
	public id: number;
	public startDate: Date;
	public endDate: Date;
	public groomerId: number;
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
	@Output() onAppointmentAdding = new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentUpdating =
		new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentDeleting =
		new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentFormOpening =
		new EventEmitter<AppointmentServiceData>();
	@Output() onAppointmentOpenForm =
		new EventEmitter<AppointmentServiceData>();
	@Input() groomers: { id: number; text: string }[];

	currentDate: Date = new Date();

	constructor(private readonly translateService: TranslateService) {}

	ngOnInit(): void {}

	onAddAppointment(e) {
		this.onAppointmentAdding.next(e.appointmentData);
	}

	onEditAppointment(e) {
		this.onAppointmentUpdating.next(e.newData);
	}

	onRemoveAppointment(e) {
		this.onAppointmentDeleting.next(e.appointmentData);
	}

	// onAppointmentFormOpen(data) {}

	onAppointmentFormOpen(data) {
		this.onAppointmentOpenForm.next(data.appointmentData);
		data.cancel = true;
		return;
		const that = this;
		const form = data.form;
		// let movieInfo = that.getMovieById(data.appointmentData.movieId) || {};
		const duration = 30;
		let startDate = data.appointmentData.startDate;

		form.option('items', [
			{
				label: {
					text: this.translateService.instant('GROOMER.START_DATE'),
				},
				dataField: 'startDate',
				editorType: 'dxDateBox',
				editorOptions: {
					// width: '100%',
					// type: 'datetime',
					// onValueChanged(args) {
					// 	startDate = args.value;
					// 	form.updateData(
					// 		'endDate',
					// 		new Date(startDate.getTime() + 60 * 1000 * duration)
					// 	);
					// },
					width: '100%',
					type: 'time',
					pickerType: 'calendar',
					readOnly: false,
				},
			},
			{
				label: {
					text: this.translateService.instant('GROOMER.END_DATE'),
				},
				name: 'endDate',
				dataField: 'endDate',
				editorType: 'dxDateBox',
				editorOptions: {
					width: '100%',
					type: 'time',
					pickerType: 'calendar',
					readOnly: false,
				},
			},
			{
				label: {
					text: this.translateService.instant('GROOMER.DAY'),
				},
				editorType: 'dxSelectBox',
				dataField: 'dayOfWeek',
				editorOptions: {
					items: that.groomers,
					displayExpr: 'text',
					valueExpr: 'id',
					onValueChanged(args) {},
				},
			},
		]);
	}
}
