import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdonnancesListComponent } from './components/ordonnances-list/ordonnances-list.component';

const routes: Routes = [
  { path: '', component: OrdonnancesListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdonnancesRoutingModule { }
