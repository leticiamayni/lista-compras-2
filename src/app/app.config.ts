import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAuth0({
      domain: 'dev-mo7vsvxudtut6pt8.us.auth0.com',
      clientId: 'mYxylSnxhxX6EjCaSFDzeh2JM9eiGTi0',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }), provideAnimationsAsync(),
        provideHttpClient(),
  ]
};