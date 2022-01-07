import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { OwnerService } from '../services/owner.service';

@Component({
	selector: 'app-owners',
	templateUrl: './owners.component.html',
	styleUrls: ['./owners.component.scss'],
})
export class OwnersComponent implements OnInit, OnDestroy {
	columns: ColumnInfo[] = [
		{
			columnName: 'documentNumber',
			columnTitle: 'OWNER.DOCUMENT_NUMBER',
			sortable: true,
		},
		{
			columnName: 'names',
			columnTitle: 'OWNER.NAMES',
			sortable: true,
		},
		{
			columnName: 'lastNames',
			columnTitle: 'OWNER.LAST_NAMES',
			sortable: true,
		},
    {
			columnName: 'email',
			columnTitle: 'OWNER.EMAIL',
			sortable: true,
		},
    {
			columnName: 'phoneNumber',
			columnTitle: 'OWNER.PHONE_NUMBER',
			sortable: true,
		},
    {
			columnName: 'address1',
			columnTitle: 'OWNER.ADDRESS1',
			sortable: true,
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public ownerService: OwnerService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.ownerService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.ownerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.ownerService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.ownerService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.ownerService.patchState({ searchTerm });
	}
}
