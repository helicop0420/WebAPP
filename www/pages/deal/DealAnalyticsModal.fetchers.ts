import { QueryClient } from "react-query";
import { db } from "www/shared/modules/supabase";

export enum DealQueryKey {
  DealAnalyticsView = "DealAnalyticsView",
}

export const fetchDealAnalyticsView = async (dealId: number) => {
  const response = await db
    .deal_analytics_view()
    .select()
    .eq("id", dealId)
    .limit(1)
    .single();

  return response;
};

export const invalidateDealViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(DealQueryKey.DealAnalyticsView);
};
