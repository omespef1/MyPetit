import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { OwnerModel } from 'src/app/_metronic/core/models/owner.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { OwnerService } from '../../services/owner.service';

const EMPTY_OWNER: OwnerModel = {
	id: undefined,
	documentNumber: '',
	names: '',
	lastNames: '',
	email: '@domain.com',
	phoneNumber: '',
	cityId: undefined,
	cityName: '',
	address1: '',
	address2: '',
};

@Component({
	selector: 'app-owner-edit',
	templateUrl: './owner-edit.component.html',
	styleUrls: ['./owner-edit.component.scss'],
})
export class OwnerEditComponent implements OnInit, OnDestroy {
	id: number;
	owner: OwnerModel;
	previous: OwnerModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
		PETS_TAB: 1,
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		private ownerService: OwnerService,
		private readonly swalService: SwalService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.ownerService.isLoading$;
		this.loadUser();
		this.subscriptions.push(
			this.ownerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	getNewInstance() {
		return { ...EMPTY_OWNER };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.ownerService.getItemById(this.id);
					}
					console.log(this.id);
					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: OwnerModel) => {
				if (!res) {
					this.router.navigate(['/owner', 'owners'], {
						relativeTo: this.route,
					});
				}

				this.owner = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.owner) {
			return;
		}

		this.formGroup = this.fb.group({
			documentNumber: [
				this.owner.documentNumber,
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(50),
				]),
			],
			names: [
				this.owner.names,
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(250),
				]),
			],
			lastNames: [
				this.owner.lastNames,
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(250),
				]),
			],
			email: [
				this.owner.email,
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.minLength(10),
					Validators.maxLength(250),
				]),
			],
			phoneNumber: [
				this.owner.phoneNumber,
				Validators.compose([
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(20),
				]),
			],
			cityId: [
				this.owner.cityId,
				Validators.compose([Validators.required]),
			],
			address1: [
				this.owner.address1,
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(250),
				]),
			],
			address2: [
				this.owner.address2,
				Validators.compose([
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

		this.owner = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.owner = Object.assign(this.owner, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.ownerService
			.update(this.owner)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate(['/owner', 'owners', this.owner.id]);
				})
			)
			.subscribe((res) => (this.owner = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.ownerService
			.create(this.owner)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.owner = res as OwnerModel;
				this.router.navigate(['/owner', 'owners', this.owner.id]);
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
