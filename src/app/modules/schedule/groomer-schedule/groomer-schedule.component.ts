import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroomerService } from '../../common/services/groomer.service';
import { AppointmentServiceData } from '../../components/calendar/calendar.component';
import { ServiceGroomerService } from '../services/service-groomer.service';
import { AddServiceModalComponent } from './add-service-modal/add-service-modal.component';
import * as _moment from 'moment';
const now = new Date();

@Component({
	selector: 'app-groomer-schedule',
	templateUrl: './groomer-schedule.component.html',
	styleUrls: ['./groomer-schedule.component.scss'],
})
export class GroomerScheduleComponent implements OnInit {
	isLoading$: Observable<boolean>;
	date: { year: number; month: number };
	currentValue: Date = new Date();
	dataSource: AppointmentServiceData[];

	groomers: { id: number; text: string; disponibilities: any[] }[] = [];

	constructor(
		private readonly serviceGroomerService: ServiceGroomerService,
		private readonly groomerService: GroomerService,
		private readonly cdr: ChangeDetectorRef,
		private readonly modalService: NgbModal
	) {
		this.isLoading$ = groomerService.isLoading$;
	}

	ngOnInit(): void {
		forkJoin([this.getAllGroomers(), this.getAllScheduleData()]);
	}

	getAllGroomers() {
		this.groomerService
			.getAllWithDisponibility(
				_moment(this.currentValue).format('YYYY-MM-DD')
			)
			.pipe(
				map((g) =>
					g.map((m) => {
						return {
							id: m.id,
							text: m.thirdPartyFullName,
							disponibilities: m.disponibilities.map((o) => {
								return {
									startDate: o.startDate,
									endDate: o.endDate,
								};
							}),
						};
					})
				)
			)
			.subscribe((g) => {
				this.groomers = g;
				console.log(g);
				this.cdr.detectChanges();
			});
	}

	onChangeDate(date: Date) {
		this.currentValue = date;
		forkJoin([this.getAllGroomers(), this.getAllScheduleData()]);
	}

	onAppointmentDeleting(e) {
		this.serviceGroomerService.delete(e.id).subscribe();
	}

	getAllScheduleData() {
		this.serviceGroomerService
			.getScheduleByDate(
				_moment(this.currentValue).format('YYYY-MM-DD'),
				false
			)
			.subscribe((data: AppointmentServiceData[]) => {
				this.dataSource = data.map((m) => {
					return {
						id: m.id,
						text: `${m.ownerName} (${m.petName})`,
						startDate: _moment(m.startDate).toDate(),
						endDate: _moment(m.endDate).toDate(),
						groomerId: m.groomerId,
						groomerName: m.groomerName,
						ownerName: m.ownerName,
						petName: m.petName,
						state: m.state,
					};
				});

				console.log(this.dataSource);
				this.cdr.detectChanges();
			});
	}

	onAppointmentOpenForm(data: AppointmentServiceData) {
		console.log(data);
		const modalRef = this.modalService.open(AddServiceModalComponent, {
			size: 'lg',
		});
		modalRef.componentInstance.id = data.id ?? 0;
		modalRef.componentInstance.groomerId = data.groomerId;
		modalRef.componentInstance.isMobile = false;
		modalRef.componentInstance.startDate = data.startDate;
		modalRef.result.then(
			() => this.getAllScheduleData(),
			() => {}
		);
	}
}
