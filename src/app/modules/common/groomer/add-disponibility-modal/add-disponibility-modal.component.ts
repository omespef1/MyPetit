import {
	AfterContentChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import {
	GroomerDisponibilityModel,
	TimeObjectModel,
} from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import KTTimePicker from '../../../../../assets/js/components/timepicker.js';

const EMPTY_DISPONIBILITY: GroomerDisponibilityModel = {
	id: undefined,
	endDate: new TimeObjectModel(),
	startDate: new TimeObjectModel(),
	groomerId: undefined,
	dayOfWeek: 1,
};

@Component({
	selector: 'app-add-disponibility-modal',
	templateUrl: './add-disponibility-modal.component.html',
	styleUrls: ['./add-disponibility-modal.component.scss'],
})
export class AddDisponibilityModalComponent
	implements OnInit, OnDestroy, AfterContentChecked
{
	@Input() groomerId: number;
	@ViewChild('kt_timepicker_1', { static: true }) kt_timepicker_1: ElementRef;
	days = [
		{
			value: 1,
			text: this.translateService.instant('COMMON.MONDAY'),
		},
		{
			value: 2,
			text: this.translateService.instant('COMMON.TUESDAY'),
		},
		{
			value: 3,
			text: this.translateService.instant('COMMON.WEDNESDAY'),
		},
		{
			value: 4,
			text: this.translateService.instant('COMMON.THURSDAY'),
		},
		{
			value: 5,
			text: this.translateService.instant('COMMON.FRIDAY'),
		},
		{
			value: 6,
			text: this.translateService.instant('COMMON.SATURDAY'),
		},
		{
			value: 7,
			text: this.translateService.instant('COMMON.SUNDAY'),
		},
	];

	isLoading$: Observable<boolean>;
	isLoadingSave$: Observable<boolean>;
	formGroup: FormGroup;
	groomerDisponibility: GroomerDisponibilityModel;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly groomerService: GroomerService,
		private readonly swalService: SwalService,
		private readonly translateService: TranslateService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.groomerService.isLoading$;
		this.subscriptions.push(
			this.groomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swalService.error(err))
		);
	}

	ngOnInit(): void {
		this.loadForm();
		this.groomerDisponibility = this.getNewInstance();
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	getNewInstance() {
		return { ...EMPTY_DISPONIBILITY };
	}

	loadForm() {
		this.formGroup = this.fb.group({
			dayOfWeek: [1, Validators.compose([Validators.required])],
			startDate: [
				{
					hour: 0,
					minute: 0,
					second: 0,
				},
			],
			endDate: [
				{
					hour: 0,
					minute: 0,
					second: 0,
				},
			],
		});
	}

	save() {
		this.create();
	}

	get f() {
		return this.formGroup.value;
	}

	create() {
		const sbCreate = this.groomerService
			.createDisponibility(
				this.groomerId,
				this.f.dayOfWeek,
				this.f.startDate,
				this.f.endDate
			)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.modal.close();
			});
		this.subscriptions.push(sbCreate);
	}

	ngOnDestroy(): void {
		this.groomerService.ngOnDestroy();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
}
