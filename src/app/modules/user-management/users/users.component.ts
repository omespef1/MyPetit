import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
import { UserModel } from '../../auth';
import { ColumnInfo } from '../../components/grid-control/grid-control.component';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
	columns: ColumnInfo[] = [
		{
			columnName: 'userName',
			columnTitle: 'USER.USERNAME',
			sortable: true,
		},
		{
			columnName: 'fullName',
			columnTitle: 'USER.FULL_NAME',
			sortable: true,
		},
		{
			columnName: 'email',
			columnTitle: 'USER.EMAIL',
			sortable: true,
		},
		{
			columnName: 'phoneNumber',
			columnTitle: 'USER.PHONE_NUMBER',
			sortable: true,
		},
		{
			template: (item: UserModel) => item?.roles.join(', '),
			columnTitle: 'USER.ROLES',
			sortable: true,
		},
		{
			columnName: 'isActive',
			columnTitle: 'USER.STATE',
			sortable: false,
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
		public userService: UserService,
		private swalService: SwalService
	) {}

	ngOnDestroy(): void {
		this.userService.ngOnDestroy();
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	ngOnInit(): void {
		this.searchForm();
		this.subscriptions.push(
			this.userService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swalService.error(err))
		);
	}

	fetch(patch: Partial<ITableState>) {
		this.userService.fetch();
	}

	searchForm(): void {
		this.searchGroup = this.fb.group({
			searchTerm: [this.userService.searchTerm],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string): void {
		this.userService.patchState({ searchTerm });
	}
}
