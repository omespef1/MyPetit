import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { CityModel } from 'src/app/_metronic/core/models/city.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CityService extends TableService<CityModel> implements OnDestroy {
	API_URL = `${environment.apiUrl}/city`;

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getAllByStateId(stateId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/state/${stateId}`;
		return this.http.get<CityModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
