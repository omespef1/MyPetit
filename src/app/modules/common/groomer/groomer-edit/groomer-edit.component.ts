import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { GroomerModel } from 'src/app/_metronic/core/models/groomer.model';
import { ThirdPartyModel } from 'src/app/_metronic/core/models/third-party.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import { ThirdPartyService } from '../../services/third.party.service';

const EMPTY_GROOMER: GroomerModel = {
	id: undefined,
	thidrPartyPhoneNumber: '',
	thirdPartyDocumentNumber: '',
	thirdPartyEmail: '',
	thirdPartyFullName: '',
	thirdPartyId: undefined,
  isActive: true
};

@Component({
	selector: 'app-groomer-edit',
	templateUrl: './groomer-edit.component.html',
	styleUrls: ['./groomer-edit.component.scss'],
})
export class GroomerEditComponent
	implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
	id: number;
	groomer: GroomerModel;
	previous: GroomerModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
    DISPONIBILITIES_TAB: 1
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	thirdParties: ThirdPartyModel[] = [];
	private subscriptions: Subscription[] = [];

	thirdparty_formatter = (x: any) => `${x.documentNumber} - ${x.names} ${x.lastNames}`;

	constructor(
		private fb: FormBuilder,
		private groomerService: GroomerService,
		private readonly swalService: SwalService,
		private readonly thirdPartyService: ThirdPartyService,
		private router: Router,
		private route: ActivatedRoute,
		private readonly cdr: ChangeDetectorRef
	) {}

	ngAfterViewChecked(): void {
		this.cdr.detectChanges();
	}

	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}

	ngOnInit(): void {
		this.isLoading$ = this.groomerService.isLoading$;
		forkJoin([this.findThirdParties(), this.loadUser()]);
		this.subscriptions.push(
			this.groomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	findThirdParties() {
		this.thirdPartyService.getAll().subscribe((thirdParties) => {
			this.thirdParties = thirdParties;
			this.cdr.detectChanges();
		});
	}

	getNewInstance() {
		return { ...EMPTY_GROOMER };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.groomerService.getItemById(this.id);
					}

					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: GroomerModel) => {
				if (!res) {
					this.router.navigate(['/common', 'groomers'], {
						relativeTo: this.route,
					});
				}

				this.groomer = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.groomer) {
			return;
		}

		this.formGroup = this.fb.group({
			thirdPartyId: [
				this.groomer.thirdPartyId,
				Validators.compose([Validators.required]),
			],
			isActive: [
				this.groomer.isActive,
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(250),
				]),
			],
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.groomer = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.groomer = Object.assign(this.groomer, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.groomerService
			.update(this.groomer)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate([
						'/common',
						'groomers',
						this.groomer.id,
					]);
				})
			)
			.subscribe((res) => (this.groomer = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.groomerService
			.create(this.groomer)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.groomer = res as GroomerModel;
				this.router.navigate(['/common', 'groomers', this.groomer.id]);
			});
		this.subscriptions.push(sbCreate);
	}

	changeTab(tabId: number) {
		this.activeTabId = tabId;
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	// helpers for View
	isControlValid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation: string, controlName: string) {
		const control = this.formGroup.controls[controlName];
		return (
			control.hasError(validation) && (control.dirty || control.touched)
		);
	}

	isControlTouched(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.dirty || control.touched;
	}
}
