import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsModule } from '../components/components.module';

@NgModule({
	declarations: [UsersComponent, RolesComponent, UserManagementComponent],
	imports: [
		UserManagementRoutingModule,
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
export class UserManagementModule {}
