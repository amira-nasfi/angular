import { Routes } from '@angular/router';
import { TableauDeBordComponent } from './core/components/tableau-de-bord/tableau-de-bord.component';
import { PatientListComponent } from './features/patients/components/patient-list/patient-list.component';
import { PatientFormComponent } from './features/patients/components/patient-form/patient-form.component';
import { PatientDetailComponent } from './features/patients/components/patient-detail/patient-detail.component';
import { DossierPatientComponent } from './features/patients/components/dossier-patient/dossier-patient.component';
import { ConnexionComponent } from './core/components/connexion/connexion.component';
import { PageIntrouvableComponent } from './core/components/page-introuvable/page-introuvable.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { dejaCnxGuard } from './core/guards/deja-cnx.guard';
import { formulaireNonSauvegardeGuard } from './core/guards/formulaire-non-sauvegarde.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/tableau-de-bord', pathMatch: 'full' },
  { path: 'tableau-de-bord', component: TableauDeBordComponent },

  { path: 'patients', component: PatientListComponent },
  { path: 'patients/nouveau', component: PatientFormComponent, canDeactivate: [formulaireNonSauvegardeGuard] },
  { path: 'patients/:id', component: PatientDetailComponent },
  { path: 'patients/:id/modifier', component: PatientFormComponent, canDeactivate: [formulaireNonSauvegardeGuard] },
  { path: 'patients/:id/dossier', component: DossierPatientComponent },

  {
    path: 'consultations',
    loadChildren: () => import('./features/consultations/consultations.module').then(m => m.ConsultationsModule)
  },
  {
    path: 'ordonnances',
    loadChildren: () => import('./features/ordonnances/ordonnances.module').then(m => m.OrdonnancesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    data: { rolesRequis: ['admin'] }
  },

  { path: 'connexion', component: ConnexionComponent, canActivate: [dejaCnxGuard] },
  { path: '**', component: PageIntrouvableComponent }
];
