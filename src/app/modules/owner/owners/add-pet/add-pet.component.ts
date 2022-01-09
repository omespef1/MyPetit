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
import { HairService } from 'src/app/modules/pet-management/services/hair.service';
import { PetTypeService } from 'src/app/modules/pet-management/services/pet-type.service';
import { BreedModel } from 'src/app/_metronic/core/models/breed.model';
import { HairModel } from 'src/app/_metronic/core/models/hair.model';
import { PetTypeModel } from 'src/app/_metronic/core/models/pet-type.model';
import { PetVaccineModel } from 'src/app/_metronic/core/models/pet-vaccine.model';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { OwnerService } from '../../services/owner.service';

const EMPTY_PET: PetModel = {
	id: undefined,
	name: '',
	ownerId: undefined,
	petTypeId: undefined,
	breedId: undefined,
	gender: 1,
	hairLengthId: undefined,
	observations: '',
	pic: '',
	weight: 0,
	birthDate: new Date(),

	breedName: '',
	hairLengthName: '',
	petTypeName: '',
};

@Component({
	selector: 'app-add-pet',
	templateUrl: './add-pet.component.html',
	styleUrls: ['./add-pet.component.scss'],
})
export class AddPetComponent implements OnInit, OnDestroy, AfterContentChecked {
	@Input() ownerId: number;
	@Input() petId: number;
	isLoading$: Observable<boolean>;
	formGroup: FormGroup;
	pet: PetModel;
	petTypes: PetTypeModel[] = [];
	hairLengths: HairModel[] = [];
	breeds: BreedModel[] = [];
	// vaccines: PetVaccineModel[] = [];
	private subscriptions: Subscription[] = [];

	pettype_formatter = (x: PetTypeModel) => x.name;
	hairlength_formatter = (x: HairModel) => x.name;
	breed_formatter = (x: BreedModel) => x.name;

	constructor(
		private readonly ownerService: OwnerService,
		private readonly petTypeService: PetTypeService,
		private readonly hairLengthService: HairService,
		private readonly swalService: SwalService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.ownerService.isLoading$;
		this.subscriptions.push(
			this.ownerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swalService.error(err))
		);
	}

	ngOnInit(): void {
		forkJoin([
			this.searchPet(),
			this.searchPetTypes(),
			this.searchHairLengths(),
		]);
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	searchPetTypes() {
		this.petTypeService.getAll().subscribe((pt) => (this.petTypes = pt));
	}

	searchHairLengths() {
		return this.hairLengthService
			.getAll()
			.subscribe((hl) => (this.hairLengths = hl));
	}

	searchPet() {
		if (this.petId === 0) {
			this.pet = this.getNewInstance();
			this.loadForm();
		} else {
			this.ownerService.getPetById(this.petId).subscribe((p) => {
				this.pet = p;
				this.loadForm();
				this.searchBreedsByPetTypeId(this.pet.petTypeId);
				this.searchVaccines(this.pet.petTypeId);
			});
		}
	}

	searchBreedsByPetTypeId(petTypeId: number) {
		this.petTypeService
			.getBreedsByPetTypeId(petTypeId)
			.subscribe((br) => (this.breeds = br));
	}

	searchVaccines(petTypeId: number) {
		this.ownerService
			.getVaccinesByPetId(petTypeId, this.pet.id)
			.subscribe((vaccines) => {
				vaccines.forEach((v) => this.addVaccine(v));
			});
	}

	getNewInstance() {
		return { ...EMPTY_PET };
	}

	loadForm() {
		this.formGroup = this.fb.group({
			name: [
				this.pet.name,
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(250),
				]),
			],
			petTypeId: [
				this.pet.petTypeId,
				Validators.compose([Validators.required]),
			],
			breedId: [
				this.pet.breedId,
				Validators.compose([Validators.required]),
			],
			hairLengthId: [
				this.pet.hairLengthId,
				Validators.compose([Validators.required]),
			],
			weight: [
				this.pet.weight,
				Validators.compose([Validators.required]),
			],
			gender: [
				`${this.pet.gender}`,
				Validators.compose([Validators.required]),
			],
			birthDate: [
				moment(this.pet.birthDate).format('YYYY-MM-DD'),
				Validators.compose([Validators.required]),
			],
			observations: [this.pet.observations, Validators.compose([])],
			pic: [this.pet.pic],
			vaccines: this.fb.array([]),
		});

		this.formGroup.controls.pic.setValue(this.pet.pic);
		this.formGroup.controls.petTypeId.valueChanges.subscribe(
			(petTypeId) => {
				this.searchBreedsByPetTypeId(petTypeId);
				this.searchVaccines(petTypeId);
			}
		);
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
		this.pet = Object.assign(this.pet, formValues);
		if (this.petId > 0) {
			this.edit();
		} else {
			this.create();
		}
	}

	addVaccinesToPet() {
		const petVaccines: PetVaccineModel[] = [];
		const vaccines = this.vaccines;

		vaccines.controls.forEach((fg: FormGroup) => {
			const petVaccine: Partial<PetVaccineModel> = {
				petId: this.pet.id,
				vaccineId: fg.controls.vaccineId.value,
				applied: fg.controls.value.value,
			};
			petVaccines.push(petVaccine as PetVaccineModel);
		});

		return petVaccines;
	}

	create() {
		const sbCreate = this.ownerService
			.createPet(this.ownerId, this.pet, this.addVaccinesToPet())
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
		const sbCreate = this.ownerService
			.updatePet(this.ownerId, this.petId, this.pet, this.addVaccinesToPet())
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_UPDATED');
				})
			)
			.subscribe((res) => {
				this.modal.close();
			});
		this.subscriptions.push(sbCreate);
	}

	ngOnDestroy(): void {
		this.ownerService.ngOnDestroy();
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
