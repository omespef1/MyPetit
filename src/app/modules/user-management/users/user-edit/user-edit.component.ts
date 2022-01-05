import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import notify from 'devextreme/ui/notify';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { UserModel } from 'src/app/_metronic/core/models/user.model';
import { UserService } from '../../services/user.service';

const EMPTY_USER: UserModel = {
	id: undefined,
	firstName: '',
	lastName: '',
	email: '@domain.com',
	password: undefined,
	userName: '',
	isActive: true,
	phoneNumber: '+57',
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
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
		ROLES_TAB: 1
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.userService.isLoading$;
		this.loadUser();
		this.subscriptions.push(
			this.userService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => notify(err, 'error', 1500))
		);
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
			firstName: [
				this.user.firstName,
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(255),
				]),
			],
			lastName: [
				this.user.lastName,
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(255),
				]),
			],
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
		// const sbUpdate = this.sourceService
		// 	.update(this.user)
		// 	.pipe(
		// 		tap(() => {
		// 			this.messageDialogService.showSuccess(
		// 				this.translateService.instant('COMMON.RESOURCE_UPDATED')
		// 			);
		// 			this.router.navigate([
		// 				'/user-management',
		// 				'users',
		// 				this.user.id,
		// 			]);
		// 		})
		// 	)
		// 	.subscribe((res) => (this.user = res));
		// this.subscriptions.push(sbUpdate);
	}

	create() {
		// const sbCreate = this.sourceService
		// 	.create(this.user)
		// 	.pipe(
		// 		tap(() => {
		// 			this.messageDialogService.showSuccess(
		// 				this.translateService.instant('COMMON.RESOURCE_CREATED')
		// 			);
		// 		})
		// 	)
		// 	.subscribe((res) => {
		// 		this.source = res as SourceModel;
		// 		console.log('res: ', this.source);
		// 		this.router.navigate([
		// 			'/management',
		// 			'sources',
		// 			this.source.id,
		// 		]);
		// 	});
		// this.subscriptions.push(sbCreate);
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
