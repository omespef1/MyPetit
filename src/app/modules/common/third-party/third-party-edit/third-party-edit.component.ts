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
import { CityService } from 'src/app/modules/parameters/services/city.service';
import { StateService } from 'src/app/modules/parameters/services/state.service';
import { CityModel } from 'src/app/_metronic/core/models/city.model';
import { StateModel } from 'src/app/_metronic/core/models/state.model';
import { ThirdPartyModel } from 'src/app/_metronic/core/models/third-party.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ThirdPartyService } from '../../services/third.party.service';

const EMPTY_THIRD_PARTY: ThirdPartyModel = {
	id: undefined,
	documentNumber: '',
	names: '',
	lastNames: '',
	email: '@domain.com',
	phoneNumber: '',
	cityId: undefined,
	cityName: '',
	address: '',
	stateId: undefined,
	codeName: ''
};

@Component({
	selector: 'app-third-party-edit',
	templateUrl: './third-party-edit.component.html',
	styleUrls: ['./third-party-edit.component.scss'],
})
export class ThirdPartyEditComponent
	implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
	id: number;
	thirdParty: ThirdPartyModel;
	previous: ThirdPartyModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	cities: CityModel[] = [];
	states: StateModel[] = [];
	private subscriptions: Subscription[] = [];

	name_formatter = (x: any) => x.name;

	constructor(
		private fb: FormBuilder,
		private thirdPartyService: ThirdPartyService,
		private readonly swalService: SwalService,
		private readonly cityService: CityService,
		private readonly stateService: StateService,
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
		this.isLoading$ = this.thirdPartyService.isLoading$;
		forkJoin([this.loadUser(), this.findStates()]);
		this.subscriptions.push(
			this.thirdPartyService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	findCities(stateId: number) {
		this.cityService.getAllByStateId(stateId).subscribe((cities) => {
			this.cities = cities;
			this.cdr.detectChanges();
		});
	}

	findStates() {
		this.stateService.getAll().subscribe((s) => {
			this.states = s;
			this.cdr.detectChanges();
		});
	}

	getNewInstance() {
		return { ...EMPTY_THIRD_PARTY };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.thirdPartyService.getItemById(this.id);
					}

					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: ThirdPartyModel) => {
				if (!res) {
					this.router.navigate(['/common', 'thirdparties'], {
						relativeTo: this.route,
					});
				}

				if (res.id > 0) {
					this.findCities(res.stateId);
				}
				this.thirdParty = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.thirdParty) {
			return;
		}

		this.formGroup = this.fb.group({
			documentNumber: [
				this.thirdParty.documentNumber,
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(50),
				]),
			],
			names: [
				this.thirdParty.names,
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(250),
				]),
			],
			lastNames: [
				this.thirdParty.lastNames,
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(250),
				]),
			],
			email: [
				this.thirdParty.email,
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.minLength(10),
					Validators.maxLength(250),
				]),
			],
			phoneNumber: [
				this.thirdParty.phoneNumber,
				Validators.compose([
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(20),
				]),
			],
			stateId: [
				this.thirdParty.stateId,
				Validators.compose([Validators.required]),
			],
			cityId: [
				this.thirdParty.cityId,
				Validators.compose([Validators.required]),
			],
			address: [
				this.thirdParty.address,
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(250),
				]),
			],
		});

		if (this.thirdParty.id > 0) {
			this.formGroup.controls.documentNumber.disable();
		}

		this.formGroup.controls.stateId.valueChanges.subscribe((stateId) => {
			this.findCities(stateId);
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.thirdParty = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.thirdParty = Object.assign(this.thirdParty, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.thirdPartyService
			.update(this.thirdParty)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate([
						'/common',
						'thirdparties',
						this.thirdParty.id,
					]);
				})
			)
			.subscribe((res) => (this.thirdParty = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.thirdPartyService
			.create(this.thirdParty)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.thirdParty = res as ThirdPartyModel;
				this.router.navigate([
					'/common',
					'thirdparties',
					this.thirdParty.id,
				]);
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
