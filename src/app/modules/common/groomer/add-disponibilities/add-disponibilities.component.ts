import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { GroomerDisponibilityModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import { RefreshGromerDisponibilitiesService } from './refresh-gromer-disponibilities.service';

@Component({
	selector: 'app-add-disponibilities',
	templateUrl: './add-disponibilities.component.html',
	styleUrls: ['./add-disponibilities.component.scss'],
})
export class AddDisponibilitiesComponent implements OnInit {
	@Input() groomerId: number;
	disponibilities$: Observable<GroomerDisponibilityModel[]>;
	isLoading$: Observable<boolean>;

	constructor(
		private readonly refreshGromerDisponibilitiesService: RefreshGromerDisponibilitiesService,
		private readonly groomerService: GroomerService,
		private readonly modalService: NgbModal,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.groomerService.isLoading$;
		this.searchAllPets();
		this.refreshGromerDisponibilitiesService.refreshData$.subscribe(() =>
			this.searchAllPets()
		);
	}

	searchAllPets() {
		this.disponibilities$ = this.groomerService.getAllDisponibilities(
			this.groomerId
		);
	}

	editPet(disponibility: GroomerDisponibilityModel) {
		// const modalRef = this.modalService.open(AddPetComponent, {
		// 	size: 'lg',
		// });
		// modalRef.componentInstance.ownerId = pet.ownerId;
		// modalRef.componentInstance.petId = pet.id;
		// modalRef.result.then(
		// 	() => this.ownerPetService.refresData$.next(),
		// 	() => {}
		// );
	}

	deletePet(disponibility: GroomerDisponibilityModel) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.groomerService
					.deleteDisponibility(disponibility.id)
					.subscribe(() => {
						this.swal.success('COMMON.RESOURCE_DELETED');
						this.searchAllPets();
					});
			}
		});
	}
}
