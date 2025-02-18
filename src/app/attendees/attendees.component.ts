import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AttendeesService, Attendee } from '../../services/attendees.service';
import { EventsService, Event } from '../../services/events.service';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendees.component.html',
  styleUrl: './attendees.component.scss'
})
export class AttendeesComponent implements OnInit {
  attendee: Omit<Attendee, '_id'> = {
    name: '',
    email: '',
    phone: '',
    eventId: ''
  };

  events: any;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Validation patterns
  emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  phonePattern = '^[0-9]{10}$';

  constructor(
    private attendeesService: AttendeesService,
    private eventsService: EventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventsService.getAllEvent().subscribe({
      next: (response) => {
        console.log(response)
        this.events = response;
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        this.errorMessage = 'Failed to load events';
      }
    });
  }

  onSubmit() {
    if (!this.attendee.eventId) {
      this.errorMessage = 'Please select an event';
      return;
    }

    // Additional validation
    if (!this.isValidEmail(this.attendee.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (!this.isValidPhone(this.attendee.phone)) {
      this.errorMessage = 'Please enter a valid 10-digit phone number';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.attendeesService.createAttendee(this.attendee).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.isSubmitting = false;
        this.router.navigate(['/event']);
        this.resetForm();
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = error.error?.error || 'Failed to register. Please try again.';
        }
      }
    });
  }

  private resetForm() {
    this.attendee = {
      name: '',
      email: '',
      phone: '',
      eventId: ''
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = new RegExp(this.emailPattern);
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = new RegExp(this.phonePattern);
    return phoneRegex.test(phone);
  }
}
