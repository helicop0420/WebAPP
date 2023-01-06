import { serverDb } from "api/modules/server_supabase";
import {
  Deal,
  NotificationType,
  Organization,
  UserProfile,
} from "types/tables";
import { handleError } from "./seed_utils";

export async function createNotification({
  receivingUser,
  fromUser,
  notificationType,
  isSeen,
  attached_deal,
  attached_org,
}: {
  receivingUser: UserProfile["Row"];
  fromUser: UserProfile["Row"];
  notificationType: NotificationType;
  isSeen: boolean;
  attached_deal: Deal["Row"] | null;
  attached_org: Organization["Row"] | null;
}) {
  const res = await serverDb
    .notifications()
    .select("*")
    .eq("receiving_user_id", receivingUser.user_id)
    .eq("from_user_id", fromUser.user_id)
    .eq("notification_type", notificationType);

  handleError(res);

  if (res.data?.length === 0) {
    const res = await serverDb.notifications().insert({
      receiving_user_id: receivingUser.user_id,
      from_user_id: fromUser.user_id,
      notification_type: notificationType,
      is_seen: isSeen,
      attached_deal_id: attached_deal?.id,
      attached_org_id: attached_org?.id,
    });
    handleError(res);
    console.log(
      `Created notification for ${receivingUser.user_id} from ${fromUser.user_id} of type ${notificationType}`
    );
  } else {
    console.log(
      `Notification for ${receivingUser.user_id} from ${fromUser.user_id} of type ${notificationType} already exists`
    );
  }
}
