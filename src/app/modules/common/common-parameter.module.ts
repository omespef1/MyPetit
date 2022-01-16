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

@NgModule({
	declarations: [
		CommonParameterComponent,
		ThirdPartyComponent,
		GroomerComponent,
		ThirdPartyEditComponent,
		GroomerEditComponent,
		AddDisponibilitiesComponent,
	],
	imports: [
		CommonModule,
		CommonParameterRoutingModule,
		ReactiveFormsModule,
		CRUDTableModule,
		InlineSVGModule,
		NgbModalModule,
		TranslateModule.forChild(),
		ComponentsModule,
		NgbModule,
	],
})
export class CommonParameterModule {}
