import { Fragment, useCallback, useMemo } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Tab } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/pro-regular-svg-icons";
import { useGlobalState } from "www/shared/modules/global_context";
import React from "react";
import { classNames } from "www/shared/utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  fetchNotifications,
  invalidateNotificationViews,
  markNotificationsAsSeen,
  notificationListener,
  NotificationQueryKey,
} from "./NotificationMenu.fetchers";
import NotificationCardSelector from "./NotificationCardSelector";

export default function NotificationMenu() {
  const supabaseUser = useGlobalState((s) => s.supabaseUser);
  const markUnSeenNotificationsAsSeen = useMutation(markNotificationsAsSeen);
  const queryClient = useQueryClient();

  const { data: res } = useQuery({
    queryKey: [NotificationQueryKey.NotificationView, supabaseUser?.id],
    queryFn: () => fetchNotifications(supabaseUser?.id!),
    onError: (err) => {
      console.log("err", err);
    },
  });

  notificationListener(supabaseUser?.id, queryClient);
  const requestNotifications = useMemo(
    () =>
      res?.data?.notifications?.filter(
        (n) => n.notification_type === "HasAcceptedYourConnectionRequest"
      ),
    [res?.data?.notifications]
  );
  const simpleNotifications = useMemo(
    () =>
      res?.data?.notifications?.filter(
        (n) => n.notification_type !== "HasAcceptedYourConnectionRequest"
      ),
    [res?.data?.notifications]
  );
  const viewNotification = useCallback(
    (type: "simpleNotifications" | "requestNotifications") => {
      // check if there are any notifications that are not seen
      let notifications =
        type === "requestNotifications"
          ? requestNotifications
              ?.filter((n) => n.is_seen === false)
              .map((n) => ({
                id: n.id,
                is_seen: true,
                receiving_user_id: n.receiving_user_id,
                from_user_id: n.from_user_id,
                notification_type: n.notification_type,
              })) || []
          : simpleNotifications
              ?.filter((n) => n.is_seen === false)
              .map((n) => ({
                id: n.id,
                is_seen: true,
                receiving_user_id: n.receiving_user_id,
                from_user_id: n.from_user_id,
                notification_type: n.notification_type,
              })) || [];
      setTimeout(async () => {
        if (notifications.length > 0) {
          const res = await markUnSeenNotificationsAsSeen.mutateAsync(
            notifications
          );
          if (res.error) {
            console.log("error", res.error);
          }
          if (res.data) {
            invalidateNotificationViews(queryClient);
          }
        }
      }, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requestNotifications, simpleNotifications]
  );
  const unSeenRequestNotifications = useMemo(
    () => requestNotifications?.filter((n) => n.is_seen === false).length || 0,
    [requestNotifications]
  );
  const unSeenSimpleNotifications = useMemo(
    () => simpleNotifications?.filter((n) => n.is_seen === false).length || 0,
    [simpleNotifications]
  );
  const unSeenNotifications = useMemo(
    () =>
      res?.data?.notifications?.filter((n) => n.is_seen === false).length || 0,
    [res?.data?.notifications]
  );

  return (
    <Menu as="div" className="relative inline-block text-left ">
      <>
        <div>
          <Menu.Button className="inline-flex w-full justify-center  bg-transparent  shadow-sm hover:bg-gray-50 focus:outline-none relative">
            <FontAwesomeIcon
              icon={faBell}
              size="lg"
              className="hover:cursor-pointer hover:text-gray-500 text-gray-400 pb-1"
            />
            {unSeenNotifications > 0 && (
              <span className="bg-green-700 h-4 w-4 rounded-full text-white flex justify-center items-center absolute -right-2 -top-1">
                <p className="text-xs leading-4 font-normal">
                  {unSeenNotifications}
                </p>
              </span>
            )}
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-[400px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-auto">
            <Tab.Group defaultIndex={1}>
              <div className="border-b border-gray-200 mx-8">
                <div className="sm:flex sm:items-baseline ">
                  <Tab.List className="pb-2 pt-4">
                    <Tab>
                      {({ selected }) => {
                        selected && viewNotification("requestNotifications");

                        return (
                          <>
                            <span
                              className={classNames(
                                selected
                                  ? "border-green-700 text-green-700"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                "whitespace-nowrap pt-4 pb-[10px] px-1 border-b-2 font-medium text-sm hover:cursor-pointer  focus:outline-none focus:ring focus:ring-white",
                                unSeenRequestNotifications === 0 ? "mr-9" : ""
                              )}
                            >
                              Connection Requests
                            </span>
                            {unSeenRequestNotifications > 0 && (
                              <span className="px-1.5 py-1 bg-green-700 font-medium text-white rounded-[4px] text-[11px] leading-[10px] mr-9">
                                {unSeenRequestNotifications}
                              </span>
                            )}
                          </>
                        );
                      }}
                    </Tab>

                    <Tab>
                      {({ selected }) => {
                        selected && viewNotification("simpleNotifications");

                        return (
                          <>
                            <span
                              className={classNames(
                                selected
                                  ? "border-green-700 text-green-700"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                "whitespace-nowrap pt-4 pb-[10px] px-1 border-b-2 font-medium text-sm hover:cursor-pointer focus:outline-none focus:ring focus:ring-white"
                              )}
                            >
                              Notifications
                            </span>
                            {unSeenSimpleNotifications > 0 && (
                              <span className="px-1.5 py-1 bg-green-700 font-medium text-white rounded-[4px] text-[11px] leading-[10px]">
                                {unSeenSimpleNotifications}
                              </span>
                            )}
                          </>
                        );
                      }}
                    </Tab>
                  </Tab.List>
                </div>
              </div>
              <Tab.Panels>
                <Tab.Panel>
                  {requestNotifications && requestNotifications.length > 0 ? (
                    <>
                      <NotificationCardSelector
                        notifications={requestNotifications}
                      />
                      {requestNotifications.length > 10 && (
                        <SeeAllNotifications />
                      )}
                    </>
                  ) : (
                    <EmptyNotification type="requestNotifications" />
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  {simpleNotifications && simpleNotifications.length > 0 ? (
                    <>
                      <NotificationCardSelector
                        notifications={simpleNotifications}
                      />
                      {simpleNotifications.length > 10 && (
                        <SeeAllNotifications />
                      )}
                    </>
                  ) : (
                    <EmptyNotification />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Menu.Items>
        </Transition>
      </>
    </Menu>
  );
}

const EmptyNotification = ({
  type = "simpleNotifications",
}: {
  type?: "requestNotifications" | "simpleNotifications";
}) => {
  return (
    <div className=" h-full px-5 py-4">
      {type === "requestNotifications" ? (
        <p className="text-sm leading-5 font-normal text-gray-500">
          You don&apos;t have any connection requests
        </p>
      ) : (
        <p className="text-sm leading-5 font-normal text-gray-500">
          You don&apos;t have any notifications.
        </p>
      )}
    </div>
  );
};
const SeeAllNotifications = () => {
  return (
    <div className="  hover:bg-gray-50 hover:cursor-pointer">
      <p className="text-sm leading-5 font-medium text-gray-900 border-t-gray-200 border py-4 px-5">
        See All Notifications
      </p>
    </div>
  );
};
