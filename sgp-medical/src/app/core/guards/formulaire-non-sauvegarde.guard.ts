import { CanDeactivateFn } from '@angular/router';

// Simplistic mock for the guard, since PatientFormComponent isn't fully built yet
export interface CanComponentDeactivate {
  formulaire?: { dirty: boolean };
}

export const formulaireNonSauvegardeGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.formulaire?.dirty) {
    return confirm('Des modifications non sauvegardees seront perdues. Continuer quand meme ?');
  }
  return true;
};
