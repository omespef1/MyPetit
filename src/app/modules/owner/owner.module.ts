import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerRoutingModule } from './owner-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { MatButtonModule } from '@angular/material/button';
import { OwnersComponent } from './owners/owners.component';
import { OwnerComponent } from './owner.component';
import { OwnerEditComponent } from './owners/owner-edit/owner-edit.component';
import { OwnerPetsComponent } from './owners/owner-pets/owner-pets.component';
import { CardPetComponent } from './owners/owner-pets/card-pet/card-pet.component';
import { AddPetComponent } from './owners/add-pet/add-pet.component';

@NgModule({
	declarations: [OwnerComponent, OwnersComponent, OwnerEditComponent, OwnerPetsComponent, CardPetComponent, AddPetComponent],
	imports: [
		OwnerRoutingModule,
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
export class OwnerModule {}
