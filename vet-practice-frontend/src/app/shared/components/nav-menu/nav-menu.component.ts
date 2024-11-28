import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  sidenavOpened = true;
  user$: Observable<any | null>;
  isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
    this.isAdmin$ = this.authService.user$.pipe(
      map((user: any | null) => user?.role === 'admin')
    );
  }

  logout() {
    this.authService.logout();
  }
}
