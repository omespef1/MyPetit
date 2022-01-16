import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { TagModel } from 'src/app/_metronic/core/models/tag.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { ThirdPartyService } from '../services/third.party.service';

@Component({
	selector: 'app-third-party',
	templateUrl: './third-party.component.html',
	styleUrls: ['./third-party.component.scss'],
})
export class ThirdPartyComponent implements OnInit, OnDestroy {
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
			columnName: 'address',
			columnTitle: 'THIRD_PARTY.ADDRESS',
			sortable: true,
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public thirdPartyService: ThirdPartyService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.thirdPartyService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.thirdPartyService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.thirdPartyService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.thirdPartyService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.thirdPartyService.patchState({ searchTerm });
	}

	delete(tag: TagModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.thirdPartyService.delete(tag.id).subscribe(() => {
						this.swalService.success('COMMON.RESOURCE_DELETED');
						this.thirdPartyService.patchState({});
					});
				}
			});
	}
}
