import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavMenuComponent } from './shared/components/nav-menu/nav-menu.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavMenuComponent],
  template: `
    <ng-container *ngIf="(authService.isAuthenticated$ | async); else loginContent">
      <app-nav-menu>
        <router-outlet></router-outlet>
      </app-nav-menu>
    </ng-container>
    <ng-template #loginContent>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'vet-practice-frontend';

  constructor(public authService: AuthService) {}
}
