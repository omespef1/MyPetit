import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GroomerDisponibilityModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import { RefreshGroomerDisponibilitiesService } from '../add-disponibilities/refresh-groomer-disponibilities.service';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { AppointmentData } from 'src/app/_metronic/core/models/appointment-data.model';

@Component({
	selector: 'app-add-groomer-disponibilities-schedule',
	templateUrl: './add-groomer-disponibilities-schedule.component.html',
	styleUrls: ['./add-groomer-disponibilities-schedule.component.scss'],
})
export class AddGroomerDisponibilitiesScheduleComponent
	implements OnInit, OnDestroy
{
	@Input() groomerId: number;
	data: AppointmentData[] = [];
	isLoading$: Observable<boolean>;
	subscriptions: Subscription[] = [];

	constructor(
		private readonly refreshGroomerDisponibilitiesService: RefreshGroomerDisponibilitiesService,
		private readonly groomerService: GroomerService,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.groomerService.isLoading$;
		this.searchAllDisponibilities();
		this.refreshGroomerDisponibilitiesService.refreshData$.subscribe(() =>
			this.searchAllDisponibilities()
		);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	searchAllDisponibilities() {
		this.groomerService
			.getAllDisponibilities(this.groomerId)
			.subscribe((d) => this.processData(d));
	}

	onAddAppointment(e) {
		this.addDisponibility(e);
	}

	async onEditAppointment(e) {
		try {
			await this.editDisponibility(e);
		} catch (e) {
			this.searchAllDisponibilities();
		}
	}

	onRemoveAppointment(e) {
		this.deleteDisponibility(e);
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

	deleteDisponibility(appointment: AppointmentData) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.groomerService
					.deleteDisponibility(appointment.id)
					.subscribe(() => {
						this.searchAllDisponibilities();
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
			.subscribe(() => this.searchAllDisponibilities());
		this.subscriptions.push(sbCreate);
	}

	editDisponibility(appointment: AppointmentData) {
		return this.groomerService
			.editDisponibility(
				appointment.id,
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
					// this.swal.notify('COMMON.RESOURCE_UPDATED');
				})
			)
			.toPromise();
	}
}
