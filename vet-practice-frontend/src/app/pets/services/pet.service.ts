import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pet, PetRegistrationRequest, MedicalRecord } from '../models/pet.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly baseUrl = `${environment.apiUrl.replace('/auth', '')}/pets`;
  private readonly TOKEN_KEY = environment.tokenKey;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Pet CRUD operations
  registerPet(formData: FormData): Observable<Pet> {
    return this.http.post<Pet>(this.baseUrl, formData, { headers: this.getHeaders() });
  }

  getAllPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getAllPetsAdmin(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getMyPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}/my-pets`, { headers: this.getHeaders() });
  }

  // Deprecated - use getAllPets or getMyPets instead
  getPets(): Observable<Pet[]> {
    return this.getMyPets();
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updatePet(id: number, formData: FormData): Observable<Pet> {
    return this.http.put<Pet>(`${environment.apiUrl}/pets/${id}`, formData, { headers: this.getHeaders() });
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Medical History operations
  addMedicalRecord(petId: number, record: Omit<MedicalRecord, 'id' | 'petId'>): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(`${this.baseUrl}/${petId}/medical-records`, record, { headers: this.getHeaders() });
  }

  getMedicalRecords(petId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.baseUrl}/${petId}/medical-records`, { headers: this.getHeaders() });
  }

  updateMedicalRecord(petId: number, recordId: number, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.patch<MedicalRecord>(`${this.baseUrl}/${petId}/medical-records/${recordId}`, record, { headers: this.getHeaders() });
  }

  deleteMedicalRecord(petId: number, recordId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${petId}/medical-records/${recordId}`, { headers: this.getHeaders() });
  }
}
