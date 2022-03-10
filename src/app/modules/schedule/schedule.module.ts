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
import {
	DxCalendarModule,
	DxDateBoxModule,
	DxSchedulerModule,
	DxTemplateModule,
} from 'devextreme-angular';
import { AddServiceModalComponent } from './groomer-schedule/add-service-modal/add-service-modal.component';
import { SelectPetComponent } from './groomer-schedule/select-pet/select-pet.component';
import { MobileGroomerScheduleComponent } from './mobile-groomer-schedule/mobile-groomer-schedule.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddPaymentComponent } from './groomer-schedule/add-payment/add-payment.component';
import { ResumeServiceModalComponent } from './groomer-schedule/resume-service-modal/resume-service-modal.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';

@NgModule({
	declarations: [
		GroomerScheduleComponent,
		ScheduleComponent,
		AddServiceModalComponent,
		SelectPetComponent,
		MobileGroomerScheduleComponent,
		AddPaymentComponent,
		ResumeServiceModalComponent,
	],
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
		DxDateBoxModule,
		DxCalendarModule,
		FileUploadModule,
		NgxPermissionsModule.forChild(),
	],
})
export class ScheduleModule {}
