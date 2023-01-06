import React from "react";
import { Notification } from "types/views";
import DealNotificationCard from "./notification_types/DealNotification";
import EndorsementNotificationCard from "./notification_types/EndorsementNotification";
import RequestNotificationCard from "./notification_types/RequestNotification";
import TeamNotificationCard from "./notification_types/TeamNotification";

export default function NotificationCardSelector({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div>
      {notifications.map((notification, index: number) => {
        switch (notification.notification_type) {
          case "LikedYourPost":
          case "PostedAComment":
          case "ExpressedInterestInYourDeal":
          case "ReferredYouToANewDeal":
            return (
              <DealNotificationCard key={index} notification={notification} />
            );
          case "HasAcceptedYourConnectionRequest":
            return (
              <RequestNotificationCard
                key={index}
                notification={notification}
              />
            );

          case "AddedYouAsATeamMember":
            return (
              <TeamNotificationCard key={index} notification={notification} />
            );
          case "WroteYouAnEndorsement":
            return (
              <EndorsementNotificationCard
                key={index}
                notification={notification}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
