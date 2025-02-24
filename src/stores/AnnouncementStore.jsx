import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { getNextMondayMidnight } from "../utils/Helpers";
import useLoginStore from "./LoginStore";

const useAnnouncementStore = create((set) => ({
  listID: "%7B7218990f-af71-4508-b2fa-454540b2c748%7D",
  announcements: [],
  mutedAnnouncements: [],
  muteEndTime: null,

  getAnnouncement: async () => {
    try {
      const response = await invoke("fetch_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useAnnouncementStore.getState().listID,
        listType: "data",
        maxItem: 5,
      });

      const parsedList = await Promise.all(
        response.value.map(async (item) => {
          if (item.fields) {
            let imageUrl = null;
            if (item.fields.Banner) {
              try {
                const photoJson = JSON.parse(item.fields.Banner);
                if (photoJson.id) {
                  let imageId = photoJson.id;
                  const image_resp = await invoke(
                    "fetch_sharepoint_list_image",
                    {
                      token: useLoginStore.getState().accessToken,
                      siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
                      imageId,
                    }
                  );
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

              Title: item.fields.Title,
              Description: item.fields.Description,
              StartTime: item.fields.StartTime,
              EndTime: item.fields.EndTime,
              Banner: imageUrl,
              Link1Title: item.fields.Link1Title,
              Link1URL: item.fields.Link1URL,
              Link2Title: item.fields.Link2Title,
              Link2URL: item.fields.Link2URL,
              Link3Title: item.fields.Link3Title,
              Link3URL: item.fields.Link3URL,
              Open: (() => {
                const localMuted = JSON.parse(
                  localStorage.getItem("mutedAnnouncement") || "[]"
                );
                console.debug("Local muted:", localMuted);
                const mutedAnnouncement = localMuted.find(
                  (muted) => muted.id === item.id
                );
                if (mutedAnnouncement) {
                  return new Date() > new Date(mutedAnnouncement.endTime)
                    ? true
                    : false;
                }
                return true;
              })(),
            };
          }
        })
      );
      console.debug("Announcement response:", parsedList);
      set({ announcements: parsedList });
    } catch (error) {
      console.error("Error fetching announcement:", error);
      set({ announcements: [] });
    }
  },

  closeAnnouncement: (id) => {
    const newAnnouncements = useAnnouncementStore
      .getState()
      .announcements.map((announcement) => {
        if (announcement.id === id) {
          return { ...announcement, Open: false };
        } else {
          return announcement;
        }
      });
    set({ announcements: newAnnouncements });
  },

  muteAnnouncement: (id) => {
    const mutedAnnouncements =
      useAnnouncementStore.getState().mutedAnnouncements;
    const currentMuted = {
      id,
      endTime: getNextMondayMidnight(),
    };
    mutedAnnouncements.push(currentMuted);
    localStorage.setItem(
      "mutedAnnouncement",
      JSON.stringify(mutedAnnouncements)
    );

    set({ mutedAnnouncements });
  },

  unmuteAnnouncement: (id) => {
    const mutedAnnouncements = useAnnouncementStore
      .getState()
      .mutedAnnouncements.filter((muted) => muted.id !== id);
    localStorage.setItem(
      "mutedAnnouncement",
      JSON.stringify(mutedAnnouncements)
    );
    set({ mutedAnnouncements });
  },
}));

export default useAnnouncementStore;
