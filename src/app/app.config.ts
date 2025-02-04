import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {provideHttpClient} from '@angular/common/http'; // Import AngularSvgIconModule

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    ...(AngularSvgIconModule.forRoot().providers ?? []),
  ]
};
