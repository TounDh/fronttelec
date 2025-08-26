import { Routes } from '@angular/router';
import { AboutComponent } from './../about/about.component';
import { ServicesComponent } from './../services/services.component';
import { ContactComponent } from './../contact/contact.component';
import { NotfoundComponent } from './../notfound/notfound.component';
import { HomeComponent } from './../home/home.component';
import { AuthComponent } from '../auth/auth.component';
import { SignupComponent } from '../signup/signup.component';
import { MyaccountComponent } from '../myaccount/myaccount.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MngclientComponent } from '../mngclient/mngclient.component';
import { MngserviceComponent } from '../mngservice/mngservice.component';
import { MngpaymentComponent } from '../mngpayment/mngpayment.component';
import { MngapplicComponent } from '../mngapplic/mngapplic.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route (replace with your home component if needed)
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'myaccount', component: MyaccountComponent },
  { path: '404', component: NotfoundComponent },
  { path: 'login', component: AuthComponent },
  { path: 'logup', component: SignupComponent },
  { path: 'dash', component: DashboardComponent },
  { path: 'dash/clients', component: MngclientComponent }, 
  { path: 'dash/services', component: MngserviceComponent },
  { path: 'dash/payments', component: MngpaymentComponent },
  { path: 'dash/applications', component: MngapplicComponent },
  { path: '**', redirectTo: '/404' }
];