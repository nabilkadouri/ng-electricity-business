import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { DatePipe,registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { errorInterceptor } from './shared/interceptors/error.interceptor';

registerLocaleData(localeFr, 'fr');


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor, 
        errorInterceptor]
      )),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'fr' }
    ]   
};
