import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnInit,
	Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OwnerService } from 'src/app/modules/owner/services/owner.service';
import { OwnerModel } from 'src/app/_metronic/core/models/owner.model';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';

@Component({
	selector: 'app-select-pet',
	templateUrl: './select-pet.component.html',
	styleUrls: ['./select-pet.component.scss'],
})
export class SelectPetComponent implements OnInit {
	@Output() ownerChange = new EventEmitter<number>();
	@Output() petChange = new EventEmitter<number>();
	formGroup: FormGroup;
	owners: OwnerModel[] = [];
	pets: PetModel[] = [];
	owner_formatter = (x: any) =>
		`${x.documentNumber} - ${x.names} ${x.lastNames}`;
	name_formatter = (x: any) => x.name;
	isLoading$: Observable<boolean>;

	constructor(
		private readonly fb: FormBuilder,
		private readonly ownerService: OwnerService,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.ownerService.isLoading$;
	}

	ngOnInit(): void {
		this.findOwners();
		this.loadForm();
	}

	findOwners() {
		this.ownerService.getAll().subscribe((o) => {
			this.owners = o;
		});
	}

	findPets(ownerId: number) {
		if (!ownerId) return;

		this.ownerService.getAllPets(ownerId).subscribe((o) => (this.pets = o));
	}

	loadForm() {
		this.formGroup = this.fb.group({
			ownerId: [],
			petId: [],
		});

		this.formGroup.controls.ownerId.valueChanges.subscribe((ownerId) => {
			this.ownerChange.emit(ownerId);
			this.findPets(ownerId);
		});

		this.formGroup.controls.petId.valueChanges.subscribe((petId) => {
			this.petChange.emit(petId);
		});
	}
}
