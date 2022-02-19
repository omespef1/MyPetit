import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
	model: NgbDateStruct;
	date: { year: number; month: number };
	currentValue: Date = new Date();
	firstDay = 0;
	minDateValue: Date | null = null;
	maxDateValue: Date | null = null;
	disabledDates: Function | null = null;
	zoomLevels: string[] = ['month', 'year', 'decade', 'century'];
	cellTemplate = 'cell';
	holydays: any = [
		[1, 0],
		[4, 6],
		[25, 11],
	];
	dataSource: AppointmentServiceData[];

	getCellCssClass(date) {
		let cssClass = '';

		if (this.isWeekend(date)) {
			cssClass = 'weekend';
		}

		this.holydays.forEach((item) => {
			if (date.getDate() === item[0] && date.getMonth() === item[1]) {
				cssClass = 'holyday';
				return false;
			}
		});

		return cssClass;
	}
	isWeekend(date) {
		const day = date.getDay();

		return day === 0 || day === 6;
	}

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
			.getScheduleByDate(_moment(this.currentValue).format('YYYY-MM-DD'))
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

	selectToday() {
		this.model = {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
		};
	}

	onAppointmentOpenForm(data: AppointmentServiceData) {
		console.log(data);
		const modalRef = this.modalService.open(AddServiceModalComponent, {
			size: 'lg',
		});
		modalRef.componentInstance.id = data.id;
		modalRef.componentInstance.groomerId = data.groomerId;
		modalRef.componentInstance.startDate = data.startDate;
		modalRef.result.then(
			() => this.getAllScheduleData(),
			() => {}
		);
	}
}
