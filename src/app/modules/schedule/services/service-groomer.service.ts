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

	updateService(service: GroomerServiceModel) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/${service.id}`;
		return this.http
			.put(url, {
				startDate: service.startDate,
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

	addPayment(groomerPetServiceId: number, paymentTypeId: any, value: any) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/addPayment/${groomerPetServiceId}`;
		return this.http
			.post(url, {
				paymentTypeId,
				value,
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}

	start(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/start/${id}`;
		return this.http.put(url, {}).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	findResumeService(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/findResumeService/${id}`;
		return this.http.get(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	saveResume(id: number, formData: FormData) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/resume/${id}`;
		return this.http.post(url, formData).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	downloadFile(fileId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/downloadFile/${fileId}`;
		return this.http.get(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
