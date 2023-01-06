import Link from "next/link";
import React from "react";
import { Notification } from "types/views";
import NotificationCardContainer from "../NotificationCardContainer";
// TODO: needs organisation handle supplied
// to have the ability click on the org name to visit org page

export default function TeamNotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <NotificationCardContainer
      id={notification.id}
      profilePicUrl={notification.attached_org_profile_pic_url}
      name={notification.attached_org_name ?? "Org Name"}
      time={notification.created_at}
      isSeen={notification.is_seen}
      handle={"/"}
    >
      <div className="text-sm leading-5 font-normal text-gray-500">
        <p className="inline">Added you as a team member in the organization</p>{" "}
        <Link href={`/deal/${notification.attached_org_id}`} className=" ">
          <p className="inline font-semibold hover:cursor-pointer">
            {notification.attached_org_name}
          </p>
        </Link>
      </div>
    </NotificationCardContainer>
  );
}
