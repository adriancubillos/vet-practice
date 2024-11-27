import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      <mat-dialog-content class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button class="cancel-button" [mat-dialog-close]="false">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button color="warn" class="confirm-button" [mat-dialog-close]="true">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .dialog-container {
      max-width: 100%;
      width: 360px;
    }
    .dialog-title {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 1.4;
      padding: 16px 24px 0;
    }
    .dialog-content {
      margin: 0;
      padding: 16px 24px;
    }
    .dialog-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: #666;
    }
    .dialog-actions {
      padding: 8px 16px;
      margin: 0;
      border-top: 1px solid #e0e0e0;
      gap: 8px;
    }
    .cancel-button {
      color: #666;
    }
    .confirm-button {
      font-weight: 500;
    }
    button {
      min-width: 80px;
      font-size: 13px;
      line-height: 32px;
      padding: 0 12px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
