import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { TagModel } from 'src/app/_metronic/core/models/tag.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { GroomerService } from '../services/groomer.service';

@Component({
  selector: 'app-groomer',
  templateUrl: './groomer.component.html',
  styleUrls: ['./groomer.component.scss']
})
export class GroomerComponent implements OnInit, OnDestroy {
	columns: ColumnInfo[] = [
		{
			columnName: 'thirdPartyDocumentNumber',
			columnTitle: 'OWNER.DOCUMENT_NUMBER',
			sortable: true,
		},
		{
			columnName: 'thirdPartyFullName',
			columnTitle: 'OWNER.NAMES',
			sortable: true,
		},
		{
			columnName: 'thirdPartyEmail',
			columnTitle: 'OWNER.EMAIL',
			sortable: true,
		},
		{
			columnName: 'thirdPartyPhoneNumber',
			columnTitle: 'OWNER.PHONE_NUMBER',
			sortable: true,
		},
		{
			columnName: 'isActive',
			columnTitle: 'USER.STATE',
			sortable: true,
      customOptions: [
				{
					value: true,
					text: 'COMMON.ACTIVE',
					class: 'label-light-success',
				},
				{
					value: false,
					text: 'COMMON.INACTIVE',
					class: 'label-light-danger',
				},
			],
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public groomerService: GroomerService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.groomerService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.groomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.groomerService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.groomerService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.groomerService.patchState({ searchTerm });
	}

	delete(tag: TagModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.groomerService.delete(tag.id).subscribe(() => {
						this.swalService.success('COMMON.RESOURCE_DELETED');
						this.groomerService.patchState({});
					});
				}
			});
	}
}
