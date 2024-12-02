import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class SharedModule { }
