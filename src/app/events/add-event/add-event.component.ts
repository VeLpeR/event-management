import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-event.component.html', // Correct path
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup;
  eventTypes = ['Conference', 'Workshop', 'Meetup'];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  eventId: any;
  isEditing: any;

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      type: ['Conference', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId) {
        this.isEditing = true;
        this.loadEventData(this.eventId);
      } else {
        // Set default date for adding if needed
        this.eventForm.patchValue({ date: this.getCurrentDateFormatted() });
      }
    });
  }

  loadEventData(id: string) {
    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        if (event && event.date) { // Check if event and date exist
          const formattedDate = this.formatDate(event.date);
          this.eventForm.patchValue({
            name: event.name,
            description: event.description,
            date: formattedDate,
            type: event.type
          });
        } else {
          console.error("Invalid event data received:", event);
          this.errorMessage = "Invalid event data. Please try again.";
        }
      },
      error: (error) => {
        console.error("Error loading event data:", error);
        this.errorMessage = "Error loading event data. Please try again.";
      }
    });
  }


  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getCurrentDateFormatted(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const eventToSubmit = this.eventForm.value;

    const request = this.isEditing
      ? this.eventsService.updateEvent(this.eventId, eventToSubmit)
      : this.eventsService.createEvent(eventToSubmit);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Event updated successfully!' : 'Event created successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/event']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        // ... error handling
      }
    });
  }

  onCancel() {
    this.router.navigate(['/event']);
  }
}
