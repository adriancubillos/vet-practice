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
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { map, startWith, switchMap } from 'rxjs/operators';

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
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  pets: Pet[] = [];
  veterinarians: User[] = [];
  isEditing = false;
  reasons = Object.values(AppointmentReason);

  isVetOrAdmin$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private petService: PetService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.appointmentForm = this.fb.group({
      petId: ['', Validators.required],
      veterinarianId: ['', Validators.required],
      reason: ['', Validators.required],
      dateTime: ['', Validators.required],
      time: ['', Validators.required],
      duration: [30, [Validators.required, Validators.min(15), Validators.max(180)]],
      notes: [''],
      status: ['scheduled']
    });
    this.isVetOrAdmin$ = this.authService.user$.pipe(
      map(user => user?.role === 'vet' || user?.role === 'admin')
    );
  }

  ngOnInit(): void {
    // Combine the role check with data loading using switchMap
    this.isVetOrAdmin$.pipe(
      switchMap(isVetOrAdmin =>
        forkJoin({
          pets: isVetOrAdmin ? this.petService.getAllPets() : this.petService.getPets(),
          veterinarians: this.userService.getUsers()
        })
      )
    ).subscribe({
      next: ({ pets, veterinarians }) => {
        this.pets = pets;
        this.veterinarians = veterinarians.filter(user => user.role === Role.VET);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Error loading data. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });

    // Check if we're editing an existing appointment
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.appointmentService.getAppointment(+id).subscribe({
        next: (appointment) => {
          const date = new Date(appointment.dateTime);
          this.appointmentForm.patchValue({
            petId: appointment.pet.id,
            veterinarianId: appointment.veterinarian.id,
            reason: appointment.reason,
            dateTime: date,
            time: this.formatTime(date),
            duration: appointment.duration,
            notes: appointment.notes,
            status: appointment.status
          });
        },
        error: (error) => {
          console.error('Error loading appointment:', error);
          this.snackBar.open('Error loading appointment', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const dateTime = this.combineDateAndTime(formValue.dateTime, formValue.time);

      const appointmentData: CreateAppointmentDto = {
        dateTime,
        duration: formValue.duration,
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
          this.snackBar.open('Appointment saved successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
          this.snackBar.open(error.error.message || 'Error saving appointment', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
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
