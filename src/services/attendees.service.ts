import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Attendee {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  eventId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendeesService {
  private apiUrl = environment.baseUrl + '/attendees';

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

  createAttendee(attendee: Omit<Attendee, '_id'>): Observable<Attendee> {
    return this.http.post<Attendee>(this.apiUrl, attendee, {
      headers: this.getHeaders()
    });
  }

  getAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }
  getAllAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(`${environment.baseUrl}/all-attendees`, {
      headers: this.getHeaders()
    });
  }
  getEventAttendees(eventId: string): Observable<Attendee[]> {
    const params = new HttpParams().set('eventId', eventId);
    return this.http.get<Attendee[]>(this.apiUrl, {
      params,
      headers: this.getHeaders()
    });
  }
}
