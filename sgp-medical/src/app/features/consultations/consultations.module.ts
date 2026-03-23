import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultationsRoutingModule } from './consultations-routing.module';
import { ConsultationsListComponent } from './components/consultations-list/consultations-list.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConsultationsRoutingModule,
    ConsultationsListComponent
  ]
})
export class ConsultationsModule { }
