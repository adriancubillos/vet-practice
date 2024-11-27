import { Routes } from '@angular/router';
// import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentListComponent } from '../appointments/components/appointment-list/appointment-list.component';
// import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
// import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    component: AppointmentListComponent
  },
  // {
  //   path: 'new',
  //   component: AppointmentFormComponent
  // },
  // {
  //   path: ':id',
  //   component: AppointmentDetailsComponent
  // },
  // {
  //   path: ':id/edit',
  //   component: AppointmentFormComponent
  // }
];
