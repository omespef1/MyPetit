// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { environment } from '../../../../../environments/environment';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';

export abstract class TableService<T> {
	DEFAULT_STATE: ITableState = {
		filter: {},
		paginator: new PaginatorState(),
		sorting: new SortState(),
		searchTerm: '',
		// grouping: new GroupingState(),
		// entityId: undefined,
	};

	// Private fields
	public _items$ = new BehaviorSubject<T[]>([]);
	public _isLoading$ = new BehaviorSubject<boolean>(false);
	private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
	public _tableState$ = new BehaviorSubject<ITableState>({
		...this.DEFAULT_STATE,
	});
	public _errorMessage = new Subject<string>();
	private _subscriptions: Subscription[] = [];

	// Getters
	get items$() {
		return this._items$.asObservable();
	}
	get isLoading$() {
		return this._isLoading$.asObservable();
	}
	get isFirstLoading$() {
		return this._isFirstLoading$.asObservable();
	}
	get errorMessage$() {
		return this._errorMessage.asObservable();
	}
	get subscriptions() {
		return this._subscriptions;
	}
	// State getters
	get paginator() {
		return this._tableState$.value.paginator;
	}
	get filter() {
		return this._tableState$.value.filter;
	}
	get sorting() {
		return this._tableState$.value.sorting;
	}
	get searchTerm() {
		return this._tableState$.value.searchTerm;
	}
	get grouping() {
		return null; // this._tableState$.value.grouping;
	}
	get tableState$() {
		return this._tableState$.asObservable();
	}

	protected http: HttpClient;
	// API URL has to be overrided
	API_URL = `${environment.apiUrl}/endpoint`;
	constructor(http: HttpClient) {
		this.http = http;
	}

	// CREATE
	// server should return the object with ID
	create(item: BaseModel): Observable<BaseModel> {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		return this.http.post<BaseModel>(this.API_URL, item).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('CREATE ITEM', err);
				// return of({ id: undefined });
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	// READ (Returning filtered list of entities)
	find(tableState: ITableState): Observable<TableResponseModel<T>> {
		const url = this.API_URL + '/find';
		this._errorMessage.next('');
		const state = { ...tableState };
		return this.http.post<TableResponseModel<T>>(url, state).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('FIND ITEMS', err);
				return of({ items: [], total: 0 });
			})
		);
	}

	getItemById(id: number): Observable<BaseModel> {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/${id}`;
		return this.http.get<BaseModel>(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('GET ITEM BY ID', id, err);
				return of({ id: undefined });
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	// UPDATE
	update(item: BaseModel): Observable<any> {
		const url = `${this.API_URL}/${item.id}`;
		this._isLoading$.next(true);
		this._errorMessage.next('');
		return this.http.put(url, item).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('UPDATE ITEM', item, err);
				// return of(item);
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	// UPDATE Status
	updateStatusForItems(ids: number[], status: number): Observable<any> {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const body = { ids, status };
		const url = this.API_URL + '/updateStatus';
		return this.http.put(url, body).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error(
					'UPDATE STATUS FOR SELECTED ITEMS',
					ids,
					status,
					err
				);
				return of([]);
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	// DELETE
	delete(id: any): Observable<any> {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = `${this.API_URL}/${id}`;
		return this.http.delete(url).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('DELETE ITEM', id, err);
				// return of({});
				throw err;
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	// delete list of items
	deleteItems(ids: number[] = []): Observable<any> {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const url = this.API_URL + '/deleteItems';
		const body = { ids };
		return this.http.put(url, body).pipe(
			catchError((err) => {
				this._errorMessage.next(ErrorUtil.getMessage(err));
				console.error('DELETE SELECTED ITEMS', ids, err);
				return of([]);
			}),
			finalize(() => this._isLoading$.next(false))
		);
	}

	public fetch() {
		this._isLoading$.next(true);
		this._errorMessage.next('');
		const request = this.find(this._tableState$.value)
			.pipe(
				tap((res: TableResponseModel<T>) => {
					this._items$.next(res.items);
					this.patchStateWithoutFetch({
						paginator:
							this._tableState$.value.paginator.recalculatePaginator(
								res.total
							),
					});
				}),
				catchError((err) => {
					this._errorMessage.next(err);
					return of({
						items: [],
						total: 0,
					});
				}),
				finalize(() => {
					this._isLoading$.next(false);
				})
			)
			.subscribe();
		this._subscriptions.push(request);
	}

	public setDefaults() {
		this.patchStateWithoutFetch({ ...this.DEFAULT_STATE });
		this._isFirstLoading$.next(true);
		this._isLoading$.next(false);
		this._tableState$.next({ ...this.DEFAULT_STATE });
		this._errorMessage.next('');
	}

	// Base Methods
	public patchState(patch: Partial<ITableState>) {
		this.patchStateWithoutFetch(patch);
		this.fetch();
	}

	public patchStateWithoutFetch(patch: Partial<ITableState>) {
		const newState = Object.assign(
			{ ...this._tableState$.value },
			{ ...patch }
		);
		this._tableState$.next(newState);
	}
}
