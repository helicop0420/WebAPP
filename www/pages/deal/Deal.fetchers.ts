import { QueryClient } from "react-query";
import { db } from "www/shared/modules/supabase";

export enum DealQueryKey {
  DealView = "DealView",
}

export const fetchDealView = async (handle: string) => {
  const response = await db
    .deal_page_view()
    .select()
    .eq("handle", handle)
    .limit(1)
    .single();

  return response;
};

export const invalidateDealViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(DealQueryKey.DealView);
};
