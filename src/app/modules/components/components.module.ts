import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { ReactiveFormsModule } from '@angular/forms';
import {
	NgbDateAdapter,
	NgbDateStruct,
	NgbDropdownModule,
	NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/_metronic/core';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { GridControlComponent } from './grid-control/grid-control.component';
import { LoadingComponent } from './loading/loading.component';
import { PicSelectComponent } from './pic-select/pic-select.component';
import { SearchLookupComponent } from './search-lookup/search-lookup.component';

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {
	// fromModel(value: string): NgbDateStruct {
	// 	return { year: 0, month: 0, day: 0 };
	// }
	fromModel(value: string): NgbDateStruct {
		if (!value) return null;
		// console.log(value);

		let parts = value.split('-');
		// console.log('value: ', value);
		// console.log('parts: ', parts);
		return { year: +parts[0], month: +parts[1], day: +parts[2] };
	}

	toModel(date: NgbDateStruct): string {
		// from internal model -> your mode
		// console.log('date: ', date);
		return date
			? date.year +
					'-' +
					('0' + date.month).slice(-2) +
					'-' +
					('0' + date.day).slice(-2)
			: null;
	}
}

@Injectable()
export class CustomDateParserFormatter {
	parse(value: string): NgbDateStruct {
		if (!value) return null;
		let parts = value.split('/');
		return {
			year: +parts[0],
			month: +parts[1],
			day: +parts[2],
		} as NgbDateStruct;
	}
	format(date: NgbDateStruct): string {
		return date
			? date.year +
					'/' +
					('0' + date.month).slice(-2) +
					'/' +
					('0' + date.day).slice(-2)
			: null;
	}
}

@NgModule({
	declarations: [
		GridControlComponent,
		LoadingComponent,
		PicSelectComponent,
		SearchLookupComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InlineSVGModule,
		NgbModule,
		CoreModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatTooltipModule,
		MatIconModule,
		MatProgressSpinnerModule,
		NgApexchartsModule,
		NgbDropdownModule,
		CRUDTableModule,
		RouterModule,
	],
	providers: [
		{ provide: NgbDateAdapter, useClass: CustomDateAdapter },
		// {
		// 	provide: NgbDateParserFormatter,
		// 	useClass: CustomDateParserFormatter,
		// },
	],
	exports: [
		GridControlComponent,
		LoadingComponent,
		PicSelectComponent,
		SearchLookupComponent,
	],
})
export class ComponentsModule {}
