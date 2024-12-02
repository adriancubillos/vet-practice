import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PetsRoutingModule } from './pets-routing.module';
import { PetService } from './services/pet.service';

// Components
import { PetListComponent } from './components/pet-list/pet-list.component';
import { PetDetailsComponent } from './components/pet-details/pet-details.component';
import { PetRegistrationComponent } from './components/pet-registration/pet-registration.component';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    PetDetailsComponent,
    PetRegistrationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PetsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    PetListComponent // Import standalone component
  ],
  providers: [PetService]
})
export class PetsModule { }
