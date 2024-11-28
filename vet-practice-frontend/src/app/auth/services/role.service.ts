import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RoleInfo {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<RoleInfo[]> {
    return this.http.get<RoleInfo[]>(`${this.apiUrl}/auth/roles`);
  }
}
