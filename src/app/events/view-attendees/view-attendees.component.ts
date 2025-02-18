import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AttendeesService, Attendee } from '../../../services/attendees.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-attendees',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Event Attendees</h2>
        <button mat-button class="add-btn" (click)="addAttendee()" style='color:white'>+ Add Attendee</button>
      </div>

      <div *ngIf="isLoading" class="loading">
        <p>Loading attendees...</p>
      </div>

      <div *ngIf="error" class="error-message">
        <p>{{ error }}</p>
        <button (click)="loadAttendees()" class="retry-btn">Retry</button>
      </div>

      <div *ngIf="!isLoading && !error" class="attendees-list">
        <div *ngIf="attendees.length === 0" class="no-attendees">
          <p>No attendees registered for this event yet.</p>
        </div>

        <table mat-table [dataSource]="attendees" class="attendees-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let attendee"> {{ attendee.name }} </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let attendee"> {{ attendee.email }} </td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef> Phone </th>
            <td mat-cell *matCellDef="let attendee"> {{ attendee.phone }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="close()" style='color:white;' class="close-btn">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 700px;
      padding: 20px;
      border-radius: 10px;
      background: #fff;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    h2 {
      color: #333;
      font-size: 1.5rem;
      margin: 0;
    }

    .add-btn {
      background:#007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 5px;
      cursor: pointer;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: #555;
    }

    .error-message {
      color: #d32f2f;
      background: #ffebee;
      padding: 15px;
      border-radius: 5px;
      text-align: center;
    }

    .retry-btn {
      margin-top: 10px;
      background: #1976d2;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 5px;
      cursor: pointer;
    }

    .attendees-list {
      margin-top: 10px;
      width: 100%;
    }

    .attendees-table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }

    th.mat-header-cell {
      background-color: #f5f5f5;
      color: #333;
      font-weight: bold;
    }

    td.mat-cell {
      padding: 10px;
      text-align: center;
      color: #555;
    }

    .dialog-actions {
      margin-top: 20px;
      text-align: center;
    }

    .close-btn {
      background: #555;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
    }

    .close-btn:hover {
      background: #333;

    }
  `]
})
export class ViewAttendeesComponent {
  attendees: Attendee[] = [];
  isLoading = true;
  error = '';
  displayedColumns: string[] = ['name', 'email', 'phone'];

  constructor(
    private dialogRef: MatDialogRef<ViewAttendeesComponent>,
    private attendeesService: AttendeesService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: { eventId: string }
  ) {
    this.loadAttendees();
  }

  loadAttendees() {
    this.isLoading = true;
    this.error = '';

    this.attendeesService.getEventAttendees(this.data.eventId).subscribe({
      next: (attendees) => {
        this.attendees = Array.isArray(attendees) ? attendees : [];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load attendees. Please try again.';
        this.isLoading = false;
        console.error('Error loading attendees:', error);
      }
    });
  }

  addAttendee() {
    this.close()
    this.router.navigate(['/attendee'])

    // Implement logic to open an attendee creation form or dialog
  }

  close() {
    this.dialogRef.close();
  }
}
