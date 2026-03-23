import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CanComponentDeactivate } from '../../../../core/guards/formulaire-non-sauvegarde.guard';
import { Allergie } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit, CanComponentDeactivate {
  formulaire!: FormGroup;
  modeEdition = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const patientExistant = id ? this.patientService.getPatientById(id) : null;
    this.modeEdition = !!patientExistant;

    this.formulaire = this.fb.group({
      // Identite
      id: [''],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: [null, [Validators.required, this.validateurDatePassee]],
      sexe: ['', Validators.required],
      ins: ['', [Validators.required, Validators.pattern(/^[12][0-9]{12}$/)]],

      // Coordonnees
      telephone: ['', [Validators.required, Validators.pattern(/^0[1-9](\s?\d{2}){4}$/)]],
      email: ['', [Validators.email]],

      // Adresse
      adresse: this.fb.group({
        ligne1: ['', Validators.required],
        ligne2: [''],
        codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        ville: ['', Validators.required],
        pays: ['France', Validators.required],
      }),

      // Medical
      groupeSanguin: [''],
      medecinTraitantId: ['', Validators.required],
      statut: ['actif', Validators.required],
      niveauUrgence: ['vert'],
      antecedents: this.fb.array([]),
      allergies: this.fb.array([]),
    });

    if (patientExistant) {
      this.formulaire.patchValue(patientExistant);
      patientExistant.antecedents?.forEach((a: string) => this.ajouterAntecedent(a));
      patientExistant.allergies?.forEach((a: Allergie) => this.pushAllergie(a));
    }
  }

  get antecedents(): FormArray { return this.formulaire.get('antecedents') as FormArray; }
  get allergies(): FormArray { return this.formulaire.get('allergies') as FormArray; }

  ajouterAntecedent(valeur = ''): void {
    this.antecedents.push(this.fb.control(valeur, Validators.required));
  }

  ajouterAllergie(): void {
    this.pushAllergie({
      substance: '',
      reaction: '',
      severite: 'moderee',
      dateDeclaration: new Date().toISOString() as any
    });
  }

  private pushAllergie(data: any): void {
    this.allergies.push(this.fb.group({
      substance: [data.substance, Validators.required],
      reaction: [data.reaction, Validators.required],
      severite: [data.severite, Validators.required],
      dateDeclaration: [data.dateDeclaration, Validators.required],
    }));
  }

  validateurDatePassee(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return new Date(ctrl.value) < new Date() ? null : { dateAvenir: true };
  }

  onSoumettre(): void {
    if (this.formulaire.valid) {
      if (this.modeEdition) {
        this.patientService.mettreAJourPatient(this.formulaire.value);
      } else {
        this.patientService.ajouterPatient(this.formulaire.value);
      }
      this.formulaire.markAsPristine(); // clear dirty flag to pass guard
      this.router.navigate(['/patients']);
    } else {
      this.formulaire.markAllAsTouched();
    }
  }
}
