import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.interface';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.error = 'Failed to load appointments. Please try again later.';
        this.loading = false;
      }
    });
  }

  createAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  viewAppointment(id: number): void {
    this.router.navigate(['/appointments', id]);
  }

  editAppointment(id: number): void {
    this.router.navigate(['/appointments', id, 'edit']);
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.snackBar.open('Appointment deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.snackBar.open('Failed to delete appointment', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'in-progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }
}
