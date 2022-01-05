import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ITableState } from 'src/app/_metronic/shared/crud-table';
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
			columnName: 'id',
			columnTitle: 'AGREEMENT.AGREEMENTID',
			sortable: true,
		},
		{
			columnName: 'convenioGuid',
			columnTitle: 'AGREEMENT.UPPER_GUID',
			sortable: true,
		},
		{
			columnName: 'nombre',
			columnTitle: 'AGREEMENT.UPPER_NAME',
			sortable: true,
		},
		{
			columnName: 'accountToken',
			columnTitle: 'AGREEMENT.ACCOUNT_TOKEN',
			sortable: false,
		},
	];
	searchGroup: FormGroup;
	filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		public userService: UserService,
		private translateService: TranslateService
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
				.subscribe((err) => notify(err))
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

	delete(id: number): void {
		// this.messageDialogService
		// 	.showQuestion(
		// 		this.translateService.instant('COMMON.DELETE_MESSAGE_QUESTION')
		// 	)
		// 	.then((result) => {
		// 		if (result.isConfirmed) {
		// 			this.userService.delete(id).subscribe(() => {
		// 				this.messageDialogService.showSuccess(
		// 					this.translateService.instant(
		// 						'COMMON.RESOURCE_DELETED'
		// 					)
		// 				);
		// 				this.filter();
		// 			});
		// 		}
		// 	});
	}
}
