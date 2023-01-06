import { db } from "www/shared/modules/supabase";

export enum AppQueryKey {
  SponsorDealsView = "SponsorDealsView",
}

export const fetchSponsorDealsView = async (userId: string) => {
  const dealsRes = await db
    .sponsor_deals_view()
    .select()
    .eq("user_id", userId)
    .single();

  let deals = dealsRes?.data?.deals || [];

  const uniqueDeals: { [key: number]: typeof deals[number] } = {};

  deals.forEach((deal) => {
    uniqueDeals[deal.id] = deal;
  });

  return Object.values(uniqueDeals);
};
