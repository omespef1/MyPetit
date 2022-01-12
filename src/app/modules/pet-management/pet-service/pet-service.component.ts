import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { TagModel } from 'src/app/_metronic/core/models/tag.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { TranslationService } from '../../i18n/translation.service';
import { PetServiceService } from '../services/pet-service.service';

@Component({
	selector: 'app-pet-service',
	templateUrl: './pet-service.component.html',
	styleUrls: ['./pet-service.component.scss'],
})
export class PetServiceComponent implements OnInit, OnDestroy {
	columns: ColumnInfo[] = [
		{
			columnName: 'name',
			columnTitle: 'PET_SERVICE.NAME',
			sortable: true,
		},
		{
			columnName: 'petTypeName',
			columnTitle: 'PET_TYPE.NAME',
			sortable: true,
		},
		{
			columnName: 'weightInit',
			columnTitle: 'PET_SERVICE.INITIAL_WEIGHT',
			sortable: true,
		},
		{
			columnName: 'weightEnd',
			columnTitle: 'PET_SERVICE.END_WEIGHT',
			sortable: true,
		},
		{
			columnName: 'hairLengthName',
			columnTitle: 'HAIR.NAME',
			sortable: true,
		},
		{
			columnName: 'cost',
			columnTitle: 'PET_SERVICE.COST',
			sortable: true,
			pipe: new CurrencyPipe(
				this.translationService.getSelectedLanguage()
			),
		},
		{
			columnName: 'duration',
			columnTitle: 'PET_SERVICE.DURATION',
			sortable: true,
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public petServiceService: PetServiceService,
		private translationService: TranslationService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.petServiceService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.petServiceService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.petServiceService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.petServiceService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.petServiceService.patchState({ searchTerm });
	}

	delete(tag: TagModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.petServiceService.delete(tag.id).subscribe(() => {
						this.swalService.success('COMMON.RESOURCE_DELETED');
						this.petServiceService.patchState({});
					});
				}
			});
	}
}
