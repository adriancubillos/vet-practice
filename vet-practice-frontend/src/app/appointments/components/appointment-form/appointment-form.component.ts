import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { AppointmentService } from '../../services/appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Appointment } from '../../models/appointment.interface';
import { CreateAppointmentDto } from '../../models/create-appointment.dto';
import { AppointmentReason } from '../../models/appointment-reason.enum';
import { PetService } from '../../../pets/services/pet.service';
import { UserService } from '../../../users/services/user.service';
import { Pet } from '../../../pets/models/pet.interface';
import { User } from '../../../users/models/user.interface';
import { Role } from '../../../users/models/role.enum';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  template: `
    <div class="appointment-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Edit' : 'New' }} Appointment</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Pet</mat-label>
              <mat-select formControlName="petId" required>
                <mat-option *ngFor="let pet of pets" [value]="pet.id">
                  {{pet.name}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="appointmentForm.get('petId')?.errors?.['required']">
                Pet is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Veterinarian</mat-label>
              <mat-select formControlName="veterinarianId" required>
                <mat-option *ngFor="let vet of veterinarians" [value]="vet.id">
                  Dr. {{vet.firstName}} {{vet.lastName}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="appointmentForm.get('veterinarianId')?.errors?.['required']">
                Veterinarian is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason</mat-label>
              <mat-select formControlName="reason" required>
                <mat-option *ngFor="let reason of reasons" [value]="reason">
                  {{reason}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="appointmentForm.get('reason')?.errors?.['required']">
                Reason is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="appointmentDate" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="appointmentForm.get('appointmentDate')?.errors?.['required']">
                Date is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Time</mat-label>
              <input matInput type="time" formControlName="time" required>
              <mat-error *ngIf="appointmentForm.get('time')?.errors?.['required']">
                Time is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Duration (minutes)</mat-label>
              <input matInput type="number" formControlName="duration" required min="15" step="15">
              <mat-error *ngIf="appointmentForm.get('duration')?.errors?.['required']">
                Duration is required
              </mat-error>
              <mat-error *ngIf="appointmentForm.get('duration')?.errors?.['min']">
                Duration must be at least 15 minutes
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes"></textarea>
            </mat-form-field>

            <div class="button-row">
              <button mat-button type="button" routerLink="/appointments">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.valid">
                {{ isEditing ? 'Update' : 'Create' }} Appointment
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .appointment-form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    mat-card {
      margin-bottom: 20px;
    }

    mat-card-title {
      margin-bottom: 20px;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditing = false;
  pets: Pet[] = [];
  veterinarians: User[] = [];
  reasons = Object.values(AppointmentReason);

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private petService: PetService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      petId: ['', Validators.required],
      veterinarianId: ['', Validators.required],
      reason: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      time: ['', Validators.required],
      duration: [30, [Validators.required, Validators.min(15)]],
      notes: [''],
      status: ['scheduled']
    });
  }

  ngOnInit() {
    // Load pets and veterinarians
    forkJoin({
      pets: this.petService.getPets(),
      users: this.userService.getUsers()
    }).subscribe({
      next: ({ pets, users }) => {
        this.pets = pets;
        // Filter users to only get veterinarians
        this.veterinarians = users.filter(user => user.role === Role.VET);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        // TODO: Add proper error handling
      }
    });

    // Load appointment if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadAppointment(+id);
    }
  }

  loadAppointment(id: number) {
    this.appointmentService.getAppointment(id).subscribe(appointment => {
      const date = new Date(appointment.appointmentDate);
      this.appointmentForm.patchValue({
        petId: appointment.petId,
        veterinarianId: appointment.veterinarianId,
        reason: appointment.reason,
        appointmentDate: date,
        time: this.formatTime(date),
        duration: appointment.duration,
        notes: appointment.notes,
        status: appointment.status
      });
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const dateTime = this.combineDateAndTime(formValue.appointmentDate, formValue.time);

      const appointmentData: CreateAppointmentDto = {
        dateTime,
        petId: formValue.petId,
        veterinarianId: formValue.veterinarianId,
        reason: formValue.reason,
        notes: formValue.notes
      };

      const request = this.isEditing
        ? this.appointmentService.updateAppointment(
          +this.route.snapshot.paramMap.get('id')!,
          appointmentData
        )
        : this.appointmentService.createAppointment(appointmentData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
          // TODO: Add proper error handling
        }
      });
    }
  }

  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':');
    const combined = new Date(date);
    combined.setHours(+hours);
    combined.setMinutes(+minutes);
    return combined;
  }
}
