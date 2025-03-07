import { PublicClientApplication } from "@azure/msal-browser";
import { reactive } from "vue";

export const msalConfig = {
  auth: {
    clientId: "1bd5cc64-bb29-42b2-a4d9-56e556986e2b",
    authority:
      "https://login.microsoftonline.com/3011a54b-0a5d-4929-bf02-a00787877c6a",
    redirectUri: window.location.origin + "/FE/auth/signin",
    postLogoutUri: window.location.origin + "/FE/auth/signin",
  },
  cache: {
    cacheLocation: "sessionStorage", // This is where the cache will stored
    storeAuthStateInCookie: false,
  },
};

export const graphScopes = {
  scopes: ["api://1bd5cc64-bb29-42b2-a4d9-56e556986e2b/access_via_msal"],
};

export const state = reactive({
  isAuthenticated: false,
  user: null,
});

export const msalEntity = new PublicClientApplication(msalConfig);
