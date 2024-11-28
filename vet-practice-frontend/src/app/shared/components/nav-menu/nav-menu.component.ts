import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isHandset$: Observable<boolean>;
  user$: Observable<any | null>;
  isAdmin$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.user$ = this.authService.user$;
    this.isAdmin$ = this.authService.user$.pipe(
      map((user: any | null) => user?.role === 'admin')
    );
    this.isHandset$ = this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.TabletPortrait
    ]).pipe(
      map(result => result.matches)
    );
  }

  ngOnInit() {
    this.isHandset$.subscribe(isHandset => {
      if (this.sidenav) {
        this.sidenav.mode = isHandset ? 'over' : 'side';
        this.sidenav.opened = !isHandset;
      }
    });
  }

  toggleSidenav() {
    this.sidenav?.toggle();
  }

  logout() {
    this.authService.logout();
  }

  onNavItemClick() {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.sidenav?.close();
      }
    }).unsubscribe();
  }
}
