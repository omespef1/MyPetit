import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UserRoleModel } from 'src/app/_metronic/core/models/user-role.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { UserModel } from '../../auth';

@Injectable({
	providedIn: 'root',
})
export class UserService extends TableService<UserModel> implements OnDestroy {
	API_URL = `${environment.apiUrl}/user`;

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getItemByUserId(id: string): Observable<UserModel> {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/${id}`;
		return this.http.get<UserModel>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('GET ITEM BY ID', id, err);
				return of(undefined);
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getAllByAgreementId(agreementId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/getAll/${agreementId}`;
		return this.http.get<UserModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getRolesByUserId(userId: string) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/roles/${userId}`;
		return this.http.get<UserRoleModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
