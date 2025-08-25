import { Routes } from '@angular/router';
import { AboutComponent } from './../about/about.component';
import { ServicesComponent } from './../services/services.component';
import { ContactComponent } from './../contact/contact.component';
import { NotfoundComponent } from './../notfound/notfound.component';
import { HomeComponent } from './../home/home.component';
import { AuthComponent } from '../auth/auth.component';
import { SignupComponent } from '../signup/signup.component';
import { MyaccountComponent } from '../myaccount/myaccount.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route (replace with your home component if needed)
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'myaccount', component: MyaccountComponent },
  { path: '404', component: NotfoundComponent },
  { path: 'login', component: AuthComponent },
  { path: 'logup', component: SignupComponent },
  { path: '**', redirectTo: '/404' }
];