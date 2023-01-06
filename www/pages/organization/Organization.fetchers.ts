import { QueryClient } from "react-query";
import { db } from "www/shared/modules/supabase";

export enum DealQueryKey {
  DealView = "DealView",
}

export const fetchOrganizationView = async (id: number) => {
  const response = await db
    .organization_page_view()
    .select()
    .eq("id", id)
    .limit(1)
    .single();

  return response;
};

export const invalidateDealViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(DealQueryKey.DealView);
};
