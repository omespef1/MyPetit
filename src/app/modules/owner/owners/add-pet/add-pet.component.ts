import {
	AfterContentChecked,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
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
};

@Component({
	selector: 'app-add-pet',
	templateUrl: './add-pet.component.html',
	styleUrls: ['./add-pet.component.scss'],
})
export class AddPetComponent implements OnInit, OnDestroy, AfterContentChecked {
	@Input() petId: number;
	isLoading$: Observable<boolean>;
	formGroup: FormGroup;
	pet: PetModel;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly ownerService: OwnerService,
		private readonly swalService: SwalService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.ownerService.isLoading$;
		// this.subscriptions.push(
		// 	this.ownerService.getAllBreeds().subscribe((p) => (this.breeds = p))
		// );
		this.subscriptions.push(
			this.ownerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swalService.error(err))
		);
	}

	ngOnInit(): void {
		this.pet = this.getNewInstance();
		this.loadForm();
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
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
				this.pet.gender,
				Validators.compose([Validators.required]),
			],
			birthDate: [
				this.pet.birthDate,
				Validators.compose([Validators.required]),
			],
			observations: [this.pet.observations, Validators.compose([])],
			pic: [this.pet.pic],
		});
	}

	changePic(pic) {
		this.formGroup.controls.pic.setValue(pic);
	}

	save() {
		this.create();
	}

	create() {
		console.log(this.formGroup.value);
		// this.userRole.roleId = this.formGroup.controls.roleId.value;
		// const sbCreate = this.userService
		// 	.createUserRole(this.userId, this.userRole)
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
