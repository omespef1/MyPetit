import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetManagementComponent } from './pet-management.component';
import { PetManagementRoutingModule } from './pet-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../components/components.module';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PetTypeComponent } from './pet-type/pet-type.component';
import { TagsComponent } from './tags/tags.component';

@NgModule({
	declarations: [PetManagementComponent, PetTypeComponent, TagsComponent],
	imports: [
		PetManagementRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		CRUDTableModule,
		InlineSVGModule,
		NgbModalModule,
		TranslateModule.forChild(),
		ComponentsModule,
		MatButtonModule,
		NgbModule,
	],
})
export class PetManagementModule {}
