import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GroomerDisponibilityModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import { RefreshGroomerDisponibilitiesService } from './refresh-groomer-disponibilities.service';

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
		private readonly refreshGroomerDisponibilitiesService: RefreshGroomerDisponibilitiesService,
		private readonly groomerService: GroomerService,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {
		this.isLoading$ = this.groomerService.isLoading$;
		this.searchAllPets();
		this.refreshGroomerDisponibilitiesService.refreshData$.subscribe(() =>
			this.searchAllPets()
		);
	}

	searchAllPets() {
		this.disponibilities$ = this.groomerService.getAllDisponibilities(
			this.groomerId
		);
	}

	deleteDisponibility(disponibility: GroomerDisponibilityModel) {
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
