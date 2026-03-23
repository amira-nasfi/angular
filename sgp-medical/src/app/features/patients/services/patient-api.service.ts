import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Patient, ConstantesVitales } from '../../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly fhirBaseUrl = 'https://api.fhir.sante.gouv.fr/r4';

  constructor(private http: HttpClient) {}

  rechercherPatients(params: {
    nom?: string;
    prenom?: string;
    dateNaissance?: string;
    _count?: number;
  }): Observable<Patient[]> {
    let httpParams = new HttpParams();
    if (params.nom) httpParams = httpParams.set('family', params.nom);
    if (params.prenom) httpParams = httpParams.set('given', params.prenom);
    if (params.dateNaissance) httpParams = httpParams.set('birthdate', params.dateNaissance);
    httpParams = httpParams.set('_count', params._count ?? 20);

    return this.http.get<any>(`${this.fhirBaseUrl}/Patient`, {
      params: httpParams,
      headers: { Accept: 'application/fhir+json' }
    }).pipe(
      map(bundle => bundle.entry?.map((e: any) => this.fhirVersPatient(e.resource)) ?? []),
      retry(2),
      catchError(this.gererErreur)
    );
  }

  getDossierPatient(id: string): Observable<Patient> {
    return this.http.get<any>(`${this.fhirBaseUrl}/Patient/${id}`).pipe(
      map(fhir => this.fhirVersPatient(fhir)),
      catchError(this.gererErreur)
    );
  }

  getConstantesVitales(patientId: string): Observable<ConstantesVitales[]> {
    const params = new HttpParams()
      .set('patient', patientId)
      .set('category', 'vital-signs')
      .set('_sort', '-date')
      .set('_count', '10');
    return this.http.get<any>(`${this.fhirBaseUrl}/Observation`, { params }).pipe(
      map(b => b.entry?.map((e: any) => this.fhirVersConstantes(e.resource)) ?? [])
    );
  }

  creerPatient(patient: Patient): Observable<Patient> {
    return this.http.post<any>(
      `${this.fhirBaseUrl}/Patient`,
      this.patientVersFhir(patient),
      { headers: { 'Content-Type': 'application/fhir+json' } }
    ).pipe(map(fhir => this.fhirVersPatient(fhir)));
  }

  private gererErreur(error: any): Observable<never> {
    let message = 'Erreur serveur inattendue';
    if (error.status === 0) message = 'Connexion impossible au serveur FHIR';
    if (error.status === 401) message = 'Session expiree - reconnectez-vous';
    if (error.status === 403) message = 'Acces refuse - droits insuffisants';
    if (error.status === 404) message = 'Ressource introuvable';
    console.error('[PatientApiService]', error);
    return throwError(() => new Error(message));
  }

  private fhirVersPatient(fhir: any): Patient {
    return {
      id: fhir.id,
      ins: fhir.identifier?.find((i: any) => i.system === 'urn:oid:1.2.250.1.213.1.4.8')?.value ?? '',
      nom: fhir.name?.[0]?.family ?? '',
      prenom: fhir.name?.[0]?.given?.[0] ?? '',
      dateNaissance: new Date(fhir.birthDate),
      sexe: fhir.gender === 'male' ? 'M' : 'F',
      statut: 'actif',
      adresse: { ligne1: '', codePostal: '', ville: '', pays: 'France' },
      telephone: '',
      medecinTraitantId: '',
      allergies: [],
      antecedents: [],
      traitementEnCours: [],
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    } as Patient;
  }

  private fhirVersConstantes(fhir: any): ConstantesVitales {
    return { dateMesure: new Date() } as ConstantesVitales; // Mocked
  }

  private patientVersFhir(patient: Patient): any {
    return { resourceType: 'Patient' }; // Mocked
  }
}
