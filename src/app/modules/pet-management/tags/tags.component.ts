import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { TagModel } from 'src/app/_metronic/core/models/tag.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { TagService } from '../services/tag.service';

@Component({
	selector: 'app-tags',
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit, OnDestroy {
	columns: ColumnInfo[] = [
		{
			columnName: 'description',
			columnTitle: 'TAG.NAME',
			sortable: true,
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public tagService: TagService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.tagService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.tagService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.tagService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.tagService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.tagService.patchState({ searchTerm });
	}

	delete(tag: TagModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.tagService.delete(tag.id).subscribe(() => {
						this.swalService.success('COMMON.RESOURCE_DELETED');
						this.tagService.patchState({});
					});
				}
			});
	}
}
