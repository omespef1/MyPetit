import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class OwnerPetService implements OnDestroy {
	refresData$ = new Subject();
	private _subscriptions: Subscription[] = [];

	constructor() {}

	ngOnDestroy(): void {
		this._subscriptions.forEach((sb) => sb.unsubscribe());
	}
}
