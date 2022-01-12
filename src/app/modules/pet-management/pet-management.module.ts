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
import { EditTypeComponent } from './pet-type/edit-type/edit-type.component';
import { AddBreedComponent } from './pet-type/add-breed/add-breed.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';
import { HairLengthsComponent } from './hair-lengths/hair-lengths.component';
import { HairLengthEditComponent } from './hair-lengths/hair-length-edit/hair-length-edit.component';
import { AddVaccineComponent } from './pet-type/add-vaccine/add-vaccine.component';
import { PetServiceComponent } from './pet-service/pet-service.component';

@NgModule({
	declarations: [PetManagementComponent, PetTypeComponent, TagsComponent, EditTypeComponent, AddBreedComponent, TagEditComponent, HairLengthsComponent, HairLengthEditComponent, AddVaccineComponent, PetServiceComponent],
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
