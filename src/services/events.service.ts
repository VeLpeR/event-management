import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment';

export interface Event {
  _id: string;
  name: string;
  attendeesTotal?: number;
  description: string;
  date: string;
  type: 'Conference' | 'Workshop' | 'Meetup';
}

export interface PaginatedEvents {
  items: Event[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse {
  status: string;
  data: Event[];
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = environment.baseUrl + '/events';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/json'
    });
  }

  // Get events with pagination
  // getEvents(page: number = 1, pageSize: number = 2): Observable<PaginatedEvents> {
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('limit', pageSize.toString());

  //   return this.http.get<{ events: Event[], total: number }>(this.apiUrl, {
  //     params,
  //     headers: this.getHeaders()
  //   }).pipe(
  //     map(response => ({
  //       items: response.events ,
  //       total: response.events.length || 0,
  //       page: page,
  //       pageSize: pageSize
  //     }))
  //   );
  // }
  getEvents(page: number = 1, pageSize: number = 2, type?: string): Observable<PaginatedEvents> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());
    
    if (type) {
      params = params.set('type', type);
    }

    // Change the endpoint to /filter when type is provided
    const url = type ? `${this.apiUrl}/filter` : this.apiUrl;

    return this.http.get<{ events: Event[], total: number }>(url, {
      params,
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        items: response.events,
        total: response.total,
        page: page,
        pageSize: pageSize
      }))
    );
  }
  // Get single event by ID
  getEventById(_id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${_id}`, {
      headers: this.getHeaders()
    });
  }
  getAllEvent(){
    return this.http.get<Event>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }
  // Create new event
  createEvent(event: Omit<Event, '_id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event, {
      headers: this.getHeaders()
    });
  }

  // Update event
  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event, {
      headers: this.getHeaders()
    });
  }

  // Delete event
  deleteEvent(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`, {
      headers: this.getHeaders()
    });
  }

  // Search events
  searchEvents(query: string, page: number = 1, pageSize: number = 10): Observable<PaginatedEvents> {
    const params = new HttpParams()
      .set('search', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedEvents>(`${this.apiUrl}/search`, {
      params,
      headers: this.getHeaders()
    });
  }
}
