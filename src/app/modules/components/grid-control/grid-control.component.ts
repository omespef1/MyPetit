import { Component, EventEmitter, Input, OnInit, Output, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import {
	debounceTime,
	delay,
	distinctUntilChanged,
	filter,
} from 'rxjs/operators';
import {
	GroupingState,
	ITableState,
	PaginatorState,
	SortState,
	TableService,
} from 'src/app/_metronic/shared/crud-table';
import notify from 'devextreme/ui/notify';

export interface ColumnInfo {
	columnName: string;
	columnTitle: string;
	sortable: boolean;
	datePipe?: string;
	pipe?: PipeTransform;
	width?: number;
	template?: string;
	svgIconOption?: {
		value: any;
		icon: string;
		color: 'primary' | 'success' | 'danger' | 'info' | 'warning';
		tooltip?: string;
	}[];
	customOptions?: {
		value: any;
		text: string;
		class: string;
	}[];
	hide?: boolean;
}

@Component({
	selector: 'app-grid-control',
	templateUrl: './grid-control.component.html',
	styleUrls: ['./grid-control.component.scss'],
})
export class GridControlComponent implements OnInit {
	@Input() searchOnInit = true;
	@Input() widthActions = 150;
	@Input() columns: ColumnInfo[] = [];
	@Input() showEdit = false;
	@Input() showDelete = false;
	@Input() showView = false;
	@Input() items$: Observable<any>;
	@Input() entityService: TableService<any>;
	@Input() sortField: string = 'id';
	@Input() sortDirection: 'asc' | 'desc' = 'asc';
	@Input() table_name: string;

	@Input() routerLinkPath: string;
	@Input() propertyLink: string;

	@Output() ShowClick = new EventEmitter<any>();
	@Output() EditClick = new EventEmitter<any>();
	@Output() DeleteClick = new EventEmitter<any>();
	@Output() patchState = new EventEmitter<Partial<ITableState>>();

	paginator: PaginatorState;
	searchGroup: FormGroup;
	sorting: SortState;
	grouping: GroupingState;
	isLoading$: Observable<boolean>;
	private subscriptions: Subscription[] = [];

	constructor(private readonly fb: FormBuilder) {}

	ngOnInit(): void {
		this.isLoading$ = this.entityService.isLoading$;
		this.searchForm();
		this.paginator = this.entityService.paginator;
		this.grouping = this.entityService.grouping;
		this.sorting = this.entityService.sorting;

		if (this.searchOnInit) {
			of(undefined)
				.pipe(delay(1))
				.subscribe(() => {
					this.patchState.emit({
						sorting: {
							column: this.sortField,
							direction: this.sortDirection,
						},
					});
				});
		}
		this.subscriptions.push(
			this.entityService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => notify(err, 'error', 2000))
		);
	}

	getRouterLink(item: any) {
		return `${this.routerLinkPath}/${item[this.propertyLink]}`;
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(
				/*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
				debounceTime(150),
				distinctUntilChanged()
			)
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.patchState.emit({
			searchTerm,
		});
	}

	sort(column: string): void {
		const sorting = this.sorting;
		const isActiveColumn = sorting.column === column;
		if (!isActiveColumn) {
			sorting.column = column;
			sorting.direction = 'asc';
		} else {
			sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
		}

		this.patchState.emit({
			sorting,
		});
	}

	// pagination
	paginate(paginator: PaginatorState) {
		this.patchState.emit({
			paginator,
		});
	}

	delete(i) {}

	showClick(item: any) {
		this.ShowClick.emit(item);
	}

	editClick(item: any) {
		this.EditClick.emit(item);
	}

	deleteClick(item: any) {
		this.DeleteClick.emit(item);
	}

	getWidthStyle = (col: ColumnInfo) =>
		`width: ${col.width}px; min-width: ${col.width}px;`;

	getColumnOptionValue(column: ColumnInfo, value: any) {
		const option = column.customOptions.find((m) => m.value === value);
		return option ?? '';
	}

	getSvgIconItem(column: ColumnInfo, value: any) {
		const option = column.svgIconOption.find((m) => m.value === value);
		return option ?? '';
	}

	getWidthActions() {
		return (
			'min-width: ' +
			this.widthActions +
			'px; width: ' +
			this.widthActions +
			'px;'
		);
	}
}
