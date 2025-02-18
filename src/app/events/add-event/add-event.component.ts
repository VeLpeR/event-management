import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../../services/events.service';

interface EventForm {
  name: string;
  description: string;
  date: string;
  type: 'Conference' | 'Workshop' | 'Meetup';
}

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {
  event: EventForm = {
    name: '',
    description: '',
    date: '',
    type: 'Conference'
  };

  eventTypes = ['Conference', 'Workshop', 'Meetup'];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private eventsService: EventsService
  ) {}

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.eventsService.createEvent(this.event).subscribe({
      next: (response) => {
        this.successMessage = 'Event created successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/event']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.errorMessage = 'You are not authorized. Please login again.';
          this.router.navigate(['/login']);
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid request. Please check your input.';
        } else {
          this.errorMessage = error.error?.error || 'Failed to create event. Please try again.';
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/event']);
  }
}
