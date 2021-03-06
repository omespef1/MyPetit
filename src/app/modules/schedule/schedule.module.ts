import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroomerScheduleComponent } from './groomer-schedule/groomer-schedule.component';
import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { CoreModule } from 'src/app/_metronic/core';
import { CommonParameterRoutingModule } from '../common/common-parameter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { DxCalendarModule, DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';

@NgModule({
	declarations: [GroomerScheduleComponent, ScheduleComponent],
	imports: [
		CommonModule,
		ScheduleRoutingModule,
		CoreModule,
		CommonParameterRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		CRUDTableModule,
		InlineSVGModule,
		NgbModalModule,
		TranslateModule.forChild(),
		ComponentsModule,
		NgbModule,
		DxSchedulerModule,
		DxTemplateModule,
		DxCalendarModule
	],
})
export class ScheduleModule {}
