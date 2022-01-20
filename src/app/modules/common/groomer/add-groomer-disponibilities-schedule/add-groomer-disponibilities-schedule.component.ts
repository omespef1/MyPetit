import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GroomerDisponibilityModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import { DxSchedulerComponent } from 'devextreme-angular';
import { RefreshGroomerDisponibilitiesService } from '../add-disponibilities/refresh-groomer-disponibilities.service';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

export class AppointmentData {
	public id: number;
	public startDate: Date;
	public endDate: Date;
	public dayOfWeek: number;
}

@Component({
	selector: 'app-add-groomer-disponibilities-schedule',
	templateUrl: './add-groomer-disponibilities-schedule.component.html',
	styleUrls: ['./add-groomer-disponibilities-schedule.component.scss'],
})
export class AddGroomerDisponibilitiesScheduleComponent
	implements OnInit, OnDestroy
{
	@Input() groomerId: number;
	disponibilities$: Observable<GroomerDisponibilityModel[]>;
	data: AppointmentData[] = [];
	isLoading$: Observable<boolean>;
	currentDate: Date = new Date(1901, 0, 1);
	@ViewChild(DxSchedulerComponent, { static: false })
	scheduler: DxSchedulerComponent;
	days = [
		{
			id: 1,
			text: this.translateService.instant('COMMON.MONDAY').toUpperCase(),
		},
		{
			id: 2,
			text: this.translateService.instant('COMMON.TUESDAY').toUpperCase(),
		},
		{
			id: 3,
			text: this.translateService
				.instant('COMMON.WEDNESDAY')
				.toUpperCase(),
		},
		{
			id: 4,
			text: this.translateService
				.instant('COMMON.THURSDAY')
				.toUpperCase(),
		},
		{
			id: 5,
			text: this.translateService.instant('COMMON.FRIDAY').toUpperCase(),
		},
		{
			id: 6,
			text: this.translateService
				.instant('COMMON.SATURDAY')
				.toUpperCase(),
		},
		{
			id: 7,
			text: this.translateService.instant('COMMON.SUNDAY').toUpperCase(),
		},
	];
	subscriptions: Subscription[] = [];

	constructor(
		private readonly refreshGroomerDisponibilitiesService: RefreshGroomerDisponibilitiesService,
		private readonly groomerService: GroomerService,
		private readonly translateService: TranslateService,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.groomerService.isLoading$;
		this.searchAllPets();
		this.refreshGroomerDisponibilitiesService.refreshData$.subscribe(() =>
			this.searchAllPets()
		);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	searchAllPets() {
		this.groomerService
			.getAllDisponibilities(this.groomerId)
			.subscribe((d) => this.processData(d));
	}

	onAddAppointment(e) {
		// e.cancel = true;
		console.log(e);
		this.addDisponibility(e.appointmentData);
	}

	onEditAppointment(e) {
		e.cancel = true;
		console.log(e);
	}

	onRemoveAppointment(e) {
		e.cancel = true;
		console.log(e);
	}

	processData(disponibilities: GroomerDisponibilityModel[]) {
		this.data = disponibilities.map((m) => {
			return {
				id: m.id,
				dayOfWeek: m.dayOfWeek,
				startDate: new Date(
					1901,
					0,
					1,
					m.startDate.hours,
					m.startDate.minutes,
					m.startDate.seconds
				),
				endDate: new Date(
					1901,
					0,
					1,
					m.endDate.hours,
					m.endDate.minutes,
					m.endDate.seconds
				),
			};
		});
	}

	deleteDisponibility(disponibility: GroomerDisponibilityModel) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.groomerService
					.deleteDisponibility(disponibility.id)
					.subscribe(() => {
						this.swal.success('COMMON.RESOURCE_DELETED');
						this.searchAllPets();
					});
			}
		});
	}

	addDisponibility(appointment: AppointmentData) {
		const sbCreate = this.groomerService
			.createDisponibility(
				this.groomerId,
				appointment.dayOfWeek,
				{
					hour: appointment.startDate.getHours(),
					minute: appointment.startDate.getMinutes(),
					second: appointment.startDate.getSeconds(),
				},
				{
					hour: appointment.endDate.getHours(),
					minute: appointment.endDate.getMinutes(),
					second: appointment.endDate.getSeconds(),
				}
			)
			.pipe(
				tap(() => {
					this.swal.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe();
		this.subscriptions.push(sbCreate);
	}

	convertToMinutes(startDate: Date, endDate: Date) {
		const resta = endDate.getTime() - startDate.getTime();
		return Math.round(resta / (1000 * 60));
	}

	onAppointmentFormOpening(data) {
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
					items: that.days,
					displayExpr: 'text',
					valueExpr: 'id',
					onValueChanged(args) {
						// movieInfo = that.getMovieById(args.value);
						// form.updateData('director', movieInfo.director);
						// form.updateData(
						// 	'endDate',
						// 	new Date(
						// 		startDate.getTime() +
						// 			60 * 1000 * movieInfo.duration
						// 	)
						// );
					},
				},
			},
		]);
	}
}
