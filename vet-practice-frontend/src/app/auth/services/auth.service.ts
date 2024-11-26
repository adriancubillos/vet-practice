import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly baseUrl = environment.apiUrl;
  private state = new BehaviorSubject<AuthState>(initialState);

  // Public observables
  readonly isAuthenticated$ = this.state.pipe(map(state => state.isAuthenticated));
  readonly loading$ = this.state.pipe(map(state => state.loading));
  readonly error$ = this.state.pipe(map(state => state.error));
  readonly user$ = this.state.pipe(map(state => state.user));
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Clear any existing token on service initialization
    this.removeToken();
    this.updateState(initialState);
  }

  // Auth Methods
  register(credentials: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${this.baseUrl}/register`, credentials).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        this.updateState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null
        });
        this.showSuccess('Registration successful!');
        this.router.navigate([environment.routes.dashboard]);
      }),
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        this.updateState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null
        });
        this.showSuccess('Login successful!');
        this.router.navigate([environment.routes.dashboard]);
      }),
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.updateState(initialState);
    this.showSuccess('Logged out successfully');
    this.router.navigate([environment.routes.auth.login]);
  }

  // Token Management
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Private Helper Methods
  private updateState(newState: Partial<AuthState>): void {
    this.state.next({
      ...this.state.value,
      ...newState
    });
  }

  private setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  private handleError(error: any): void {
    this.updateState({
      loading: false,
      error: error.error?.message || 'An error occurred'
    });
    this.showError(error.error?.message || 'An error occurred');
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: environment.snackbarDuration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: environment.snackbarDuration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
