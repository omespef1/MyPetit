import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { TagModel } from 'src/app/_metronic/core/models/tag.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { PetTypeService } from '../../services/pet-type.service';
import { TagService } from '../../services/tag.service';

const EMPTY_TAG: TagModel = {
	id: undefined,
	description: '',
};

@Component({
	selector: 'app-tag-edit',
	templateUrl: './tag-edit.component.html',
	styleUrls: ['./tag-edit.component.scss'],
})
export class TagEditComponent implements OnInit, OnDestroy {
	id: number;
	tag: TagModel;
	previous: TagModel;
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
		private tagService: TagService,
		private readonly swalService: SwalService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.tagService.isLoading$;
		this.loadUser();
		this.subscriptions.push(
			this.tagService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	getNewInstance() {
		return { ...EMPTY_TAG };
	}

	loadUser() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					if (this.id || this.id > 0) {
						return this.tagService.getItemById(this.id);
					}
					console.log(this.id);
					return of(this.getNewInstance());
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: TagModel) => {
				if (!res) {
					this.router.navigate(['/pet-management', 'types'], {
						relativeTo: this.route,
					});
				}

				this.tag = res;
				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.tag) {
			return;
		}

		this.formGroup = this.fb.group({
			description: [
				this.tag.description,
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

		this.tag = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.tag = Object.assign(this.tag, formValues);
		if (this.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.tagService
			.update(this.tag)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate([
						'/pet-management',
						'tags',
						this.tag.id,
					]);
				})
			)
			.subscribe((res) => (this.tag = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.tagService
			.create(this.tag)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.tag = res as TagModel;
        this.reset();
				this.router.navigate(['/pet-management', 'tags', 0]);
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
