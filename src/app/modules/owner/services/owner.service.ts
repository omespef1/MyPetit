import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { OwnerModel } from 'src/app/_metronic/core/models/owner.model';
import { PetVaccineModel } from 'src/app/_metronic/core/models/pet-vaccine.model';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
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

	getPetById(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/pets/getPetbyId/${id}`;
		return this.http.get<PetModel>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getAllPets(ownerId: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/pets/${ownerId}`;
		return this.http.get<PetModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	createPet(ownerId: number, pet: PetModel, vaccines: PetVaccineModel[]) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/pets/${ownerId}`;
		return this.http.post<PetModel>(url, pet).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	updatePet(
		ownerId: number,
		id: number,
		pet: PetModel,
		vaccines: PetVaccineModel[]
	) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/pets/${ownerId}/${id}`;
		return this.http
			.put<PetModel>(url, {
				pet,
				vaccines,
			})
			.pipe(
				catchError((err) => {
					this._errorMessage.next(ErrorUtil.getMessage(err));
					throw err;
				}),
				finalize(() => this._isLoading$.next(false))
			);
	}

	deletePet(id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/pets/${id}`;
		return this.http.delete(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	getVaccinesByPetId(petTypeId: number, id: number) {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/pets/vaccine/${petTypeId}/${id}`;
		return this.http.get<PetVaccineModel[]>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}
}
