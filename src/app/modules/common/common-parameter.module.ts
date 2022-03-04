import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonParameterComponent } from './common-parameter.component';
import { ThirdPartyComponent } from './third-party/third-party.component';
import { GroomerComponent } from './groomer/groomer.component';
import { CommonParameterRoutingModule } from './common-parameter-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { ThirdPartyEditComponent } from './third-party/third-party-edit/third-party-edit.component';
import { GroomerEditComponent } from './groomer/groomer-edit/groomer-edit.component';
import { AddDisponibilitiesComponent } from './groomer/add-disponibilities/add-disponibilities.component';
import { CoreModule } from 'src/app/_metronic/core';
import { AddDisponibilityModalComponent } from './groomer/add-disponibility-modal/add-disponibility-modal.component';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import { AddGroomerDisponibilitiesScheduleComponent } from './groomer/add-groomer-disponibilities-schedule/add-groomer-disponibilities-schedule.component';
import { AddMobileDisponibilityComponent } from './groomer/add-mobile-disponibility/add-mobile-disponibility.component';
import { SettingComponent } from './setting/setting.component';
import { TagifyModule, TagifyService } from 'ngx-tagify';

@NgModule({
	declarations: [
		CommonParameterComponent,
		ThirdPartyComponent,
		GroomerComponent,
		ThirdPartyEditComponent,
		GroomerEditComponent,
		AddDisponibilitiesComponent,
		AddDisponibilityModalComponent,
		AddGroomerDisponibilitiesScheduleComponent,
		AddMobileDisponibilityComponent,
		SettingComponent,
	],
	imports: [
		CoreModule,
		CommonModule,
		CommonParameterRoutingModule,
		ReactiveFormsModule,
		CRUDTableModule,
		InlineSVGModule,
		NgbModalModule,
		TranslateModule.forChild(),
		TagifyModule.forRoot(),
		ComponentsModule,
		NgbModule,
		DxSchedulerModule,
		DxTemplateModule,
	],
	providers: [TagifyService],
})
export class CommonParameterModule {}
