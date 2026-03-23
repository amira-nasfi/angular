import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: 'medecin' | 'infirmier' | 'admin' = 'medecin'; // Mock role
  
  peutVoirDonneesSensibles(): boolean {
    return this.role === 'medecin' || this.role === 'admin';
  }

  getRole(): string {
    return this.role;
  }

  getUtilisateurConnecte(): { id: string, nom: string } | null {
    return { id: 'u123', nom: 'Dr. Dupont' };
  }

  getToken(): string | null {
    return 'mock-jwt-token';
  }

  deconnecter(): void {
    console.log('Deconnexion...');
  }
}
