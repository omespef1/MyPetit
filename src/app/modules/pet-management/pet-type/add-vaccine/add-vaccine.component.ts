import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BreedModel } from 'src/app/_metronic/core/models/breed.model';
import { VaccineModel } from 'src/app/_metronic/core/models/vaccine.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { PetTypeService } from '../../services/pet-type.service';

@Component({
	selector: 'app-add-vaccine',
	templateUrl: './add-vaccine.component.html',
	styleUrls: ['./add-vaccine.component.scss'],
})
export class AddVaccineComponent implements OnInit {
	@Input() petTypeId: number;

	vaccineGroup: FormGroup;
	vaccines$: Observable<VaccineModel[]>;
	isLoading$: Observable<boolean>;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly fb: FormBuilder,
		private readonly petTypeService: PetTypeService,
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
		this.vaccineGroup = this.fb.group({
			name: [
				'',
				Validators.compose([
					Validators.minLength(2),
					Validators.maxLength(250),
				]),
			],
		});
	}

	searchPetTypes() {
		this.vaccines$ = this.petTypeService.getVaccinesByPetTypeId(
			this.petTypeId
		);
	}

	add() {
		this.vaccineGroup.markAllAsTouched();
		if (!this.vaccineGroup.valid) {
			return;
		}

		const formValues = this.vaccineGroup.value;
		const vaccine = Object.assign({}, formValues);
		const sbCreate = this.petTypeService
			.createVaccine(this.petTypeId, vaccine)
			.subscribe(() => {
				this.vaccineGroup.controls.name.setValue('');
				this.swalService.success('COMMON.RESOURCE_CREATED');
				this.searchPetTypes();
			});
		this.subscriptions.push(sbCreate);
	}

	remove(vaccine: VaccineModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.petTypeService
						.removeVaccine(vaccine.id)
						.subscribe(() => {
							this.swalService.success('COMMON.RESOURCE_DELETED');
							this.searchPetTypes();
						});
				}
			});
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.vaccineGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation: string, controlName: string) {
		const control = this.vaccineGroup.controls[controlName];
		return (
			control.hasError(validation) && (control.dirty || control.touched)
		);
	}

	isControlTouched(controlName: string): boolean {
		const control = this.vaccineGroup.controls[controlName];
		return control.dirty || control.touched;
	}
}
