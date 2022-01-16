import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ThirdPartyModel } from 'src/app/_metronic/core/models/third-party.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ThirdPartyService
	extends TableService<ThirdPartyModel>
	implements OnDestroy
{
	API_URL = `${environment.apiUrl}/thirdParty`;
	thirdParties$ = new BehaviorSubject<ThirdPartyModel[]>([]);

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getAll() {
		if (this.thirdParties$.value.length > 0) return this.thirdParties$;

		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}`;
		return this.http.get<ThirdPartyModel[]>(url).pipe(
			tap((pt) => this.thirdParties$.next(pt)),
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
