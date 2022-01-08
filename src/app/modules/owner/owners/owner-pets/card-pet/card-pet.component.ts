import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';

@Component({
	selector: 'app-card-pet',
	templateUrl: './card-pet.component.html',
	styleUrls: ['./card-pet.component.scss'],
})
export class CardPetComponent implements OnInit {
	@Input() pet: PetModel;
	@Output() edit = new EventEmitter<PetModel>();
	@Output() delete = new EventEmitter<PetModel>();

	constructor() {}

	ngOnInit(): void {}

	onEdit() {
		this.edit.emit(this.pet);
	}

	onDelete() {
		this.delete.emit(this.pet);
	}
}
