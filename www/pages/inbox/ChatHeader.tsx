import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InboxConversationView } from "types/views";
import {
  faUserCircle,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import { classNames, getFullName } from "www/shared/utils";
import { useGlobalState } from "www/shared/modules/global_context";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { SimpleAlert } from "www/shared/components/modal/SimpleAlert";
import { useQueryClient } from "react-query";
import { updateConversationDone } from "./EditConversation.fetchers";
import { invalidateInboxViews } from "./Inbox.fetchers";
import { PrivateNote } from "./PrivateNote";

interface ChatHeaderProps {
  conversationData: InboxConversationView;
}
export default function ChatHeader({ conversationData }: ChatHeaderProps) {
  const user = useGlobalState((s) => s.userProfile)!;
  let { users_in_conv, title: groupName, is_marked_done } = conversationData;
  const usersInConv = users_in_conv ?? [];

  const firstUser = usersInConv[0];
  const isSoloConversation = usersInConv.length === 1;

  const peopleInConversation = `${usersInConv
    .map((user) => user.first_name!)
    .join(", ")} and you`;

  const fullName = getFullName({
    firstName: firstUser.first_name!,
    lastName: firstUser.last_name,
  });
  return (
    <div className="flex flex-row justify-between border-b-2 border-green-700 w-full py-2">
      <div className="flex flex-row">
        {isSoloConversation && (
          <div className="overflow-hidden flex align-center py-3 pr-3">
            {usersInConv[0]?.profile_pic_url ? (
              <Image
                src={usersInConv[0]?.profile_pic_url}
                alt="Profile Picture"
                className="rounded-full w-10 h-10 object-cover"
                width={40}
                height={40}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-gray-500 rounded-full w-10 h-10"
              />
            )}
          </div>
        )}
        <div className="flex flex-col justify-center">
          {isSoloConversation && (
            <>
              <p className="text-sm leading-5 font-medium text-gray-900 flex">
                {fullName}
                <PrivateNote
                  targetUserId={firstUser.user_id}
                  targetUsername={fullName}
                />
              </p>
              <p className="text-sm leading-5 text-gray-500 -mt-0.5">
                {firstUser.current_org_position &&
                  `${firstUser.current_org_position}, `}
                <b className="text-xs text-gray-500">
                  {firstUser.current_org_name}
                </b>
              </p>
            </>
          )}
          {!isSoloConversation && (
            <>
              <h3 className="text-base leading-6 font-bold text-black">
                {groupName || peopleInConversation}
              </h3>
              <OverlappingImages
                images={[
                  ...usersInConv.map((user) => user.profile_pic_url),
                  user.profile_pic_url,
                ]}
              />
              {groupName && (
                <b className="text-xs text-gray-500">{peopleInConversation}</b>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row">
        <HeaderMenu
          conversationId={conversationData.conversation_id!}
          isSoloConversation={isSoloConversation}
          isMarkedDone={!!is_marked_done}
        />
      </div>
    </div>
  );
}

const GROUP_INDIVIDUAL_IMAGE_LENGTH = 32;
function OverlappingImages({ images }: { images: (string | null)[] }) {
  return (
    <div className="flex flex-row relative h-[32px] mt-2 mb-3">
      {images.map((url, index) => {
        return (
          <div
            className="overflow-hidden flex align-center absolute border-2 border-white rounded-full "
            style={{
              left:
                index === 0 ? 0 : index * (GROUP_INDIVIDUAL_IMAGE_LENGTH - 8),
            }}
            key={index}
          >
            {url ? (
              <Image
                src={url}
                alt="Profile Picture"
                className="rounded-full w-10 h-10 object-cover"
                width={GROUP_INDIVIDUAL_IMAGE_LENGTH}
                height={GROUP_INDIVIDUAL_IMAGE_LENGTH}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-gray-500 rounded-full w-10 h-10"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function HeaderMenu({
  conversationId,
  isMarkedDone,
  isSoloConversation,
}: {
  conversationId: number;
  isMarkedDone: boolean;
  isSoloConversation: boolean;
}) {
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="w-4 h-4 flex justify-end">
            <FontAwesomeIcon icon={faEllipsisVertical} />
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 text-sm">
              {!isSoloConversation && (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={classNames(
                          "px-4 py-2 flex",
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        )}
                      >
                        <Link href={`/inbox/edit?convo=${conversationId}`}>
                          <a className="flex-1">Add / Remove People</a>
                        </Link>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={classNames(
                          "px-4 py-2 flex",
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        )}
                      >
                        <Link href={`/inbox/edit?convo=${conversationId}`}>
                          <a className="flex-1">Rename conversation</a>
                        </Link>
                      </div>
                    )}
                  </Menu.Item>
                </>
              )}
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      "px-4 py-2 flex",
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    )}
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => {
                        setIsDoneModalOpen(true);
                      }}
                    >
                      Mark {isMarkedDone ? "not Done" : "Done"}
                    </button>
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <SimpleAlert
        open={isDoneModalOpen}
        setOpen={setIsDoneModalOpen}
        title={
          isMarkedDone
            ? "Do you want to re-open this conversation?"
            : "Are you sure you want to mark conversation as Done?"
        }
        description={
          isMarkedDone
            ? "This will re-open the conversation and you will be able to send messages again."
            : "If you mark this conversation as Done, it will be archived. To view this conversation, use the filters to view all archived conversations."
        }
        primaryOptions={{
          label: isMarkedDone ? "Re-open" : "Mark as Done",
          onClick: async () => {
            await updateConversationDone({
              is_done: !isMarkedDone,
              conversation_id: conversationId,
            });
            setIsDoneModalOpen(false);

            // There's a brief flicker since state changes go really fast in loading screen. This will fix that.
            setTimeout(() => {
              invalidateInboxViews(queryClient);
            }, 1000);
          },
        }}
        secondaryOptions={{
          label: "Cancel",
          onClick: () => {
            setIsDoneModalOpen(false);
          },
        }}
      />
    </>
  );
}
