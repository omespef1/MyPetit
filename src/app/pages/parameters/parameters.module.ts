import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeneralModule } from '../../_metronic/partials/content/general/general.module';
import { ParametersComponent } from './parameters.component';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule } from 'ngx-highlightjs';
import {MatExpansionModule} from '@angular/material/expansion';
import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [ParametersComponent],
  imports: [
    CommonModule,
    FormsModule,
    GeneralModule,
    HighlightModule,
    NgbNavModule,
    NgbTooltipModule,
    MatExpansionModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ParametersComponent,
      },
    ]),
  ],
})
export class ParametersModule {}
