import React from "react";
import { Notification } from "types/views";
import { getFullName } from "www/shared/utils";
import NotificationCardContainer from "../NotificationCardContainer";

export default function EndorsementNotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <NotificationCardContainer
      id={notification.id}
      profilePicUrl={notification.profile_pic_url}
      name={getFullName({
        firstName: notification.first_name ?? "",
        lastName: notification.last_name,
      })}
      time={notification.created_at}
      isSeen={notification.is_seen}
      handle={`/p/${notification.handle}`}
    >
      <div className="text-sm leading-5 font-normal text-gray-500">
        {/* TODO:Endorsement message to come at a later date */}
        <p className="inline">Wrote you an endorsement</p>{" "}
      </div>
    </NotificationCardContainer>
  );
}
