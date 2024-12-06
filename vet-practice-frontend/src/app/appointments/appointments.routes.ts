import { Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    component: AppointmentsComponent
  },
  {
    path: 'new',
    component: AppointmentFormComponent
  },
  {
    path: ':id/edit',
    component: AppointmentFormComponent
  }
  // TODO: Add routes for details component when implemented
];
