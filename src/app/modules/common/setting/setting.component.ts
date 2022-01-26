import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { SettingModel } from 'src/app/_metronic/core/models/setting.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { SettingService } from '../services/setting.service';

const EMPTY_SETTING: SettingModel = {
	id: undefined,
	logo: undefined,
	tax: 0,
};

@Component({
	selector: 'app-setting',
	templateUrl: './setting.component.html',
	styleUrls: ['./setting.component.scss'],
})
export class SettingComponent
	implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
	id: number;
	setting: SettingModel;
	previous: SettingModel;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	errorMessage = '';
	tabs = {
		BASIC_TAB: 0,
	};
	activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly fb: FormBuilder,
		private readonly settingService: SettingService,
		private readonly swalService: SwalService,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly cdr: ChangeDetectorRef
	) {}

	ngAfterViewChecked(): void {
		this.cdr.detectChanges();
	}

	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}

	ngOnInit(): void {
		this.isLoading$ = this.settingService.isLoading$;
		this.loadSetting();
		this.subscriptions.push(
			this.settingService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	getNewInstance() {
		return { ...EMPTY_SETTING };
	}

	loadSetting() {
		const sb = this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.id = Number(params.get('id'));
					return this.settingService.getOne();
				}),
				catchError((errorMessage) => {
					this.errorMessage = errorMessage;
					return of(undefined);
				})
			)
			.subscribe((res: SettingModel) => {
				if (!res) {
					this.setting = this.getNewInstance();
				} else {
					this.setting = res;
				}

				this.previous = Object.assign({}, res);
				this.loadForm();
			});
		this.subscriptions.push(sb);
	}

	loadForm() {
		if (!this.setting) {
			return;
		}

		this.formGroup = this.fb.group({
			tax: [this.setting.tax],
			logo: [this.setting.logo],
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.setting = Object.assign({}, this.previous);
		this.loadForm();
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		this.setting = Object.assign(this.setting, formValues);

		if (this.setting.id > 0) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.settingService
			.update(this.setting)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
					this.router.navigate(['/common', 'setting']);
				})
			)
			.subscribe((res) => (this.setting = res));
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.settingService
			.create(this.setting)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.setting = res as SettingModel;
				this.router.navigate(['/common', 'setting']);
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
