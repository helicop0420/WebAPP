import { QueryClient } from "react-query";
import { db } from "www/shared/modules/supabase";

export enum ProfileQueryKey {
  ProfileView = "ProfileView",
}

export const fetchProfileView = async (handle: string) => {
  const response = await db
    .profile_page_view()
    .select()
    .eq("handle", handle as string)
    .limit(1)
    .single();

  return response;
};
export const fetchOrganizationsList = async () => {
  const response = await db.organizations().select("name, id");

  return response;
};

export const invalidateProfileViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(ProfileQueryKey.ProfileView);
};
