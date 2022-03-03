import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroomerService } from '../../common/services/groomer.service';
import { AppointmentServiceData } from '../../components/calendar/calendar.component';
import { ServiceGroomerService } from '../services/service-groomer.service';
import * as _moment from 'moment';
import { AddServiceModalComponent } from '../groomer-schedule/add-service-modal/add-service-modal.component';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ResumeServiceModalComponent } from '../groomer-schedule/resume-service-modal/resume-service-modal.component';
const now = new Date();

@Component({
	selector: 'app-mobile-groomer-schedule',
	templateUrl: './mobile-groomer-schedule.component.html',
	styleUrls: ['./mobile-groomer-schedule.component.scss'],
})
export class MobileGroomerScheduleComponent implements OnInit {
	isLoading$: Observable<boolean>;
	currentValue: Date = new Date();
	dataSource: AppointmentServiceData[];
	groomers: { id: number; text: string; disponibilities: any[] }[] = [];

	constructor(
		private readonly serviceGroomerService: ServiceGroomerService,
		private readonly groomerService: GroomerService,
		private readonly cdr: ChangeDetectorRef,
		private readonly swal: SwalService,
		private readonly modalService: NgbModal
	) {
		this.isLoading$ = serviceGroomerService.isLoading$;
	}

	ngOnInit(): void {
		this.refreshData();
	}

	getAllGroomers() {
		this.groomerService
			.getAllWithMobileDisponibility(
				_moment(this.currentValue).format('YYYY-MM-DD')
			)
			.pipe(
				map((g) =>
					g.map((m) => {
						return {
							id: m.id,
							text: m.thirdPartyFullName,
							disponibilities: m.mobileDisponibilities.map(
								(o) => {
									return {
										startDate: o.startDate,
										endDate: o.endDate,
									};
								}
							),
						};
					})
				)
			)
			.subscribe((g) => {
				this.groomers = g;
				this.cdr.detectChanges();
			});
	}

	onChangeDate(date: Date) {
		this.currentValue = date;
		this.refreshData();
	}

	refreshData() {
		forkJoin([this.getAllGroomers(), this.getAllScheduleData()]);
	}

	onAppointmentDeleting(e) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.serviceGroomerService.delete(e.id).subscribe(() => {
					this.swal.success('COMMON.RESOURCE_DELETED');
					this.getAllScheduleData();
				});
			}
		});
	}

	getAllScheduleData() {
		this.serviceGroomerService
			.getScheduleByDate(
				_moment(this.currentValue).format('YYYY-MM-DD'),
				true
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

				this.cdr.detectChanges();
			});
	}

	onAppointmentOpenForm(data: AppointmentServiceData) {
		if (data.state === 'Started' || data.state === 'Completed') {
			const modalRef = this.modalService.open(
				ResumeServiceModalComponent,
				{
					size: 'lg',
				}
			);
			modalRef.componentInstance.id = data.id;
			modalRef.result.then(
				() => this.getAllScheduleData(),
				() => {}
			);
		} else {
			const modalRef = this.modalService.open(AddServiceModalComponent, {
				size: 'lg',
			});
			modalRef.componentInstance.id = data.id ?? 0;
			modalRef.componentInstance.groomerId = data.groomerId;
			modalRef.componentInstance.isMobile = true;
			modalRef.componentInstance.startDate = data.startDate;
			modalRef.result.then(
				() => this.getAllScheduleData(),
				() => {}
			);
		}
	}
}
