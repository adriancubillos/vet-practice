import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vaccination, CreateVaccinationDto } from '../models/medical-history.interface';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {
  private apiUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getVaccinations(petId: number): Observable<Vaccination[]> {
    return this.http.get<Vaccination[]>(`${this.apiUrl}/${petId}/vaccinations`);
  }

  addVaccination(petId: number, vaccination: CreateVaccinationDto): Observable<Vaccination> {
    return this.http.post<Vaccination>(`${this.apiUrl}/${petId}/vaccinations`, vaccination);
  }
}
