import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BreedModel } from 'src/app/_metronic/core/models/breed.model';
import { UserRoleModel } from 'src/app/_metronic/core/models/user-role.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { PetTypeService } from '../../services/pet-type.service';

@Component({
	selector: 'app-add-breed',
	templateUrl: './add-breed.component.html',
	styleUrls: ['./add-breed.component.scss'],
})
export class AddBreedComponent implements OnInit {
	@Input() petTypeId: number;

	breedGroup: FormGroup;
	breeds$: Observable<BreedModel[]>;
	isLoading$: Observable<boolean>;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly fb: FormBuilder,
		private petTypeService: PetTypeService,
		private readonly swalService: SwalService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.petTypeService.isLoading$;
		this.initForm();
		this.searchPetTypes();
	}

	ngOnDestroy() {
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	initForm() {
		this.breedGroup = this.fb.group({
			name: [
				'',
				Validators.compose([
					Validators.minLength(2),
					Validators.maxLength(50),
				]),
			],
		});
	}

	searchPetTypes() {
		this.breeds$ = this.petTypeService.getBreedsByPetTypeId(this.petTypeId);
	}

	add() {
		this.breedGroup.markAllAsTouched();
		if (!this.breedGroup.valid) {
			return;
		}

		const formValues = this.breedGroup.value;
		const breed = Object.assign({}, formValues);
		const sbCreate = this.petTypeService
			.createBreed(this.petTypeId, breed)
			.subscribe(() => {
				this.breedGroup.controls.name.setValue('');
				this.swalService.success('COMMON.RESOURCE_CREATED');
				this.searchPetTypes();
			});
		this.subscriptions.push(sbCreate);
	}

	remove(breed: BreedModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.petTypeService
						.removeBreed(this.petTypeId, breed.id)
						.subscribe(() => {
							this.swalService.success('COMMON.RESOURCE_DELETED');
							this.searchPetTypes();
						});
				}
			});
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.breedGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation: string, controlName: string) {
		const control = this.breedGroup.controls[controlName];
		return (
			control.hasError(validation) && (control.dirty || control.touched)
		);
	}

	isControlTouched(controlName: string): boolean {
		const control = this.breedGroup.controls[controlName];
		return control.dirty || control.touched;
	}
}
