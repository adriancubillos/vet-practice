import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { MedicalHistoryService } from './services/medical-history.service';
import { VaccinationService } from './services/vaccination.service';

@NgModule({
  declarations: [
    MedicalHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':id', component: MedicalHistoryComponent }
    ]),
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [
    MedicalHistoryService,
    VaccinationService
  ]
})
export class MedicalHistoryModule { }
