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
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['dateTime', 'petName', 'ownerName', 'veterinarian', 'status', 'actions'];
  dataSource!: MatTableDataSource<Appointment>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private appointmentService: AppointmentService) { }

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

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'accent';
      case 'in_progress':
        return 'warn';
      case 'cancelled':
        return 'default';
      case 'no_show':
        return 'default';
      default:
        return 'default';
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
