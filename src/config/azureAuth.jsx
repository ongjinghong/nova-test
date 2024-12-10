import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "9d72b907-c6dc-49b2-910f-14b9b1303d39",
    authority:
      "https://login.microsoftonline.com/46c98d88-e344-4ed4-8496-4ed7712e255d",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "User.ReadBasic.All",
    "Sites.Selected",
    "Sites.Read.All",
    "Sites.ReadWrite.All",
  ],
};

export const graphEndpoint = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMyPicEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  graphMyManagerEndpoint: "https://graph.microsoft.com/v1.0/me/manager",
  graphMyRoleEndpoint: "https://graph.microsoft.com/v1.0/me/directReports",
};
