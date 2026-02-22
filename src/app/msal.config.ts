import { BrowserCacheLocation, Configuration } from '@azure/msal-browser';
import { environment } from '../enviroments/environment';

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.clientId,
    authority: environment.authority,
    knownAuthorities: [new URL(environment.authority).host],
    redirectUri: environment.baseUrl,
    postLogoutRedirectUri: environment.baseUrl,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};
