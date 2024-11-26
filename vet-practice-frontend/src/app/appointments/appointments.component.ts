import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
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
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          New Appointment
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="appointments" matSort>
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let appointment">
                {{ appointment.date | date:'medium' }}
              </td>
            </ng-container>

            <!-- Pet Name Column -->
            <ng-container matColumnDef="petName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Pet Name</th>
              <td mat-cell *matCellDef="let appointment">{{ appointment.petName }}</td>
            </ng-container>

            <!-- Owner Column -->
            <ng-container matColumnDef="owner">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Owner</th>
              <td mat-cell *matCellDef="let appointment">{{ appointment.owner }}</td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
              <td mat-cell *matCellDef="let appointment">
                <mat-chip-set>
                  <mat-chip [color]="getAppointmentTypeColor(appointment.type)" selected>
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
                  <mat-chip [color]="getStatusColor(appointment.status)" selected>
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
  `]
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'petName', 'owner', 'type', 'status', 'actions'];
  appointments = [
    {
      date: new Date('2024-01-20T10:00:00'),
      petName: 'Max',
      owner: 'John Smith',
      type: 'Checkup',
      status: 'Scheduled'
    },
    {
      date: new Date('2024-01-20T11:00:00'),
      petName: 'Bella',
      owner: 'Sarah Johnson',
      type: 'Vaccination',
      status: 'Completed'
    },
    {
      date: new Date('2024-01-20T14:00:00'),
      petName: 'Charlie',
      owner: 'Mike Brown',
      type: 'Surgery',
      status: 'In Progress'
    }
  ];

  ngOnInit() {
    // TODO: Load appointments from service
  }

  getAppointmentTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'checkup':
        return 'primary';
      case 'vaccination':
        return 'accent';
      case 'surgery':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'accent';
      case 'in progress':
        return 'warn';
      default:
        return 'primary';
    }
  }

  viewAppointment(appointment: any) {
    console.log('View appointment:', appointment);
  }

  editAppointment(appointment: any) {
    console.log('Edit appointment:', appointment);
  }

  deleteAppointment(appointment: any) {
    console.log('Delete appointment:', appointment);
  }
}
