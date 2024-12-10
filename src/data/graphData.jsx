import { graphEndpoint } from "../config/azureAuth";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken
 */
export async function getProfile(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphEndpoint.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getProfilePic(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphEndpoint.graphMyPicEndpoint, options).catch((error) =>
    console.log(error)
  );
}

// export async function getManager(accessToken) {
//   const headers = new Headers();
//   const bearer = `Bearer ${accessToken}`;

//   headers.append("Authorization", bearer);

//   const options = {
//     method: "GET",
//     headers: headers,
//   };

//   return fetch(graphEndpoint.graphMyManagerEndpoint, options)
//     .then((response) => response.json())
//     .catch((error) => console.log(error));
// }

export async function getType(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphEndpoint.graphMyRoleEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
