import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export type AuditAction = 
  | 'CONSULTATION_DOSSIER'
  | 'MODIFICATION_PATIENT'
  | 'CREATION_ORDONNANCE'
  | 'VIEW_SENSITIVE'
  | 'EXPORT_DONNEES'
  | 'SUPPRESSION_DONNEES'
  | 'ACCES_REFUSE'
  | 'URGENCE';

export interface AuditLog {
  timestamp: string;
  utilisateurId: string;
  utilisateurRole: string;
  action: AuditAction;
  patientId?: string;
  details?: string;
  adresseIP: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly auditApiUrl = '/api/audit';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  log(action: AuditAction, patientId?: string, details?: string): void {
    const entree: AuditLog = {
      timestamp: new Date().toISOString(),
      utilisateurId: this.authService.getUtilisateurConnecte()?.id ?? 'inconnu',
      utilisateurRole: this.authService.getRole(),
      action,
      patientId,
      details,
      adresseIP: 'client-side' // Real IP logged on server
    };
    
    // In a real application, would use this.http.post. Mocking for this workshop to prevent console errors if API doesn't exist.
    console.log('--- AUDIT LOG ---', entree);
  }
}
