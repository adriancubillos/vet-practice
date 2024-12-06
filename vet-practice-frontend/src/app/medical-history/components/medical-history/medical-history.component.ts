import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { VaccinationService } from '../../services/vaccination.service';
import { MedicalHistory, Vaccination } from '../../models/medical-history.interface';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit {
  petId!: number;
  medicalHistory?: MedicalHistory;
  vaccinations: Vaccination[] = [];
  medicalHistoryForm: FormGroup;
  vaccinationForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private vaccinationService: VaccinationService
  ) {
    this.medicalHistoryForm = this.fb.group({
      conditions: [''],
      allergies: [''],
      surgeries: [''],
      medications: [''],
      notes: ['']
    });

    this.vaccinationForm = this.fb.group({
      name: [''],
      dateAdministered: [''],
      nextDueDate: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.petId = +params['id'];
        return this.medicalHistoryService.getMedicalHistory(this.petId);
      })
    ).subscribe(
      history => {
        this.medicalHistory = history;
        this.loadFormData();
      }
    );

    this.loadVaccinations();
  }

  loadFormData(): void {
    if (this.medicalHistory) {
      this.medicalHistoryForm.patchValue({
        conditions: this.medicalHistory.conditions.join(', '),
        allergies: this.medicalHistory.allergies.join(', '),
        surgeries: this.medicalHistory.surgeries.join(', '),
        medications: this.medicalHistory.medications.join(', '),
        notes: this.medicalHistory.notes
      });
    }
  }

  loadVaccinations(): void {
    this.vaccinationService.getVaccinations(this.petId)
      .subscribe(vaccinations => this.vaccinations = vaccinations);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadFormData();
    }
  }

  saveMedicalHistory(): void {
    const formValue = this.medicalHistoryForm.value;
    const data = {
      conditions: formValue.conditions.split(',').map((s: string) => s.trim()),
      allergies: formValue.allergies.split(',').map((s: string) => s.trim()),
      surgeries: formValue.surgeries.split(',').map((s: string) => s.trim()),
      medications: formValue.medications.split(',').map((s: string) => s.trim()),
      notes: formValue.notes
    };

    if (this.medicalHistory) {
      this.medicalHistoryService.updateMedicalHistory(this.petId, data)
        .subscribe(updatedHistory => {
          this.medicalHistory = updatedHistory;
          this.isEditing = false;
        });
    } else {
      this.medicalHistoryService.createMedicalHistory(this.petId, data)
        .subscribe(newHistory => {
          this.medicalHistory = newHistory;
          this.isEditing = false;
        });
    }
  }

  addVaccination(): void {
    if (this.vaccinationForm.valid) {
      this.vaccinationService.addVaccination(this.petId, this.vaccinationForm.value)
        .subscribe(newVaccination => {
          this.vaccinations.unshift(newVaccination);
          this.vaccinationForm.reset();
        });
    }
  }
}
