import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-card',
  templateUrl: './patient-card.component.html',
  styleUrls: ['./patient-card.component.scss']
})
export class PatientCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) patient!: Patient;
  @Input() showSensitiveData = false;
  
  @Output() patientSelected = new EventEmitter<Patient>();
  @Output() urgenceSignalee = new EventEmitter<{ patient: Patient; motif: string }>();

  private destroy$ = new Subject<void>();

  get age(): number {
    if (!this.patient || !this.patient.dateNaissance) return 0;
    const now = new Date();
    const birth = new Date(this.patient.dateNaissance);
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  get initialles(): string {
    if (!this.patient) return '';
    return `${this.patient.prenom[0] ?? ''}${this.patient.nom[0] ?? ''}`.toUpperCase();
  }

  ngOnInit(): void {
    console.log('Fiche patient initialisee :', this.patient.ins);
  }

  selectionnerPatient(): void {
    this.patientSelected.emit(this.patient);
  }

  signalerUrgence(): void {
    // In a real app this might open a modal
    const motif = prompt('Motif de l\'urgence ?') || 'Urgence non specifiee';
    this.urgenceSignalee.emit({ patient: this.patient, motif });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
