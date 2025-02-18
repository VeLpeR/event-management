import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { AttendeesService } from '../../services/attendees.service';

interface DashboardStats {
  totalEvents: number;
  totalAttendees: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalEvents: 0,
    totalAttendees: 0
  };
  isLoading = true;
  error = '';

  constructor(
    private eventsService: EventsService,
    private attendeesService: AttendeesService,
    private router: Router
  ) {}
nearestUpcomingEvent:any
  ngOnInit() {
    this.loadDashboardStats();
  }

  private loadDashboardStats() {
    this.isLoading = true;
    this.error = '';

    // Load events stats
    this.eventsService.getAllEvent().subscribe({
      next: (response:any) => {
        this.stats.totalEvents = response.length;
        this.isLoading = false;

        // Filter upcoming events
        const currentDate = new Date();
        const upcomingEvents = response.filter((event:any) => new Date(event.date) > currentDate) // Only future events
          .sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by closest date

        // Select the nearest upcoming event
        this.nearestUpcomingEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
      },
      error: (error) => {
        this.error = 'Failed to load dashboard stats';
        this.isLoading = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });


    // Load total attendees
    this.attendeesService.getAllAttendees().subscribe({
      next: (attendees) => {
        this.stats.totalAttendees = attendees.length;
      },
      error: (error) => {
        this.error = 'Failed to load attendee stats';
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
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
  navigateToEvents() {
    this.router.navigate(['/event']);
  }
  addAttendees(){
    this.router.navigate(['/attendee']);

  }
  logout(){
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
