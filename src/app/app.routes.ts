import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EventsComponent } from './events/events.component';
import { AttendeesComponent } from './attendees/attendees.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { authGuard } from '../services/auth.guard';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
      canActivate: [authGuard]
  },
  {
    path: 'event',
    component: EventsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'attendee',
    component: AttendeesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add-event',
    component: AddEventComponent,
    canActivate: [authGuard]
  }
];
