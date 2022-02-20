import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { GroomerServiceModel } from 'src/app/_metronic/core/models/groomer-service.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ServiceGroomerService
	extends TableService<GroomerServiceModel>
	implements OnDestroy
{
	API_URL = `${environment.apiUrl}/serviceGroomer`;

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	findByGroomerId(groomerId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/groomer/${groomerId}`;
		return this.http.get<GroomerServiceModel>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	createService(service: GroomerServiceModel) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/${service.groomerId}`;
		return this.http
			.post(url, {
				startDate: service.startDate,
				petId: service.petId,
				isMobile: service.isMobile,
				services: service.serviceGroomer.map((m) => {
					return {
						serviceId: m,
					};
				}),
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}

	getScheduleByDate(currentValue: string, isMobile: boolean) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/getScheduleByDate`;
		return this.http
			.post(url, {
				isMobile: isMobile,
				date: currentValue,
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
