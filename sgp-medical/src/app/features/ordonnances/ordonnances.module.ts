import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdonnancesRoutingModule } from './ordonnances-routing.module';
import { OrdonnancesListComponent } from './components/ordonnances-list/ordonnances-list.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrdonnancesRoutingModule,
    OrdonnancesListComponent
  ]
})
export class OrdonnancesModule { }
