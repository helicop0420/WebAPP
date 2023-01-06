// import Link from "next/link";
import React from "react";
import { Notification } from "types/views";
import { getFullName } from "www/shared/utils";
import NotificationCardContainer from "../NotificationCardContainer";
// TODO: More Request notification can be added here;
// Boiler plate setup already

export default function ConnectionRequestNotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <>
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
        <>
          {/* TODO: Boiler plate for the requesion notification that have action bottons */}
          {/* Friend Request Accepted */}
          {/* {notification.notification_type ===
            "HasAcceptedYourConnectionRequest" && (
            <div className="text-sm leading-5 font-normal text-gray-500">
              <p className=" text-sm leading-5 font-normal">
                Sent you a connection request
              </p>
              <div className="mt-4 flex">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Connected
                </button>
              </div>
            </div>
          )} */}
          {/* Workfamily Request Accepted */}
          {/* {notification.notification_type === "HasAcceptedYourWorkFamilyRequest" && (
              <div className="text-sm leading-5 font-normal text-gray-500">
              <p className=" text-sm leading-5 font-normal">
              Wants to add you to work family
              </p>
              <div className="mt-4 flex">
              <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
              Added
              </button>
              </div>
              </div>
            )} */}
          {/* Work family Request */}
          {/* {notification.notification_type === "SentYouWorkFamilyRequest" && (
              <div className="text-sm leading-5 font-normal text-gray-500">
              <p className=" text-sm leading-5 font-normal">
              Wants to add you to work family
              </p>
              <div className="mt-4 flex">
              <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-green-700 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {}}
              >
              Accept
              </button>
              <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md border border-gray-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {}}
              >
              Decline
              </button>
              </div>
              </div>
            )} */}
          {/* friend connection request */}
          {/* {notification.notification_type === "SentYouConnectionRequest" && (
              <div className="text-sm leading-5 font-normal text-gray-500">
              <p className=" text-sm leading-5 font-normal">
              Sent you a connection request
              </p>
              <div className="mt-4 flex">
              <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-green-700 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {}}
              >
              Accept
              </button>
              <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md border border-gray-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {}}
              >
              Decline
              </button>
              </div>
              </div>
            )} */}
        </>
      </NotificationCardContainer>
    </>
  );
}
