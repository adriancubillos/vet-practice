import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { AppointmentService } from './services/appointment.service';
import { Appointment } from './models/appointment.interface';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule
  ],
  template: `
    <div class="appointments-container">
      <div class="header-actions">
        <h1>Appointments</h1>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          New Appointment
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let appointment">
                {{ appointment.date | date:'MMM d, y h:mm a' }}
              </td>
            </ng-container>

            <!-- Pet Name Column -->
            <ng-container matColumnDef="petName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Pet Name</th>
              <td mat-cell *matCellDef="let appointment">{{ appointment.pet?.name }}</td>
            </ng-container>

            <!-- Owner Column -->
            <ng-container matColumnDef="owner">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Owner</th>
              <td mat-cell *matCellDef="let appointment">
                {{ appointment.user?.firstName }} {{ appointment.user?.lastName }}
              </td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
              <td mat-cell *matCellDef="let appointment">
                <mat-chip-set>
                  <mat-chip [ngClass]="getAppointmentTypeClass(appointment.type)" selected>
                    {{ appointment.type }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let appointment">
                <mat-chip-set>
                  <mat-chip [ngClass]="getStatusClass(appointment.status)" selected>
                    {{ appointment.status }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let appointment">
                <button mat-icon-button color="primary" (click)="viewAppointment(appointment)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="editAppointment(appointment)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteAppointment(appointment)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" 
                        aria-label="Select page of appointments">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-actions h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-column-type, .mat-column-status {
      width: 120px;
    }

    mat-chip {
      min-height: 24px;
      font-size: 12px;
    }

    .chip-primary {
      background-color: #3f51b5 !important;
      color: white !important;
    }

    .chip-accent {
      background-color: #ff4081 !important;
      color: white !important;
    }

    .chip-warn {
      background-color: #f44336 !important;
      color: white !important;
    }

    .chip-default {
      background-color: #757575 !important;
      color: white !important;
    }

    .mat-mdc-card {
      margin-bottom: 20px;
    }

    .mat-mdc-table {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'petName', 'owner', 'type', 'status', 'actions'];
  dataSource!: MatTableDataSource<Appointment>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.dataSource = new MatTableDataSource(appointments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getAppointmentTypeClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'checkup':
        return 'chip-primary';
      case 'vaccination':
        return 'chip-accent';
      case 'surgery':
        return 'chip-warn';
      default:
        return 'chip-default';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'chip-primary';
      case 'completed':
        return 'chip-accent';
      case 'in_progress':
        return 'chip-warn';
      case 'cancelled':
        return 'chip-default';
      case 'no_show':
        return 'chip-default';
      default:
        return 'chip-default';
    }
  }

  viewAppointment(appointment: Appointment) {
    // TODO: Implement view functionality
    console.log('View appointment:', appointment);
  }

  editAppointment(appointment: Appointment) {
    // TODO: Implement edit functionality
    console.log('Edit appointment:', appointment);
  }

  async deleteAppointment(appointment: Appointment) {
    if (!appointment.id) {
      console.error('Cannot delete appointment without an ID');
      return;
    }

    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await this.appointmentService.deleteAppointment(appointment.id).toPromise();
        this.loadAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  }
}
