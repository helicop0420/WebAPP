import Link from "next/link";
import React from "react";
import { Notification } from "types/views";
import { getFullName } from "www/shared/utils";
import NotificationCardContainer from "../NotificationCardContainer";

export default function DealNotificationCard({
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
          {notification.notification_type === "LikedYourPost" &&
            "Liked your post in"}
          {notification.notification_type === "PostedAComment" &&
            "Posted a comment in"}
          {notification.notification_type === "ExpressedInterestInYourDeal" &&
            "Expressed interest in your deal:"}
          {notification.notification_type === "ReferredYouToANewDeal" &&
            "Referred you to a new deal: "}
          {/*TODO: When other deal related notification are added */}
          {/* {notification.notification_type === "repost" && "Reposted your deal "}
                {notification.notification_type === "closed" && "Has closed fundraising for "}
                {notification.notification_type === "closing" && "Is closing fundraising in 7 days for  "} */}
        </p>{" "}
        <Link href={`/deal/${notification.attached_deal_handle}`} className=" ">
          <p className="inline font-semibold hover:cursor-pointer">
            {notification.attached_deal_title}
          </p>
        </Link>
      </div>
    </NotificationCardContainer>
  );
}
