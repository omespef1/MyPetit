import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TagModel } from 'src/app/_metronic/core/models/tag.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class TagService extends TableService<TagModel> implements OnDestroy {
	API_URL = `${environment.apiUrl}/tag`;
	tags$ = new BehaviorSubject<TagModel[]>([]);

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getAll() {
		if (this.tags$.value.length > 0) return this.tags$;

		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}`;
		return this.http.get<TagModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
