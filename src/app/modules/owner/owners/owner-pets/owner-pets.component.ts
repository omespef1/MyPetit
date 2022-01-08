import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { OwnerService } from '../../services/owner.service';
import { AddPetComponent } from '../add-pet/add-pet.component';
import { OwnerPetService } from './owner-pet.service';

@Component({
	selector: 'app-owner-pets',
	templateUrl: './owner-pets.component.html',
	styleUrls: ['./owner-pets.component.scss'],
})
export class OwnerPetsComponent implements OnInit {
	@Input() ownerId: number;
	pets$: Observable<PetModel[]>;
	isLoading$: Observable<boolean>;

	constructor(
		private readonly ownerService: OwnerService,
		private readonly modalService: NgbModal,
		private readonly ownerPetService: OwnerPetService,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.ownerService.isLoading$;
		this.searchAllPets();
		this.ownerPetService.refresData$.subscribe(() => this.searchAllPets());
	}

	searchAllPets() {
		this.pets$ = this.ownerService.getAllPets(this.ownerId);
	}

	editPet(pet: PetModel) {
		const modalRef = this.modalService.open(AddPetComponent, {
			size: 'lg',
		});
		modalRef.componentInstance.ownerId = pet.ownerId;
		modalRef.componentInstance.petId = pet.id;
		modalRef.result.then(
			() => this.ownerPetService.refresData$.next(),
			() => {}
		);
	}

	deletePet(pet: PetModel) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.ownerService.deletePet(pet.id).subscribe(() => {
					this.swal.success('COMMON.RESOURCE_DELETED');
					this.searchAllPets();
				});
			}
		});
	}
}
