import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  urgence(message: string): void {
    console.error(`🚨 ALERTE URGENCE: ${message}`);
    // Affiche une notification ou une modale
  }

  info(message: string): void {
    console.log(`ℹ️ INFO: ${message}`);
  }
}
