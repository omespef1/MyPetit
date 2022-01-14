import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TypesService } from 'src/app/modules/_services/types.service';
import notify from 'devextreme/ui/notify';

@Component({
	selector: 'app-parameters',
	templateUrl: './parameters.component.html',
	styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit {
	dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

	constructor(private _service: TypesService) {}

	ngOnInit(): void {
		this.LoadRequest();
	}

	LoadRequest() {
		try {
			this._service.GetTypes().subscribe((resp) => {
				if (resp.isSuccessfull) {
					this.dataSource.next(resp.result);
				}
			});
		} catch (error) {
			// notify(error.message, 'error', 2000);
		}
	}
}
