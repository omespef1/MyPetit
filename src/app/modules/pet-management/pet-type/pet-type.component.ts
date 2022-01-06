import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { PetTypeService } from '../services/pet-type.service';

@Component({
	selector: 'app-pet-type',
	templateUrl: './pet-type.component.html',
	styleUrls: ['./pet-type.component.scss'],
})
export class PetTypeComponent implements OnInit, OnDestroy {
	columns: ColumnInfo[] = [
		{
			columnName: 'name',
			columnTitle: 'PET_TYPE.NAME',
			sortable: true,
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public petTypeService: PetTypeService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.petTypeService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.petTypeService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.petTypeService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.petTypeService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.petTypeService.patchState({ searchTerm });
	}
}
