import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavMenuComponent } from './shared/components/nav-menu/nav-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavMenuComponent],
  template: `
    <app-nav-menu>
      <router-outlet></router-outlet>
    </app-nav-menu>
  `
})
export class AppComponent {}
