import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const audit = inject(AuditService);

  const rolesRequis: string[] = route.data?.['rolesRequis'] ?? [];
  const roleUtilisateur = auth.getRole();

  if (rolesRequis.length === 0 || rolesRequis.includes(roleUtilisateur)) {
    return true;
  }

  audit.log('ACCES_REFUSE', undefined, `Route: ${state.url}, Role: ${roleUtilisateur}, Requis: ${rolesRequis.join(',')}`);
  return router.createUrlTree(['/acces-refuse']);
};
