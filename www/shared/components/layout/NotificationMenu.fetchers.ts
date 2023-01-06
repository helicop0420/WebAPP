import { QueryClient } from "react-query";
import { Notification } from "types/tables";
import { clientSupabase, db } from "www/shared/modules/supabase";

export enum NotificationQueryKey {
  NotificationView = "NotificationView",
}

export const fetchNotifications = async (userId: string) => {
  const response = await db
    .deal_notifications_view()
    .select()
    .eq("user_id", userId)
    // .eq("user_id", "f90464fb-8fee-47c2-b641-09ec35e59827")
    .limit(1)
    .single();

  return response;
};
interface NotificationUpdate {
  id: number;
  receiving_user_id: string;
  from_user_id: string;
  notification_type: Notification["Row"]["notification_type"];
  is_seen: boolean;
}
export const markNotificationsAsSeen = async (
  notifications: NotificationUpdate[]
) => {
  const response = await db.notifications().upsert([...notifications]);
  return response;
};

export const notificationListener = (
  id: string | undefined,
  queryClient: any
) =>
  clientSupabase
    .from(`notifications:receiving_user_id=eq.${id}`)
    .on("INSERT", () => invalidateNotificationViews(queryClient))
    .subscribe();

export const invalidateNotificationViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(NotificationQueryKey.NotificationView);
};
