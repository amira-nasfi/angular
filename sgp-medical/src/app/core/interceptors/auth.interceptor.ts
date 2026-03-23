import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const audit = inject(AuditService);

  const token = auth.getToken();

  const reqAvecToken = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Utilisateur-Id': auth.getUtilisateurConnecte()?.id ?? '',
        }
      })
    : req;

  return next(reqAvecToken).pipe(
    catchError(erreur => {
      if (erreur.status === 401) {
        auth.deconnecter();
        router.navigate(['/connexion']);
      }
      if (erreur.status === 403) {
        audit.log('ACCES_REFUSE', undefined, req.url);
        router.navigate(['/acces-refuse']);
      }
      return throwError(() => erreur);
    })
  );
};
