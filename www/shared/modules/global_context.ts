import { User } from "@supabase/supabase-js";
import createStore from "zustand";
import { UserProfile, Organization } from "types/tables";
import { Deals } from "types/views";

export interface LoadingItem {
  componentName: "inbox" | "profile" | "deal" | "signup" | "login" | "account";
  processId?: string;
}

interface GlobalState {
  supabaseUser: User | null;
  userProfile:
    | (UserProfile["Row"] & {
        currentOrganization?: Organization["Row"] | null;
      })
    | null;
  sponsorDeals: Deals[];
  loadingItems: LoadingItem[];
  loading: boolean;
  startLoading: (item: LoadingItem) => void;
  stopLoading: (item: LoadingItem) => void;
  // Helpful for promises e.g. fetch("").then(*work without loading worry*).catch(*same*).finally(promiseLoadingHelper({componentName: "user"}))
  promiseLoadingHelper: (item: LoadingItem) => () => void;
  setGlobalState: (update: Partial<GlobalState>) => void;
}

export const useGlobalState = createStore<GlobalState>((set, get) => ({
  supabaseUser: null,
  userProfile: null,
  sponsorDeals: [],
  loading: false,
  loadingItems: [],
  startLoading: (item) =>
    set((state): Partial<GlobalState> => {
      const items = [...state.loadingItems];
      items.push(item);
      return { loadingItems: items, loading: true };
    }),

  stopLoading: (item) =>
    set((state): Partial<GlobalState> => {
      const items = [...state.loadingItems];
      for (let i = 0; i <= items.length; i++) {
        const currentItem = items[i];
        if (
          !currentItem ||
          (currentItem.componentName === item.componentName &&
            currentItem.processId === item.processId)
        ) {
          items.splice(i, 1);
        }
      }
      return { loadingItems: items, loading: items.length > 0 };
    }),
  setGlobalState: (update) => set(update),
  promiseLoadingHelper: (item) => {
    const { startLoading, stopLoading } = get();
    if (!item.processId) {
      item.processId = new Date().getTime().toString(32);
    }
    startLoading(item);
    return () => stopLoading(item);
  },
}));
