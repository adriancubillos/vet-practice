import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs/operators';
import { User } from '../../auth/models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.user$.pipe(
      map((user: User | null) => {
        if (user?.role === 'admin') {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
