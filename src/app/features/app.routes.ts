import { Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { HomeComponent } from '../home/home.component';
import { ServicesComponent } from '../services/services.component';
import { ContactComponent } from '../contact/contact.component';
import { AboutComponent } from '../about/about.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: '', component: HomeComponent }, // Default route for the hero section
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' } // Wildcard for 404
];