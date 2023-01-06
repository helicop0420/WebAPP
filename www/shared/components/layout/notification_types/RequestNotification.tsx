import React from "react";
import { Notification } from "types/views";
import { getFullName } from "www/shared/utils";
import NotificationCardContainer from "../NotificationCardContainer";

export type RequestNotification = {
  profilePicsUrl: string;
  name: string;
  time: string;
  type: Notification["notification_type"];
  isSeen: boolean;
  handle: string;
  id: number;
};

export default function RequestNotificationCard({
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
        <p className="inline">
          {/* {type === "HasAcceptedYourConnectionRequest" &&
                  "Has accepted your work family  request."} */}
          {notification.notification_type ===
            "HasAcceptedYourConnectionRequest" &&
            "Has accepted your connection request."}
        </p>{" "}
      </div>
    </NotificationCardContainer>
  );
}
