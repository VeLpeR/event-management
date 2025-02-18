import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AttendeesService, Attendee } from '../../../services/attendees.service';

@Component({
  selector: 'app-view-attendees',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="attendees-dialog">
      <h2>Event Attendees</h2>
      
      <div *ngIf="isLoading" class="loading">
        Loading attendees...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="!isLoading && !error" class="attendees-list">
        <div *ngIf="attendees.length === 0" class="no-attendees">
          No attendees registered for this event yet.
        </div>

        <div *ngFor="let attendee of attendees" class="attendee-item">
          <div class="attendee-info">
            <h3>{{ attendee.name }}</h3>
            <p>{{ attendee.email }}</p>
            <p>{{ attendee.phone }}</p>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <button class="btn-secondary" (click)="close()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .attendees-dialog {
      padding: 20px;
      max-width: 500px;
    }

    h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .attendee-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      
      h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }

      p {
        margin: 5px 0;
        color: #666;
      }
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .error-message {
      color: #dc3545;
      padding: 10px;
      background-color: #fff3f3;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .no-attendees {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .dialog-actions {
      margin-top: 20px;
      text-align: right;
    }
  `]
})
export class ViewAttendeesComponent {
  attendees: Attendee[] = [];
  isLoading = true;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<ViewAttendeesComponent>,
    private attendeesService: AttendeesService,
    @Inject(MAT_DIALOG_DATA) private data: { eventId: string }
  ) {
    this.loadAttendees();
  }

  private loadAttendees() {
    this.attendeesService.getEventAttendees(this.data.eventId).subscribe({
      next: (attendees) => {
        this.attendees = attendees;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load attendees';
        this.isLoading = false;
        console.error('Error loading attendees:', error);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
} 