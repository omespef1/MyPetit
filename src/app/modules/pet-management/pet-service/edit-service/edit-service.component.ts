import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { HairModel } from 'src/app/_metronic/core/models/hair.model';
import { PetServiceModel } from 'src/app/_metronic/core/models/pet-service.model';
import { PetTypeModel } from 'src/app/_metronic/core/models/pet-type.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { HairService } from '../../services/hair.service';
import { PetServiceService } from '../../services/pet-service.service';
import { PetTypeService } from '../../services/pet-type.service';
import { TagService } from '../../services/tag.service';

const EMPTY_SERVICE: PetServiceModel = {
	id: undefined,
	name: '',
	cost: 0,
	description: '',
	duration: 0,
	hairLengthId: undefined,
	hairLengthName: '',
	isActive: true,
	petTypeId: undefined,
	petTypeName: '',
	weightEnd: 0,
	weightInit: 0,
};

@Component({
	selector: 'app-edit-service',
	templateUrl: './edit-service.component.html',
	styleUrls: ['./edit-service.component.scss'],
})
export class EditServiceComponent implements OnInit, OnDestroy {
	id: number;
	petService: PetServiceModel;
	previous: PetServiceModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	petTypes: PetTypeModel[] = [];
	hairLengths: HairModel[] = [];
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	private subscriptions: Subscription[] = [];
	name_formatter = (x: any) => x.name;

	constructor(
		private readonly fb: FormBuilder,
		private readonly petTypeService: PetTypeService,
		private readonly petServiceService: PetServiceService,
		private readonly hairService: HairService,
		private readonly swalService: SwalService,
		private readonly translateService: TranslateService,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.petServiceService.isLoading$;
		forkJoin([
			this.loadUser(),
			this.findPetTypes(),
			this.findHairLengths(),
		]);
		this.subscriptions.push(
			this.petServiceService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	getNewInstance() {
		return { ...EMPTY_SERVICE };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.petServiceService.getItemById(this.id);
					}

					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: PetServiceModel) => {
				if (!res) {
					this.router.navigate(['/pet-management', 'services'], {
						relativeTo: this.route,
					});
				}

				this.petService = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	findPetTypes() {
		this.petTypeService.getAll().subscribe((pt) => {
			// pt.unshift({
			// 	id: null,
			// 	name: this.translateService.instant('COMMON.ALL'),
			// });
			this.petTypes = pt;
			this.cdr.detectChanges();
		});
	}

	findHairLengths() {
		this.hairService.getAll().subscribe((hl) => {
			hl.unshift({
				id: null,
				name: this.translateService.instant('COMMON.ALL'),
			});
			this.hairLengths = hl;
			this.cdr.detectChanges();
		});
	}

	loadForm() {
		if (!this.petService) {
			return;
		}

		this.formGroup = this.fb.group({
			petTypeId: [
				this.petService.petTypeId,
				Validators.compose([Validators.required]),
			],
			name: [
				this.petService.name,
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(250),
				]),
			],
			weightInit: [
				this.petService.weightInit,
				Validators.compose([Validators.required]),
			],
			weightEnd: [
				this.petService.weightEnd,
				Validators.compose([Validators.required]),
			],
			hairLengthId: [
				this.petService.hairLengthId,
			],
			cost: [this.petService.cost, Validators.required],
			duration: [this.petService.duration, Validators.required],
			description: [
				this.petService.description,
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(512),
				]),
			],
			isActive: [this.petService.isActive],
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.petService = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.petService = Object.assign(this.petService, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.petServiceService
			.update(this.petService)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate([
						'/pet-management',
						'services',
						this.petService.id,
					]);
				})
			)
			.subscribe((res) => (this.petService = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.petServiceService
			.create(this.petService)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.petService = res as PetServiceModel;
				this.router.navigate([
					'/pet-management',
					'services',
					this.petService.id,
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
