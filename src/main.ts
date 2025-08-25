     import { bootstrapApplication } from '@angular/platform-browser';
     import { provideRouter } from '@angular/router';
     import { provideHttpClient } from '@angular/common/http';
     import { AppComponent } from './app/features/app.component';
     import { routes } from './app/features/app.routes';

     bootstrapApplication(AppComponent, {
       providers: [
         provideRouter(routes),
         provideHttpClient()
       ]
     })
     .catch(err => console.error(err));