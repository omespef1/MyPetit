import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { HairModel } from 'src/app/_metronic/core/models/hair.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { HairService } from '../../services/hair.service';
import { TagService } from '../../services/tag.service';

const EMPTY_HAIR: HairModel = {
	id: undefined,
	name: '',
};

@Component({
	selector: 'app-hair-length-edit',
	templateUrl: './hair-length-edit.component.html',
	styleUrls: ['./hair-length-edit.component.scss'],
})
export class HairLengthEditComponent implements OnInit, OnDestroy {
	id: number;
	hair: HairModel;
	previous: HairModel;
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
		private hairService: HairService,
		private readonly swalService: SwalService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.hairService.isLoading$;
		this.loadUser();
		this.subscriptions.push(
			this.hairService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	getNewInstance() {
		return { ...EMPTY_HAIR };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.hairService.getItemById(this.id);
					}
					console.log(this.id);
					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: HairModel) => {
				if (!res) {
					this.router.navigate(['/pet-management', 'hair-lengths'], {
						relativeTo: this.route,
					});
				}

				this.hair = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.hair) {
			return;
		}

		this.formGroup = this.fb.group({
			name: [
				this.hair.name,
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(50),
				]),
			],
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.hair = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.hair = Object.assign(this.hair, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.hairService
			.update(this.hair)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.reset();
					this.router.navigate([
						'/pet-management',
						'hair-lengths',
						0,
					]);
				})
			)
			.subscribe((res) => (this.hair = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.hairService
			.create(this.hair)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.hair = res as HairModel;
				this.reset();
				this.router.navigate(['/pet-management', 'hair-lengths', 0]);
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
