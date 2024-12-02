import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetListComponent } from './components/pet-list/pet-list.component';
import { PetDetailsComponent } from './components/pet-details/pet-details.component';
import { PetRegistrationComponent } from './components/pet-registration/pet-registration.component';

const routes: Routes = [
  { path: '', component: PetListComponent },
  { path: 'register', component: PetRegistrationComponent },
  { path: ':id', component: PetDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetsRoutingModule { }
