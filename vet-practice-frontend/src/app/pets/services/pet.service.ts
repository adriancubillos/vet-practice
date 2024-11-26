import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pet, PetRegistrationRequest, MedicalRecord } from '../models/pet.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly baseUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  // Pet CRUD operations
  registerPet(formData: FormData): Observable<Pet> {
    return this.http.post<Pet>(this.baseUrl, formData);
  }

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.baseUrl);
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/${id}`);
  }

  updatePet(id: number, pet: Partial<Pet>): Observable<Pet> {
    return this.http.patch<Pet>(`${this.baseUrl}/${id}`, pet);
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Medical History operations
  addMedicalRecord(petId: number, record: Omit<MedicalRecord, 'id' | 'petId'>): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(`${this.baseUrl}/${petId}/medical-records`, record);
  }

  getMedicalRecords(petId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.baseUrl}/${petId}/medical-records`);
  }

  updateMedicalRecord(petId: number, recordId: number, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.patch<MedicalRecord>(`${this.baseUrl}/${petId}/medical-records/${recordId}`, record);
  }

  deleteMedicalRecord(petId: number, recordId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${petId}/medical-records/${recordId}`);
  }
}
