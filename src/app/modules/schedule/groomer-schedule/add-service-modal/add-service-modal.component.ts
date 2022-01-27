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
import * as moment from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { PetServiceService } from 'src/app/modules/pet-management/services/pet-service.service';
import { GroomerServiceModel } from 'src/app/_metronic/core/models/groomer-service.model';
import { PetServiceModel } from 'src/app/_metronic/core/models/pet-service.model';
import { PetVaccineModel } from 'src/app/_metronic/core/models/pet-vaccine.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ServiceGroomerService } from '../../services/service-groomer.service';

const EMPTY_GROOMER_SERVICE: GroomerServiceModel = {
	id: undefined,
	groomerId: undefined,
	petId: undefined,
	serviceDate: new Date(),
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
	@Input() groomerId: number;
	@Input() startDate: Date;

	isLoading$: Observable<boolean>;
	formGroup: FormGroup;
	service: GroomerServiceModel;
	petServices: PetServiceModel[] = [];

	petservice_template = (x: PetServiceModel) => x.name;

	private subscriptions: Subscription[] = [];

	constructor(
		private readonly serviceGroomerService: ServiceGroomerService,
		private readonly petServiceService: PetServiceService,
		private readonly swalService: SwalService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.serviceGroomerService.isLoading$;
		this.subscriptions.push(
			this.serviceGroomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swalService.error(err))
		);
	}

	ngOnInit(): void {
		forkJoin([this.searchServices(), this.getAllServices()]);
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	getAllServices() {
		this.petServiceService
			.getAll()
			.subscribe((s) => (this.petServices = s));
	}

	searchServices() {
		this.serviceGroomerService
			.findByGroomerId(this.groomerId)
			.subscribe((p) => {
				console.log(p);
				this.loadForm();
				if (!p) {
					this.service = this.getNewInstance();
				} else {
					this.service = p;
				}
				// this.searchBreedsByPetTypeId(this.pet.petTypeId);
				// this.searchVaccines(this.pet.petTypeId);
			});

		// if (this.groomerId === 0) {
		// 	this.service = this.getNewInstance();
		// 	this.loadForm();
		// } else {
		// 	// this.serviceGroomerService.getPetById(this.groomerId).subscribe((p) => {
		// 	// 	this.service = p;
		// 	// 	this.loadForm();
		// 	// 	// this.searchBreedsByPetTypeId(this.pet.petTypeId);
		// 	// 	// this.searchVaccines(this.pet.petTypeId);
		// 	// });
		// }
	}

	searchBreedsByPetTypeId(petTypeId: number) {
		// this.petTypeService
		// 	.getBreedsByPetTypeId(petTypeId)
		// 	.subscribe((br) => (this.breeds = br));
	}

	searchVaccines(petTypeId: number) {
		// this.ownerService
		// 	.getVaccinesByPetId(petTypeId, this.pet.id)
		// 	.subscribe((vaccines) => {
		// 		this.vaccines.clear();
		// 		vaccines.forEach((v) => this.addVaccine(v));
		// 	});
	}

	getNewInstance() {
		return { ...EMPTY_GROOMER_SERVICE };
	}

	loadForm() {
		this.formGroup = this.fb.group({
			petServiceId: [1, Validators.compose([Validators.required])],
		});

		this.formGroup.controls.petServiceId.valueChanges.subscribe((v) =>
			console.log(v)
		);
	}

  getServiceCost(id) {
    console.log(id);
    return this.petServices.find(m => m.id === id)?.cost;
  }

	get vaccines() {
		return this.formGroup.controls['vaccines'] as FormArray;
	}

	addVaccine(vaccine: PetVaccineModel) {
		const vaccineForm = this.fb.group({
			title: [vaccine.vaccineName],
			vaccineId: [vaccine.vaccineId],
			value: [vaccine.applied],
		});
		this.vaccines.push(vaccineForm);
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
		// this.pet = Object.assign(this.pet, formValues);
		// this.pet.tags = (<any[]>formValues.tags).map((m) => m.value);

		// if (this.petId > 0) {
		// 	this.edit();
		// } else {
		// 	this.create();
		// }
	}

	addVaccinesToPet() {
		const petVaccines: PetVaccineModel[] = [];
		const vaccines = this.vaccines;

		// vaccines.controls.forEach((fg: FormGroup) => {
		// 	const petVaccine: Partial<PetVaccineModel> = {
		// 		petId: this.pet.id,
		// 		vaccineId: fg.controls.vaccineId.value,
		// 		applied: fg.controls.value.value,
		// 	};
		// 	petVaccines.push(petVaccine as PetVaccineModel);
		// });

		return petVaccines;
	}

	create() {
		// const sbCreate = this.ownerService
		// 	.createPet(this.ownerId, this.pet, this.addVaccinesToPet())
		// 	.pipe(
		// 		tap(() => {
		// 			this.swalService.success('COMMON.RESOURCE_CREATED');
		// 		})
		// 	)
		// 	.subscribe((res) => {
		// 		this.modal.close();
		// 	});
		// this.subscriptions.push(sbCreate);
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
