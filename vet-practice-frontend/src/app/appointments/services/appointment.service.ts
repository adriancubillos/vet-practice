import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../models/appointment.interface';
import { CreateAppointmentDto } from '../models/create-appointment.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: CreateAppointmentDto): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: CreateAppointmentDto): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAppointmentsByPet(petId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/pet/${petId}`);
  }

  getAppointmentsByVeterinarian(veterinarianId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/veterinarian/${veterinarianId}`);
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/upcoming`);
  }

  completeAppointment(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/complete`, {});
  }

  markInProgress(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/in-progress`, {});
  }

  markNoShow(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/no-show`, {});
  }

  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  checkVeterinarianAvailability(veterinarianId: number, date: Date): Observable<any> {
    return this.http.get(`${this.apiUrl}/veterinarian/${veterinarianId}/availability`, {
      params: { date: date.toISOString() }
    });
  }
}
