import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MedicalHistory, CreateMedicalHistoryDto } from '../models/medical-history.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getMedicalHistory(petId: number): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/${petId}/medical-history`);
  }

  createMedicalHistory(petId: number, medicalHistory: CreateMedicalHistoryDto): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(`${this.apiUrl}/${petId}/medical-history`, medicalHistory);
  }

  updateMedicalHistory(petId: number, medicalHistory: CreateMedicalHistoryDto): Observable<MedicalHistory> {
    return this.http.patch<MedicalHistory>(`${this.apiUrl}/${petId}/medical-history`, medicalHistory);
  }
}
