import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalService,
} from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msal.config';
import { AuthInterceptor } from './shared/interceptor/auth-interceptor/auth-interceptor-interceptor';
import { provideStore } from '@ngxs/store';
import { AuthState } from './states/auth.state';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { MessageService } from 'primeng/api';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([AuthInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
    MsalGuard,
    MsalInterceptor,
    MsalBroadcastService,
    MessageService,
    provideStore(
      [AuthState],
      withNgxsStoragePlugin({
        keys: ['auth'],
      }),
    ),
  ],
};
