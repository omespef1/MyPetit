import {
	AfterContentChecked,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { OwnerService } from 'src/app/modules/owner/services/owner.service';
import { PetServiceService } from 'src/app/modules/pet-management/services/pet-service.service';
import { GroomerServiceModel } from 'src/app/_metronic/core/models/groomer-service.model';
import { PetServiceModel } from 'src/app/_metronic/core/models/pet-service.model';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ServiceGroomerService } from '../../services/service-groomer.service';
import * as _moment from 'moment';

const EMPTY_GROOMER_SERVICE: GroomerServiceModel = {
	id: undefined,
	groomerId: undefined,
	petId: undefined,
	startDate: new Date(),
	serviceGroomer: [],
};

@Component({
	selector: 'app-add-service-modal',
	templateUrl: './add-service-modal.component.html',
	styleUrls: ['./add-service-modal.component.scss'],
})
export class AddServiceModalComponent
	implements OnInit, OnDestroy, AfterContentChecked
{
	@Input() id: number;
	@Input() groomerId: number;
	@Input() startDate: Date;
	endDate: Date;

	pet: PetModel;
	isLoading$: Observable<boolean>;
	isLoadingPet$: Observable<boolean>;
	formGroup: FormGroup;
	service: GroomerServiceModel;
	petServices: PetServiceModel[] = [];
	showServices = false;
	name_template = (x: PetServiceModel) => x.name;

	private subscriptions: Subscription[] = [];

	constructor(
		private readonly serviceGroomerService: ServiceGroomerService,
		private readonly petServiceService: PetServiceService,
		private readonly ownerService: OwnerService,
		private readonly swalService: SwalService,
		private readonly fb: FormBuilder,
		public readonly modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.serviceGroomerService.isLoading$;
		this.isLoadingPet$ = this.ownerService.isLoading$;
		this.subscriptions.push(
			this.serviceGroomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swalService.error(err))
		);
	}

	ngOnInit(): void {
		this.endDate = this.startDate;
		forkJoin([this.searchServices(), this.searchDetail()]);
	}

	searchDetail() {
		if (this.id > 0) {
			this.serviceGroomerService
				.getItemById(this.id)
				.subscribe((res) => console.log('detalle: ', res));
		}
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	getAllServicesByPetId(petId: number) {
		this.petServiceService
			.getByPetId(petId)
			.subscribe((s) => (this.petServices = s));
	}

	searchServices() {
		this.serviceGroomerService
			.findByGroomerId(this.groomerId)
			.subscribe((p) => {
				this.loadForm();
				if (!p) {
					this.service = this.getNewInstance();
				} else {
					this.service = p;
				}
			});
	}

	findPetById(petId: number) {
		this.ownerService.getPetById(petId).subscribe((pet) => {
			this.pet = pet;
			this.getAllServicesByPetId(pet.id);
		});
	}

	petChange(petId: number) {
		if (petId) {
			this.f.petId.setValue(petId);
			this.findPetById(petId);
			this.showServices = true;
			this.clearServices();
			this.addNewService();
		}
	}

	clearServices() {
		while (this.services.length !== 0) {
			this.services.removeAt(0);
		}
	}

	getNewInstance() {
		return { ...EMPTY_GROOMER_SERVICE };
	}

	get f() {
		return this.formGroup.controls;
	}

	loadForm() {
		this.formGroup = this.fb.group({
			groomerId: [this.groomerId],
			petId: [undefined, Validators.compose([Validators.required])],
			startDate: [
				_moment(this.startDate).format('YYYY-MM-DD HH:mm:ss'),
				Validators.compose([Validators.required]),
			],
			services: this.fb.array([]),
		});
	}

	removeService(index: number) {
		this.services.removeAt(index);
		this.calcEndDate();
		this.cdr.detectChanges();
	}

	get services() {
		return this.formGroup.controls['services'] as FormArray;
	}

	set services(value: FormArray) {
		this.formGroup.controls['services'].setValue(value);
	}

	get totalServices() {
		return (<any[]>this.services.value)
			.filter((m) => m.serviceId !== null)
			.reduce((sum, current) => sum + current.cost, 0);
	}

	addNewService() {
		const serviceForm = this.fb.group({
			serviceId: [undefined, Validators.required],
			cost: [0],
			duration: [0],
		});

		this.subscriptions.push(
			serviceForm.controls.serviceId.valueChanges.subscribe(
				(petServiceId) => {
					const service = this.petServices.find(
						(m) => m.id === Number(petServiceId)
					);
					serviceForm.controls.cost.setValue(service.cost);
					serviceForm.controls.duration.setValue(service.duration);
					this.calcEndDate();
				}
			)
		);

		this.services.push(serviceForm);
	}

	calcEndDate() {
		const totalDuration = (<any[]>this.services.value)
			.filter((m) => m.serviceId !== null)
			.reduce((sum, current) => sum + current.duration, 0);
		this.endDate = new Date(
			this.startDate.getTime() + totalDuration * 60000
		);
		this.cdr.detectChanges();
	}

	changePic(pic: string) {
		this.formGroup.controls.pic.setValue(pic);
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		console.log(formValues);
		this.service = Object.assign(this.service, formValues);
		this.service.serviceGroomer = (<any[]>formValues.services).map(
			(m) => m.serviceId
		);

		// if (this.petId > 0) {
		// 	this.edit();
		// } else {
		this.create();
		// }
	}

	create() {
		const sbCreate = this.serviceGroomerService
			.createService(this.service)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.modal.close();
			});
		this.subscriptions.push(sbCreate);
	}

	edit() {
		// const sbCreate = this.ownerService
		// 	.updatePet(
		// 		this.ownerId,
		// 		this.petId,
		// 		this.pet,
		// 		this.addVaccinesToPet()
		// 	)
		// 	.pipe(
		// 		tap(() => {
		// 			this.swalService.success('COMMON.RESOURCE_UPDATED');
		// 		})
		// 	)
		// 	.subscribe((res) => {
		// 		this.modal.close();
		// 	});
		// this.subscriptions.push(sbCreate);
	}

	ngOnDestroy(): void {
		this.serviceGroomerService.ngOnDestroy();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

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
