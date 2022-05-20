import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { ThirdPartyService } from 'src/app/modules/common/services/third.party.service';
import { CountryService } from 'src/app/modules/parameters/services/country.service';
import { CountryModel } from 'src/app/_metronic/core/models/country.model';
import { ThirdPartyModel } from 'src/app/_metronic/core/models/third-party.model';
import { UserModel } from 'src/app/_metronic/core/models/user.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { UserService } from '../../services/user.service';

const EMPTY_USER: UserModel = {
	id: undefined,
	firstName: '',
	lastName: '',
	thirdPartyId: undefined,
	countryId: undefined,
	email: '@domain.com',
	password: undefined,
	userName: '',
	isActive: true,
	phoneNumber: '',
};

@Component({
	selector: 'app-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnDestroy {
	id: number;
	user: UserModel;
	previous: UserModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	thirdParties: ThirdPartyModel[] = [];
	countries: CountryModel[] = [];
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
		ROLES_TAB: 1,
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	private subscriptions: Subscription[] = [];
	thirdparty_formatter = (x: any) =>
		`${x.documentNumber} - ${x.names} ${x.lastNames}`;
	country_formatter = (m: any) => m.name;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private readonly swalService: SwalService,
		private readonly thirdPartyService: ThirdPartyService,
		private readonly countryService: CountryService,
		private router: Router,
		private readonly cdr: ChangeDetectorRef,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.userService.isLoading$.pipe(tap(console.log));
		forkJoin([
			this.loadUser(),
			this.findThirdParties(),
			this.findCountries(),
		]);
		this.subscriptions.push(
			this.userService.errorMessage$
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

	findCountries() {
		this.countryService.getAll().subscribe((countries) => {
			this.countries = countries;
			this.cdr.detectChanges();
		});
	}

	getNewInstance() {
		return { ...EMPTY_USER };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.userService.getItemById(this.id);
					}
					console.log(this.id);
					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: UserModel) => {
				if (!res) {
					this.router.navigate(['/user-management', 'users'], {
						relativeTo: this.route,
					});
				}

				this.user = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.user) {
			return;
		}

		this.formGroup = this.fb.group({
			userName: [
				this.user.userName,
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(255),
				]),
			],
			thirdPartyId: [this.user.thirdPartyId, Validators.required],
			countryId: [this.user.countryId, Validators.required],
			email: [
				this.user.email,
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.minLength(10),
					Validators.maxLength(255),
				]),
			],
			phoneNumber: [
				this.user.phoneNumber,
				Validators.compose([
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(15),
				]),
			],
			password: [''],
			isActive: [this.user.isActive],
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.user = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.user = Object.assign(this.user, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.userService
			.update(this.user)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate([
						'/user-management',
						'users',
						this.user.id,
					]);
				})
			)
			.subscribe((res) => (this.user = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.userService
			.create(this.user)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.user = res as UserModel;
				this.router.navigate([
					'/user-management',
					'users',
					this.user.id,
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
