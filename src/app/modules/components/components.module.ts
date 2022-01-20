import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { DisponibilityScheduleComponent } from './disponibility-schedule/disponibility-schedule.component';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';

@NgModule({
	declarations: [
		GridControlComponent,
		LoadingComponent,
		PicSelectComponent,
		SearchLookupComponent,
		DisponibilityScheduleComponent,
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
		DxSchedulerModule,
		DxTemplateModule,
	],
	providers: [],
	exports: [
		GridControlComponent,
		LoadingComponent,
		PicSelectComponent,
		SearchLookupComponent,
	],
})
export class ComponentsModule {}
