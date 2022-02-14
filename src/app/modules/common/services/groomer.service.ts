import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { GroomerDisponibilityModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { GroomerMobileDisponibilityModel } from 'src/app/_metronic/core/models/groomer-mobile-disponibility.model';
import { GroomerModel } from 'src/app/_metronic/core/models/groomer.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class GroomerService
	extends TableService<GroomerModel>
	implements OnDestroy
{
	API_URL = `${environment.apiUrl}/groomer`;
	groomers$ = new BehaviorSubject<GroomerModel[]>([]);

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getAll() {
		if (this.groomers$.value.length > 0) return this.groomers$;

		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}`;
		return this.http.get<GroomerModel[]>(url).pipe(
			tap((pt) => this.groomers$.next(pt)),
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getAllWithDisponibility() {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}`;
		return this.http.get<GroomerModel[]>(`${url}/getAllWithDisponibility`).pipe(
			tap((pt) => this.groomers$.next(pt)),
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getAllDisponibilities(groomerId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/disponibility/${groomerId}`;
		return this.http.get<GroomerDisponibilityModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	deleteDisponibility(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/disponibility/${id}`;
		return this.http.delete(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	createDisponibility(
		groomerId: number,
		dayOfWeek: number,
		startDate: { hour: number; minute: number; second: number },
		endDate: { hour: number; minute: number; second: number }
	) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/disponibility/${groomerId}`;
		return this.http
			.post<GroomerDisponibilityModel>(url, {
				dayOfWeek,
				startDate: {
					hours: startDate.hour,
					minutes: startDate.minute,
					seconds: startDate.second,
				},
				endDate: {
					hours: endDate.hour,
					minutes: endDate.minute,
					seconds: endDate.second,
				},
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}

	editDisponibility(
		id: number,
		dayOfWeek: number,
		startDate: { hour: number; minute: number; second: number },
		endDate: { hour: number; minute: number; second: number }
	) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/disponibility/${id}`;
		return this.http
			.put<GroomerDisponibilityModel>(url, {
				dayOfWeek,
				startDate: {
					hours: startDate.hour,
					minutes: startDate.minute,
					seconds: startDate.second,
				},
				endDate: {
					hours: endDate.hour,
					minutes: endDate.minute,
					seconds: endDate.second,
				},
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}

	getAllMobileDisponibilities(groomerId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/mobileDisponibility/${groomerId}`;
		return this.http.get<GroomerMobileDisponibilityModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	deleteMobileDisponibility(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/mobileDisponibility/${id}`;
		return this.http.delete(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	createMobileDisponibility(
		groomerId: number,
		dayOfWeek: number,
		startDate: { hour: number; minute: number; second: number },
		endDate: { hour: number; minute: number; second: number }
	) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/mobileDisponibility/${groomerId}`;
		return this.http
			.post<GroomerMobileDisponibilityModel>(url, {
				dayOfWeek,
				startDate: {
					hours: startDate.hour,
					minutes: startDate.minute,
					seconds: startDate.second,
				},
				endDate: {
					hours: endDate.hour,
					minutes: endDate.minute,
					seconds: endDate.second,
				},
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}

	editMobileDisponibility(
		id: number,
		dayOfWeek: number,
		startDate: { hour: number; minute: number; second: number },
		endDate: { hour: number; minute: number; second: number }
	) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/mobileDisponibility/${id}`;
		return this.http
			.put<GroomerMobileDisponibilityModel>(url, {
				dayOfWeek,
				startDate: {
					hours: startDate.hour,
					minutes: startDate.minute,
					seconds: startDate.second,
				},
				endDate: {
					hours: endDate.hour,
					minutes: endDate.minute,
					seconds: endDate.second,
				},
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}
}
