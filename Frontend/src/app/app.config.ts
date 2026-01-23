import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ApiModule, Configuration } from './modules/ct-client';
import { environment } from '../environment/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
     provideAnimations(),
    importProvidersFrom(
      ApiModule.forRoot(() => new Configuration({ basePath: environment.apiUrl }))
    ),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: OVERLAY_DEFAULT_CONFIG, useValue:{
  usePopover: false,
} }
]
};
