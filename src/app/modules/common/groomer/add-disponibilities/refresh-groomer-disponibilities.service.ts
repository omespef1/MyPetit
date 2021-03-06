import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RefreshGroomerDisponibilitiesService {
	refreshData$ = new Subject();
	refreshMobileData$ = new Subject();
	private _subscriptions: Subscription[] = [];

	constructor() {}

	ngOnDestroy(): void {
		this._subscriptions.forEach((sb) => sb.unsubscribe());
	}
}
