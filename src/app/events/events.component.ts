import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService, Event, PaginatedEvents } from '../../services/events.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewAttendeesComponent } from './view-attendees/view-attendees.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  protected Math = Math;
  events: Event[] = [];
  currentPage = 1;
  pageSize = 2;
  totalItems = 0;
  isLoading = false;
  errorMessage = '';
  selectedType: string = 'All';
  eventTypes = ['All', 'Conference', 'Workshop', 'Meetup'];

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.errorMessage = '';

    const type = this.selectedType === 'All' ? '' : this.selectedType;
    this.eventsService.getEvents(this.currentPage, this.pageSize, type).subscribe({
      next: (response: PaginatedEvents) => {
        this.events = response.items;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading events:', error);
        if (error.status === 401) {
          this.errorMessage = 'Please login to view events';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to load events. Please try again.';
        }
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.totalItems);
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.loadEvents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  viewEvent(_id: string): void {
    this.dialog.open(ViewAttendeesComponent, {
      // width: '100%',
      // height:'100%',
      data: { eventId: _id }
    });
  }

  editEvent(_id: string): void {
    this.router.navigate(['/edit-event',_id]);
  }

  deleteEvent(_id: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventsService.deleteEvent(_id).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          this.errorMessage = 'Failed to delete event. Please try again.';
        }
      });
    }
  }

  create() {
    this.router.navigate(['/add-event']);
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.currentPage = 1; // Reset to first page when filter changes
    this.loadEvents();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
