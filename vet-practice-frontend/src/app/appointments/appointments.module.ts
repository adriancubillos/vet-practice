import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppointmentListComponent } from '../appointments/components/appointment-list/appointment-list.component';
// import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
// import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { appointmentsRoutes } from './appointments.routes';

@NgModule({
  declarations: [
    AppointmentListComponent,
    // AppointmentDetailsComponent,
    // AppointmentFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appointmentsRoutes),
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class AppointmentsModule { }
