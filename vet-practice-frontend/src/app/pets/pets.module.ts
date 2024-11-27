import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PetListComponent } from './components/pet-list/pet-list.component';
import { PetRegistrationComponent } from './components/pet-registration/pet-registration.component';
import { PetDetailsComponent } from './components/pet-details/pet-details.component';
import { PetService } from './services/pet.service';

const routes: Routes = [
  { path: '', component: PetListComponent },
  { path: 'register', component: PetRegistrationComponent },
  { path: ':id', component: PetDetailsComponent }
];

@NgModule({
  declarations: [
    PetListComponent,
    PetRegistrationComponent,
    PetDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [PetService]
})
export class PetsModule { }
