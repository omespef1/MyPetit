import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BreedModel } from 'src/app/_metronic/core/models/breed.model';
import { PetTypeModel } from 'src/app/_metronic/core/models/pet-type.model';
import { RoleModel } from 'src/app/_metronic/core/models/role.model';
import { VaccineModel } from 'src/app/_metronic/core/models/vaccine.model';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class PetTypeService
	extends TableService<PetTypeModel>
	implements OnDestroy
{
	API_URL = `${environment.apiUrl}/petType`;
	petTypes$ = new BehaviorSubject<PetTypeModel[]>([]);

	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	ngOnDestroy(): void {
		this.setDefaults();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getAll() {
		if (this.petTypes$.value.length > 0) return this.petTypes$;

		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}`;
		return this.http.get<PetTypeModel[]>(url).pipe(
			tap((pt) => this.petTypes$.next(pt)),
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getBreedsByPetTypeId(petTypeId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/breed/${petTypeId}`;
		return this.http.get<BreedModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getVaccinesByPetTypeId(petTypeId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/vaccine/${petTypeId}`;
		return this.http.get<VaccineModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	createBreed(petTypeId: number, breed: BreedModel) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/breed/${petTypeId}`;
		return this.http.post<BreedModel>(url, breed).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	removeBreed(petTypeId: number, breedId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/breed/${petTypeId}/${breedId}`;
		return this.http.delete(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	removeVaccine(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/vaccine/${id}`;
		return this.http.delete(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	createVaccine(petTypeId: number, vaccine: VaccineModel) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/vaccine/${petTypeId}`;
		return this.http.post<VaccineModel>(url, vaccine).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
