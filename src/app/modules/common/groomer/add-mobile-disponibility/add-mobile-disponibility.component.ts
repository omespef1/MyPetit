import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppointmentData } from 'src/app/_metronic/core/models/appointment-data.model';
import { GroomerMobileDisponibilityModel } from 'src/app/_metronic/core/models/groomer-mobile-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import { RefreshGroomerDisponibilitiesService } from '../add-disponibilities/refresh-groomer-disponibilities.service';

@Component({
	selector: 'app-add-mobile-disponibility',
	templateUrl: './add-mobile-disponibility.component.html',
	styleUrls: ['./add-mobile-disponibility.component.scss'],
})
export class AddMobileDisponibilityComponent implements OnInit, OnDestroy {
	@Input() groomerId: number;
	data: AppointmentData[] = [];
	isLoading$: Observable<boolean>;
	subscriptions: Subscription[] = [];

	constructor(
		private readonly swal: SwalService,
		private readonly groomerService: GroomerService,
		private readonly refreshGroomerDisponibilitiesService: RefreshGroomerDisponibilitiesService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.groomerService.isLoading$;
		this.searchAllDisponibilities();
		this.refreshGroomerDisponibilitiesService.refreshMobileData$.subscribe(
			() => this.searchAllDisponibilities()
		);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	searchAllDisponibilities() {
		this.groomerService
			.getAllMobileDisponibilities(this.groomerId)
			.subscribe((d) => this.processData(d));
	}

	processData(disponibilities: GroomerMobileDisponibilityModel[]) {
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

	onAddAppointment(appointment: AppointmentData) {
		const sbCreate = this.groomerService
			.createMobileDisponibility(
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

	onEditAppointment(appointment: AppointmentData) {
		const sbUpdate = this.groomerService
			.editMobileDisponibility(
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
			.subscribe(() => this.searchAllDisponibilities());
		this.subscriptions.push(sbUpdate);
	}

	onRemoveAppointment(appointment: AppointmentData) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.groomerService
					.deleteMobileDisponibility(appointment.id)
					.subscribe(() => {
						this.searchAllDisponibilities();
					});
			}
		});
	}
}
