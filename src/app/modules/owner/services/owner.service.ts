import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { OwnerModel } from 'src/app/_metronic/core/models/owner.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OwnerService
	extends TableService<OwnerModel>
	implements OnDestroy
{
	API_URL = `${environment.apiUrl}/owner`;

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getAll() {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}`;
		return this.http.get<OwnerModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
