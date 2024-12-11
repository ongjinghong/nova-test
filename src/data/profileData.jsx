import { useMsal } from "@azure/msal-react";
import { createContext, useContext, useState, useEffect } from "react";

import { getProfile, getProfilePic, getType } from "./graphData";

// Create Context for each SharePoint data
const ProfileContext = createContext();
export const useProfileData = () => useContext(ProfileContext);

export const FetchProfileData = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [profileData, setProfileData] = useState({
    profile: null,
    picture: null,
    manager: null,
    type: "",
  });

  useEffect(() => {
    const getAccessToken = async () => {
      const request = {
        scopes: ["User.Read"],
        account: accounts[0],
      };

      const response = await instance.acquireTokenSilent(request);
      return response.accessToken;
    };

    const fetchProfileInfo = async (token) => {
      const graphResponse = await getProfile(token);
      setProfileData((prevState) => ({
        ...prevState,
        profile: graphResponse,
      }));
    };

    const fetchProfilePic = async (token) => {
      const photoResponse = await getProfilePic(token);
      if (photoResponse !== null && photoResponse.ok) {
        const imageBlob = await photoResponse.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setProfileData((prevState) => ({
          ...prevState,
          picture: imageObjectURL,
        }));
      } else if (photoResponse == null) {
        console.log("Failed to fetch photo", photoResponse?.statusText);
        setProfileData((prevState) => ({
          ...prevState,
          picture: "../../public/icon.png",
        }));
      }
    };

    // const fetchManager = async (token) => {
    //   const managerResponse = await getManager(token);
    //   setProfileData((prevState) => ({
    //     ...prevState,
    //     manager: managerResponse,
    //   }));
    // };

    const fetchType = async (token) => {
      const typeResponse = await getType(token);
      if (typeResponse.value.length === 0) {
        setProfileData((prevState) => ({
          ...prevState,
          type: "Member",
        }));
      } else if (typeResponse.value.length > 0) {
        setProfileData((prevState) => ({
          ...prevState,
          type: "Manager",
        }));
      }
    };

    const fetchData = async () => {
      const token = await getAccessToken();
      fetchProfileInfo(token);
      fetchProfilePic(token);
      // fetchManager(token);
      fetchType(token);
    };

    fetchData();
  }, [instance, accounts]);

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
