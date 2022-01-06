import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { PetTypeModel } from 'src/app/_metronic/core/models/pet-type.model';
import { UserModel } from 'src/app/_metronic/core/models/user.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { PetTypeService } from '../../services/pet-type.service';

const EMPTY_PET_TYPE: PetTypeModel = {
	id: undefined,
	name: '',
};

@Component({
	selector: 'app-edit-type',
	templateUrl: './edit-type.component.html',
	styleUrls: ['./edit-type.component.scss'],
})
export class EditTypeComponent implements OnInit, OnDestroy {
	id: number;
	petType: PetTypeModel;
	previous: PetTypeModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		private petTypeService: PetTypeService,
		private readonly swalService: SwalService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.petTypeService.isLoading$;
		this.loadUser();
		this.subscriptions.push(
			this.petTypeService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	getNewInstance() {
		return { ...EMPTY_PET_TYPE };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.petTypeService.getItemById(this.id);
					}
					console.log(this.id);
					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: PetTypeModel) => {
				if (!res) {
					this.router.navigate(['/pet-management', 'types'], {
						relativeTo: this.route,
					});
				}

				this.petType = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.petType) {
			return;
		}

		this.formGroup = this.fb.group({
			name: [
				this.petType.name,
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(255),
				]),
			],
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.petType = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.petType = Object.assign(this.petType, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.petTypeService
			.update(this.petType)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate([
						'/pet-management',
						'types',
						this.petType.id,
					]);
				})
			)
			.subscribe((res) => (this.petType = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.petTypeService
			.create(this.petType)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.petType = res as PetTypeModel;
				this.router.navigate([
					'/pet-management',
					'types',
					this.petType.id,
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
