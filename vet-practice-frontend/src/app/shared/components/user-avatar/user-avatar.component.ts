import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class UserAvatarComponent implements OnChanges {
  @Input() imageUrl: string | null = null;
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  initials: string = '';
  hasImageError: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['firstName'] || changes['lastName']) && (this.firstName || this.lastName)) {
      this.initials = this.generateInitials();
    }
  }

  private generateInitials(): string {
    const firstInitial = this.firstName ? this.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = this.lastName ? this.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  onImageError(): void {
    this.hasImageError = true;
  }

  getBackgroundColor(): string {
    // Generate a consistent color based on initials
    const str = this.initials || 'XX';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 80%)`; // Light pastel color
  }
}
