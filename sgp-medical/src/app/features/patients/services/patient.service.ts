import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Patient, NiveauUrgence } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  // Etat interne
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  private patientCourantSubject = new BehaviorSubject<Patient | null>(null);
  private chargementSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    // Initialiser avec des donnees de demonstration
    this.patientsSubject.next(this.genererDonneesDemo());
  }

  private genererDonneesDemo(): Patient[] {
    return [
      {
        id: '1',
        ins: '1850612075047',
        nom: 'Dupont',
        prenom: 'Jean',
        dateNaissance: new Date('1985-06-12'),
        sexe: 'M',
        groupeSanguin: 'A+',
        adresse: { ligne1: '15 Rue de la Paix', codePostal: '75001', ville: 'Paris', pays: 'France' },
        telephone: '0612345678',
        email: 'jean.dupont@email.fr',
        medecinTraitantId: 'DR001',
        statut: 'actif',
        niveauUrgence: 'vert',
        allergies: [{ substance: 'Penicilline', reaction: 'Urticaire', severite: 'moderee', dateDeclaration: new Date() }],
        antecedents: ['Hypertension arterielle', 'Diabete type 2'],
        traitementEnCours: ['Metformine 500mg', 'Lisinopril 10mg'],
        dateCreation: new Date('2023-01-15'),
        dateDerniereModification: new Date()
      },
      {
        id: '2',
        ins: '2900315123456',
        nom: 'Martin',
        prenom: 'Marie',
        dateNaissance: new Date('1990-03-15'),
        sexe: 'F',
        groupeSanguin: 'O-',
        adresse: { ligne1: '8 Avenue des Champs', codePostal: '69001', ville: 'Lyon', pays: 'France' },
        telephone: '0698765432',
        email: 'marie.martin@email.fr',
        medecinTraitantId: 'DR002',
        statut: 'actif',
        niveauUrgence: 'rouge',
        allergies: [],
        antecedents: ['Asthme'],
        traitementEnCours: ['Ventoline'],
        dernieresConstantes: {
          tensionSystolique: 185,
          tensionDiastolique: 110,
          frequenceCardiaque: 95,
          temperature: 38.5,
          saturationO2: 88,
          dateMesure: new Date()
        },
        dateCreation: new Date('2023-06-20'),
        dateDerniereModification: new Date()
      },
      {
        id: '3',
        ins: '1750825987654',
        nom: 'Bernard',
        prenom: 'Pierre',
        dateNaissance: new Date('1975-08-25'),
        sexe: 'M',
        groupeSanguin: 'B+',
        adresse: { ligne1: '22 Boulevard Victor Hugo', codePostal: '13001', ville: 'Marseille', pays: 'France' },
        telephone: '0654321098',
        medecinTraitantId: 'DR001',
        statut: 'actif',
        niveauUrgence: 'orange',
        allergies: [
          { substance: 'Aspirine', reaction: 'Oedeme', severite: 'severe', dateDeclaration: new Date() },
          { substance: 'Latex', reaction: 'Eruption cutanee', severite: 'legere', dateDeclaration: new Date() }
        ],
        antecedents: ['Infarctus 2020', 'Cholesterol'],
        traitementEnCours: ['Kardegic', 'Atorvastatine'],
        dateCreation: new Date('2022-11-10'),
        dateDerniereModification: new Date()
      },
      {
        id: '4',
        ins: '2680410456789',
        nom: 'Leroy',
        prenom: 'Sophie',
        dateNaissance: new Date('1968-04-10'),
        sexe: 'F',
        groupeSanguin: 'AB+',
        adresse: { ligne1: '5 Place de la Republique', codePostal: '31000', ville: 'Toulouse', pays: 'France' },
        telephone: '0687654321',
        email: 'sophie.leroy@email.fr',
        medecinTraitantId: 'DR003',
        statut: 'actif',
        niveauUrgence: 'jaune',
        allergies: [],
        antecedents: ['Thyroidite'],
        traitementEnCours: ['Levothyrox'],
        dateCreation: new Date('2024-02-01'),
        dateDerniereModification: new Date()
      },
      {
        id: '5',
        ins: '1550920321654',
        nom: 'Moreau',
        prenom: 'Jacques',
        dateNaissance: new Date('1955-09-20'),
        sexe: 'M',
        adresse: { ligne1: '12 Rue des Lilas', codePostal: '44000', ville: 'Nantes', pays: 'France' },
        telephone: '0632109876',
        medecinTraitantId: 'DR002',
        statut: 'actif',
        niveauUrgence: 'vert',
        allergies: [],
        antecedents: ['Arthrose', 'Cataracte operee'],
        traitementEnCours: ['Doliprane PRN'],
        dateCreation: new Date('2021-05-15'),
        dateDerniereModification: new Date()
      }
    ];
  }

  // Observables publics
  readonly patients$ = this.patientsSubject.asObservable();
  readonly patientCourant$ = this.patientCourantSubject.asObservable();
  readonly enChargement$ = this.chargementSubject.asObservable();

  // Flux derives
  readonly patientsUrgents$ = this.patients$.pipe(
    map(pts => pts.filter(p => p.niveauUrgence === 'rouge' || p.niveauUrgence === 'orange')),
    distinctUntilChanged()
  );

  readonly statistiques$ = this.patients$.pipe(
    map(pts => ({
      total: pts.length,
      actifs: pts.filter(p => p.statut === 'actif').length,
      urgencesRouge: pts.filter(p => p.niveauUrgence === 'rouge').length,
      allergies: pts.filter(p => p.allergies.length > 0).length,
    }))
  );

  getPatients(): Patient[] {
    return [...this.patientsSubject.getValue()];
  }

  getPatientById(id: string): Patient | undefined {
    return this.patientsSubject.getValue().find(p => p.id === id);
  }

  definirPatientCourant(patient: Patient | null): void {
    this.patientCourantSubject.next(patient);
  }

  ajouterPatient(patient: Omit<Patient, 'id' | 'dateCreation' | 'dateDerniereModification'>): void {
    const nouveau: Patient = {
      ...patient,
      id: crypto.randomUUID(),
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    } as Patient;
    const current = this.patientsSubject.getValue();
    this.patientsSubject.next([...current, nouveau]);
  }

  mettreAJourPatient(updated: Patient): void {
    const patients = this.patientsSubject.getValue().map(
      p => p.id === updated.id ? { ...updated, dateDerniereModification: new Date() } : p
    );
    this.patientsSubject.next(patients);
    if (this.patientCourantSubject.getValue()?.id === updated.id) {
      this.patientCourantSubject.next(updated);
    }
  }

  modifierNiveauUrgence(id: string, niveau: NiveauUrgence): void {
    const patient = this.getPatientById(id);
    if (patient) this.mettreAJourPatient({ ...patient, niveauUrgence: niveau });
  }
}
