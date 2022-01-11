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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { CityService } from 'src/app/modules/parameters/services/city.service';
import { StateService } from 'src/app/modules/parameters/services/state.service';
import { CityModel } from 'src/app/_metronic/core/models/city.model';
import { OwnerModel } from 'src/app/_metronic/core/models/owner.model';
import { StateModel } from 'src/app/_metronic/core/models/state.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { OwnerService } from '../../services/owner.service';
import { AddPetComponent } from '../add-pet/add-pet.component';
import { OwnerPetService } from '../owner-pets/owner-pet.service';

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
	stateId: undefined,
};

@Component({
	selector: 'app-owner-edit',
	templateUrl: './owner-edit.component.html',
	styleUrls: ['./owner-edit.component.scss'],
})
export class OwnerEditComponent
	implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
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
	cities: CityModel[] = [];
	states: StateModel[] = [];
	private subscriptions: Subscription[] = [];

	city_formatter = (x: CityModel) => x.name;
	state_formatter = (x: StateModel) => x.name;

	constructor(
		private fb: FormBuilder,
		private ownerService: OwnerService,
		private readonly swalService: SwalService,
		private readonly modalService: NgbModal,
		private readonly ownerPetService: OwnerPetService,
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
		this.isLoading$ = this.ownerService.isLoading$;
		forkJoin([this.loadUser(), this.findStates()]);
		this.subscriptions.push(
			this.ownerService.errorMessage$
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

				if (res.id > 0) {
					this.findCities(res.stateId);
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
			stateId: [
				this.owner.stateId,
				Validators.compose([Validators.required]),
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

		this.formGroup.controls.stateId.valueChanges.subscribe((stateId) => {
			this.findCities(stateId);
		});
	}

	reset() {
		if (!this.previous) {
			return;
		}

		this.owner = Object.assign({}, this.previous);
		this.loadForm();
	}

	addPet(petId: number) {
		const modalRef = this.modalService.open(AddPetComponent, {
			size: 'lg',
		});
		modalRef.componentInstance.ownerId = this.id;
		modalRef.componentInstance.petId = petId;
		modalRef.result.then(
			() => this.ownerPetService.refresData$.next(),
			() => {}
		);
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
