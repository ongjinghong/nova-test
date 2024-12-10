import { useMsal } from "@azure/msal-react";
import { createContext, useContext, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Box, CircularProgress, Typography } from "@mui/material";

import { loginRequest } from "../config/azureAuth";

// Create Context for each SharePoint data
const SharePointContext = createContext();
export const useSharePointData = () => useContext(SharePointContext);

const cityMapping = {
  BJ: "Beijing",
  AZ: "Arizona",
  SH: "Shanghai",
  OR: "Oregon",
  // Add more cities as needed
};

export const FetchSharepointData = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);
  const [loadingCommitment, setLoadingCommitment] = useState(true);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [loadingTarget, setLoadingTarget] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingMember, setLoadingMember] = useState(true);
  const [loadingStars, setLoadingStars] = useState(true);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  const [listData, setListData] = useState({
    commitment: [],
    mycommitment: [],
    submission: [],
    target: [],
    news: [],
    member: [],
    myinfo: [],
    stars: [],
    announcement: [],
  });

  const siteId = "16465dda-288d-4a9b-8851-afa9989a20e7";
  const sharepointListID = {
    commitment: {
      2024: "%7Bd0330bf3-293b-475f-8662-ddecbbc678d8%7D",
      2025: "%7B2286bf29-fba0-401e-9fae-1f74f22f60a2%7D",
    },
    submission: {
      2024: "%7B2b2358bd-d94d-4a86-9227-ddf21be12c00%7D",
      2025: "%7Bff87f8d6-1657-4d3a-9443-9d0bd25912e8%7D",
    },
    target: {
      2024: "%7Be22a23f1-9b93-4930-a273-8821d6676643%7D",
      2025: "%7B2d019bfd-2980-4a8f-b236-488c5eb1a9e5%7D",
    },
    stars: {
      2024: [
        "%7B6dc3d0a2-66f8-4a64-8e04-651e0debc4f0%7D",
        "%7Bb45608f3-25a0-4a51-8c43-6cd094534a86%7D",
        "%7B0ec02ce7-b3ad-4c51-b266-dc1111fa405b%7D",
        "%7B1b68a258-f475-4f57-bc36-333bc000054c%7D",
      ],
      2025: [],
    },
    flex_member: "%7B3be9d925-dd09-451b-a0e0-278b0582dc7c%7D",
    member: "5cc107ab-c504-4240-b2a0-f7130abc3745",
    news: "%7B859d2f56-3097-45e5-842a-df6da271917d%7D",
    // pages: "%7Bf981e76d-a0ea-4e7e-a112-ab8e720f2a8d%7D",
    announcement: "%7B7218990f-af71-4508-b2fa-454540b2c748%7D",
  };

  const getAccessToken = async () => {
    const request = {
      loginRequest,
      account: accounts[0],
    };

    const response = await instance.acquireTokenSilent(request);
    setToken(response.accessToken);
    return response.accessToken;
  };

  const fetchCommitmentData = async (token) => {
    const listIds = sharepointListID.commitment;
    const maxItem = "500";

    setLoadingCommitment(true);
    try {
      const allListItems = [];
      const allMyItems = [];
      let currentId = 0;

      for (const year in listIds) {
        const listId = listIds[year];
        const response = await invoke("access_sharepoint_list", {
          token: token,
          siteId,
          listId,
          maxItem, // max_items
        });

        const listItems = response.value.map((item) => {
          return {
            id: currentId++,
            list_id: item.id,
            year: parseInt(year),
            email: item.fields
              ? year == 2024
                ? item.fields.Title
                : item.fields.Email
              : null,
            domain: item.fields ? item.fields.Domain : null,
            site: item.fields ? item.fields.Site : null,
            quarter: item.fields ? item.fields.Quarter : null,
            conf: item.fields
              ? year == 2024
                ? item.fields.Conferences
                : item.fields.Conferences_Primary
              : null,
            conf2: item.fields ? item.fields.Conferences_Secondary : null,
            idf: item.fields
              ? year == 2024
                ? item.fields.IDF
                : item.fields.IDF_Primary
              : null,
            idf2: item.fields ? item.fields.IDF_Secondary : null,
            init: item.fields
              ? year == 2024
                ? item.fields.POC_x002f_Pitching
                : item.fields.Initiatives_Primary
              : null,
            init2: item.fields
              ? year == 2024
                ? item.fields.POC_x002f_Pitching0
                : item.fields.Initiatives_Secondary
              : null,
            uinvt: item.fields
              ? year == 2024
                ? item.fields.Micro_x002d_Innovation
                : item.fields.MicroInnovation_Primary
              : null,
            uinvt2: item.fields ? item.fields.MicroInnovation_Secondary : null,
            opensrc: item.fields
              ? year == 2024
                ? item.fields.OpenSource
                : item.fields.OpenSource_Primary
              : null,
            opensrc2: item.fields ? item.fields.OpenSource_Secondary : null,
            created: item.fields ? item.fields.Created : null,
            modified: item.fields ? item.fields.Modified : null,
          };
        });
        const myItems = listItems.filter(
          (item) => item.email === accounts[0].username
        );
        allListItems.push(...listItems);
        allMyItems.push(...myItems);
      }
      setListData((prevState) => ({
        ...prevState,
        commitment: allListItems,
        mycommitment: allMyItems,
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingCommitment(false);
    }
  };

  const fetchSubmissionData = async (token) => {
    const listIds = sharepointListID.submission;
    const maxItem = "500";

    setLoadingSubmission(true);
    try {
      const allListItems = [];
      let currentId = 0;

      for (const year in listIds) {
        const listId = listIds[year];
        const response = await invoke("access_sharepoint_list", {
          token: token,
          siteId,
          listId,
          maxItem, // max_items
        });
        const listItems = response.value.map((item) => {
          return {
            id: currentId++,
            list_id: item.id,
            year: parseInt(year),
            title: item.fields ? item.fields.Title : null,
            category: item.fields ? item.fields.Category : null,
            site: item.fields ? item.fields.Site : null,
            domain: item.fields ? item.fields.Domain : null,
            quarter: item.fields ? item.fields.Quarter : null,
            duration: item.fields
              ? year == "2024"
                ? null
                : item.fields.Duration
              : null,
            status: item.fields ? item.fields.Status : null,
            problem: item.fields ? item.fields.ProblemStatement : null,
            snb: item.fields ? item.fields.SolutionandBenefits : null,
            ea: item.fields ? item.fields.EA : null,
            sr: item.fields ? item.fields.SRNumber : null,
            platform: item.fields ? item.fields.SubmissionPlatform : null,
            platformid: item.fields
              ? year == "2024"
                ? item.fields.SubmissionID
                : item.fields.SubmissionPlatformID
              : null,
            author1: item.fields ? item.fields.PrimaryAuthorLookupId : null,
            author2: item.fields
              ? year == "2024"
                ? item.fields.SecondaryAuthor
                : item.fields.SecondaryAuthors
              : null,
            created: item.fields ? item.fields.Created : null,
            modified: item.fields ? item.fields.Modified : null,
          };
        });
        allListItems.push(...listItems);
      }
      setListData((prevState) => ({
        ...prevState,
        submission: allListItems,
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingSubmission(false);
    }
  };

  const fetchTargetData = async (token) => {
    const listIds = sharepointListID.target;
    const maxItem = "200";

    setLoadingTarget(true);
    try {
      const allListItems = [];
      let currentId = 0;

      for (const year in listIds) {
        const listId = listIds[year];
        const response = await invoke("access_sharepoint_list", {
          token: token,
          siteId,
          listId,
          maxItem, // max_items
        });

        const listItems = response.value.map((item) => {
          return {
            id: currentId++,
            list_id: item.id,
            year: parseInt(year),
            site: item.fields ? item.fields.Site : null,
            domain: item.fields ? item.fields.Domain : null,
            quarter: item.fields ? item.fields.Quarter : null,
            conferences: item.fields ? item.fields.Conference : null,
            idf: item.fields ? item.fields.IDF : null,
            initiatives: item.fields ? item.fields.POC_x002f_Pitching : null,
            microinnovation: item.fields
              ? item.fields.Micro_x002d_Innovation
              : null,
            opensource: item.fields ? item.fields.OpenSource : null,
            created: item.fields ? item.fields.Created : null,
            modified: item.fields ? item.fields.Modified : null,
          };
        });
        allListItems.push(...listItems);
      }
      setListData((prevState) => ({
        ...prevState,
        target: allListItems,
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingTarget(false);
    }
  };

  const fetchNewsData = async (token) => {
    const listId = sharepointListID.news;
    const maxItem = "40";
    const sort = "PublishDate";

    setLoadingNews(true);
    try {
      const response = await invoke("access_news_list", {
        token: token,
        siteId,
        listId,
        maxItem, // max_items
        sort,
      });
      const listItems = response.value.map((item) => {
        return {
          id: item.id,
          title: item.fields ? item.fields.Title : null,
          description: item.fields ? item.fields.Description : null,
          source: item.fields ? item.fields.Source : null,
          url: item.fields ? item.fields.URL : null,
          imageurl: item.fields ? item.fields.ImageURL : null,
        };
      });
      setListData((prevState) => ({
        ...prevState,
        news: listItems,
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchAnnouncementData = async (token) => {
    const listId = sharepointListID.announcement;
    const maxItem = "5";

    setLoadingAnnouncement(true);
    try {
      const response = await invoke("access_sharepoint_list", {
        token: token,
        siteId,
        listId,
        maxItem, // max_items
      });
      const listItems = await Promise.all(
        response.value.map(async (item) => {
          let imageId = null;
          let imageUrl = null;
          if (item.fields && item.fields.Banner) {
            try {
              const photoJson = JSON.parse(item.fields.Banner);
              if (photoJson.id) {
                imageId = photoJson.id;
                const image_resp = await invoke("get_sharepoint_list_image", {
                  token: token,
                  siteId,
                  imageId,
                });
                imageUrl = image_resp["@microsoft.graph.downloadUrl"];
              } else {
                imageUrl =
                  "https://media.istockphoto.com/id/1401607744/vector/megaphone-loudspeaker-speaker-social-media-advertising-and-promotion-symbol-marketing.jpg?s=612x612&w=0&k=20&c=6mn25IhbAK4vCNpDwo2hySPhOO0hWwkkFDCaYw9tLLs=";
              }
            } catch (error) {
              console.error("Error parsing Photo field:", error);
            }
          } else {
            imageUrl =
              "https://media.istockphoto.com/id/1401607744/vector/megaphone-loudspeaker-speaker-social-media-advertising-and-promotion-symbol-marketing.jpg?s=612x612&w=0&k=20&c=6mn25IhbAK4vCNpDwo2hySPhOO0hWwkkFDCaYw9tLLs=";
          }
          return {
            id: item.id,
            title: item.fields ? item.fields.Title : null,
            description: item.fields ? item.fields.Description : null,
            starttime: item.fields ? item.fields.StartTime : null,
            endtime: item.fields ? item.fields.EndTime : null,
            banner: imageUrl,
            link1: item.fields ? item.fields.Link1Title : null,
            link1_url: item.fields ? item.fields.Link1URL : null,
            link2: item.fields ? item.fields.Link2Title : null,
            link2_url: item.fields ? item.fields.Link2URL : null,
            link3: item.fields ? item.fields.Link3Title : null,
            link3_url: item.fields ? item.fields.Link3URL : null,
          };
        })
      );
      setListData((prevState) => ({
        ...prevState,
        announcement: listItems,
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingAnnouncement(false);
    }
  };

  const fetchStarsData = async (token) => {
    const listIds = sharepointListID.stars;
    setLoadingStars(true);

    const allListItems = [];
    let currentId = 1;

    try {
      for (const year in listIds) {
        const ids = listIds[year];
        for (const id of ids) {
          const response = await invoke("access_sharepoint_list", {
            token: token,
            siteId,
            listId: id,
            maxItem: "100",
          });
          const listItems = await Promise.all(
            response.value.map(async (item) => {
              let imageId = null;
              let imageUrl = null;
              if (item.fields && item.fields.Photo) {
                try {
                  const photoJson = JSON.parse(item.fields.Photo);
                  if (photoJson.id) {
                    imageId = photoJson.id;
                    const image_resp = await invoke(
                      "get_sharepoint_list_image",
                      {
                        token: token,
                        siteId,
                        imageId,
                      }
                    );
                    imageUrl = image_resp["@microsoft.graph.downloadUrl"];
                  }
                } catch (error) {
                  console.error("Error parsing Photo field:", error);
                }
              } else {
                imageUrl = null;
              }
              return {
                id: currentId++,
                year: parseInt(year),
                quarter: ids.indexOf(id) + 1,
                type: item.fields ? item.fields.InnovationStarType : null,
                site: item.fields ? item.fields.Site : null,
                submissionnumber: item.fields
                  ? item.fields.SubmissionNumber
                  : null,
                lookupid: item.fields ? item.fields.NameLookupId : null,
                image_url: imageUrl,
              };
            })
          );
          allListItems.push(...listItems);
        }
      }

      setListData((prevState) => ({
        ...prevState,
        stars: allListItems,
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingStars(false);
    }
  };

  const fetchMemberData = async (token) => {
    const userListId = sharepointListID.member;
    const flexListId = sharepointListID.flex_member;
    const maxItem = "1000";
    const myEmail = accounts[0].username;
    const managerEmailSet = new Set();

    setLoadingMember(true);
    try {
      const user_response = await invoke("access_sharepoint_list", {
        token: token,
        siteId,
        listId: userListId,
        maxItem,
      });
      const flex_response = await invoke("access_sharepoint_list", {
        token: token,
        siteId,
        listId: flexListId,
        maxItem,
      });

      // flex_response.value.forEach((person) => {
      //   if (person.fields.ManagerEmail) {
      //     managerEmailSet.add(person.fields.ManagerEmail.toLowerCase());
      //   }
      // });

      const listItems = user_response.value
        .filter(
          (item) =>
            item.fields.ContentType === "Person" &&
            item.fields.EMail !== undefined
        )
        .map((item) => {
          const flexItem = flex_response.value.find(
            (person) => person.fields.Name === item.fields.Title
          );

          // // Determine the role based on the presence of emails in the managerEmailSet
          // const role = managerEmailSet.has(item.fields.EMail.toLowerCase())
          //   ? ["Manager", "Member"]
          //   : ["Member"];

          return {
            id: item.id,
            lookupid: item.fields ? item.fields.id : null,
            name: item.fields ? item.fields.Title : null,
            email: item.fields ? item.fields.EMail : null,
            wwid: item.fields ? item.fields.JobTitle : null,
            department: item.fields ? item.fields.Department : null,
            pic: item.fields.Picture ? item.fields.Picture.Url : null,
            manager: flexItem ? flexItem.fields.Manager : null,
            site: flexItem
              ? flexItem.fields.City &&
                cityMapping[flexItem.fields.City.toUpperCase()]
                ? cityMapping[flexItem.fields.City.toUpperCase()]
                : flexItem.fields.Country
              : "Unknown",
            flex: flexItem
              ? flexItem.fields.Flex
                ? item.fields.Department?.toLowerCase().includes("flex")
                  ? true
                  : false
                : false
              : false,
            domain: flexItem
              ? flexItem.fields.Flex
                ? item.fields.Department?.toLowerCase().includes("flex")
                  ? (() => {
                      const department = item.fields.Department.toLowerCase();
                      if (department.includes("tfm")) return "TFM";
                      if (department.includes("outsourcing")) return "OMS";
                      if (
                        ["consultant", "pex", "tx"].some((text) =>
                          department.includes(text)
                        )
                      )
                        return "FC";
                      return "Engineering";
                    })()
                  : "Unknown"
                : "Unknown"
              : "Unknown",
            role: flexItem ? flexItem.fields.Role : "Guest",
          };
        });

      setListData((prevState) => ({
        ...prevState,
        member: listItems,
        myinfo: listItems.filter((item) => item.email === myEmail),
      }));
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    } finally {
      setLoadingMember(false);
    }
  };

  const addSubmission = async (token, data, year) => {
    const listId = sharepointListID.submission[year.toString()];

    try {
      const response = await invoke("add_sharepoint_item", {
        token: token,
        siteId,
        listId,
        fields: data,
      });
      return response;
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    }
  };

  const updateSubmission = async (token, id, data, year) => {
    const listId = sharepointListID.submission[year.toString()];

    try {
      const response = await invoke("update_sharepoint_item", {
        token: token,
        siteId,
        listId,
        itemId: id,
        fields: data,
      });
      return response;
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    }
  };

  const addCommitment = async (token, data, year) => {
    const listId = sharepointListID.commitment[year.toString()];

    try {
      const responses = await Promise.all(
        data.map(async (quarter_data) => {
          const response = await invoke("add_sharepoint_item", {
            token: token,
            siteId,
            listId,
            fields: quarter_data,
          });
          return response;
        })
      );
      return responses;
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    }
  };

  const updateCommitment = async (token, id, data, year) => {
    const listId = sharepointListID.commitment[year.toString()];

    try {
      const responses = await Promise.all(
        data.map(async (quarter_data, index) => {
          console.log(quarter_data);
          const response = await invoke("update_sharepoint_item", {
            token: token,
            siteId,
            listId,
            itemId: id[index],
            fields: quarter_data,
          });
          return response;
        })
      );
      return responses;
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    }
  };

  const addTarget = async (token, data, year) => {
    const listId = sharepointListID.target[year.toString()];

    try {
      const responses = await Promise.all(
        data.map(async (quarter_data) => {
          const response = await invoke("add_sharepoint_item", {
            token: token,
            siteId,
            listId,
            fields: quarter_data,
          });
          return response;
        })
      );
      return responses;
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    }
  };

  const updateTarget = async (token, id, data, year) => {
    const listId = sharepointListID.target[year.toString()];

    try {
      const responses = await Promise.all(
        data.map(async (quarter_data, index) => {
          console.log(quarter_data);
          const response = await invoke("update_sharepoint_item", {
            token: token,
            siteId,
            listId,
            itemId: id[index],
            fields: quarter_data,
          });
          return response;
        })
      );
      return responses;
    } catch (error) {
      console.error("Error accessing SharePoint:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();

      fetchCommitmentData(token);
      fetchSubmissionData(token);
      fetchTargetData(token);
      fetchStarsData(token);
      fetchNewsData(token);
      fetchAnnouncementData(token);
      fetchMemberData(token);
    };

    fetchData();
  }, [instance, accounts]);

  return (
    <SharePointContext.Provider
      value={{
        listData,
        token,
        getAccessToken,
        fetchCommitmentData,
        addCommitment,
        updateCommitment,
        fetchSubmissionData,
        addSubmission,
        updateSubmission,
        addTarget,
        updateTarget,
        fetchTargetData,
      }}
    >
      {loadingAnnouncement ||
      loadingCommitment ||
      loadingSubmission ||
      loadingTarget ||
      loadingStars ||
      loadingNews ||
      loadingMember ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="85vh"
        >
          <CircularProgress />
          <Typography>Fetching data from Innovation Portal</Typography>
        </Box>
      ) : (
        children
      )}
    </SharePointContext.Provider>
  );
};
