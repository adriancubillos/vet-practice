import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map, finalize } from 'rxjs/operators';
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
  private readonly authUrl = environment.authUrl;
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
    // Check for existing token on service initialization
    const token = this.getToken();
    if (token) {
      this.loadUserProfile();
    } else {
      this.updateState(initialState);
    }
  }

  // Auth Methods
  register(credentials: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${this.authUrl}/register`, credentials).pipe(
      tap(response => {
        console.log('Register response:', response); // Debug log
        if (response.accessToken) {
          this.setToken(response.accessToken);
          this.updateState({
            ...initialState,
            isAuthenticated: true,
            user: response.user
          });
          this.showSuccessMessage('Registration successful!');
          this.router.navigate([environment.routes.dashboard]).then(
            () => console.log('Navigation successful'),
            error => console.error('Navigation failed:', error)
          );
        }
      }),
      catchError(error => {
        console.error('Register error:', error); // Debug log
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.showErrorMessage(errorMessage);
        this.updateState({ ...initialState, error: errorMessage });
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  login(credentials: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Login response:', response); // Debug log
        if (response.accessToken) {
          this.setToken(response.accessToken);
          this.updateState({
            ...initialState,
            isAuthenticated: true,
            user: response.user
          });
          this.showSuccessMessage('Login successful!');
          this.router.navigate([environment.routes.dashboard]).then(
            () => console.log('Navigation successful'),
            error => console.error('Navigation failed:', error)
          );
        }
      }),
      catchError(error => {
        console.error('Login error:', error); // Debug log
        const errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.showErrorMessage(errorMessage);
        this.updateState({ ...initialState, error: errorMessage });
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  logout(): void {
    this.removeToken();
    this.updateState(initialState);
    this.router.navigate([environment.routes.auth.login]);
    this.showSuccessMessage('Logged out successfully!');
  }

  // Load user profile
  private loadUserProfile(): void {
    this.http.get<any>(`${this.authUrl}/profile`).pipe(
      tap(user => {
        this.updateState({
          ...initialState,
          isAuthenticated: true,
          user: user
        });
      }),
      catchError(error => {
        console.error('Error loading user profile:', error);
        this.removeToken();
        this.updateState(initialState);
        return throwError(() => error);
      })
    ).subscribe();
  }

  // Token Methods
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // State Management
  private updateState(state: Partial<AuthState>): void {
    const currentState = this.state.value;
    const newState = { ...currentState, ...state };
    console.log('State updated:', newState); // Debug log
    this.state.next(newState);
  }

  private setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  // Notification Methods
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: environment.snackbarDuration,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: environment.snackbarDuration,
      panelClass: ['error-snackbar']
    });
  }
}
