import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import useLoginStore from "./LoginStore";

const useNewsStore = create((set) => ({
  listID: "%7B859d2f56-3097-45e5-842a-df6da271917d%7D",
  news: [],
  newsPerPage: 4,
  currentPage: 1,
  currentNews: [],

  getNews: async () => {
    try {
      const response = await invoke("fetch_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useNewsStore.getState().listID,
        listType: "news",
        maxItem: 40,
        sort: "desc",
        sortColumn: "Created",
      });
      console.debug("News response:", response.value);
      const parsedItems = response.value.map((item) => {
        if (item.fields) {
          return {
            id: item.id,
            Title: item.fields.Title,
            Description: item.fields.Description,
            Source: item.fields.Source,
            URL: item.fields.URL,
            ImageURL: item.fields.ImageURL,
          };
        }
      });
      set({ news: parsedItems });
    } catch (error) {
      console.error("Error fetching news:", error);
      set({ news: [] });
    }
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setCurrentNews: () => {
    const news = useNewsStore.getState().news;
    const currentPage = useNewsStore.getState().currentPage;
    const newsPerPage = useNewsStore.getState().newsPerPage;
    const indexOfLastCard = currentPage * newsPerPage;
    const indexOfFirstCard = indexOfLastCard - newsPerPage;
    const newsSlice = news.slice(indexOfFirstCard, indexOfLastCard);
    set({ currentNews: newsSlice });
  },
}));

export default useNewsStore;
