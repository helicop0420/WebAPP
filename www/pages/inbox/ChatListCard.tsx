import React from "react";
import { ConversationPreview, UsersInConversation } from "types/views";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/future/image";
import Link from "next/link";
import { format } from "date-fns";
import { getFullName, getUrlQueryString } from "www/shared/utils";
interface ChatListCardProps extends ConversationPreview {
  isActive: boolean | undefined;
}
interface ProfileResponseMetaType {
  position: string | null;
  company: string | null;
  image: string | null;
  handle: string | null;
  chatUser: string | null;
}
const generateTitle = (
  users_in_conversation: null | UsersInConversation[],
  conversation_id: number
) => {
  const title =
    users_in_conversation?.length === 1
      ? getFullName({
          firstName: users_in_conversation[0].first_name!,
          lastName: users_in_conversation[0].last_name,
        })
      : users_in_conversation?.map((user) => `${user.first_name}`).join(", ");

  return title ? title : `Conversation #${conversation_id}`;
};

const getProfileMeta = (
  latest_message_user_id: string,
  user_in_conversation: null | UsersInConversation[]
): ProfileResponseMetaType => {
  let user = user_in_conversation?.filter(
    (user) => user.user_id === latest_message_user_id
  )[0];
  let position: string | null = "";
  let company: string | null = "";
  let image: string | null = "";
  let handle: string | null = "";
  let chatUser: string | null = "";

  if (user) {
    position = user.current_org_position;
    company = user.current_org_name;
    image = user.profile_pic_url ?? "";
    handle = user.handle;
    chatUser = user.first_name ?? "user";
  } else {
    position = user_in_conversation
      ? user_in_conversation[0].current_org_position
      : null;
    company = user_in_conversation
      ? user_in_conversation[0].current_org_name
      : null;
    image = user_in_conversation
      ? user_in_conversation[0].profile_pic_url ?? null
      : null;
    handle = user_in_conversation ? user_in_conversation[0].handle : null;
    chatUser = user_in_conversation
      ? user_in_conversation[0].first_name
      : "user";
  }
  return { position, company, image, handle, chatUser };
};
export default function ChatListCard({
  conversation_id,
  number_of_unread_messages,
  users_in_conv,
  latest_message_sent_at,
  title,
  latest_message_content,
  latest_message_user_id,
  isActive,
}: ChatListCardProps) {
  const { position, company, image, handle, chatUser } = getProfileMeta(
    latest_message_user_id,
    users_in_conv
  );
  const hasReadMessage = number_of_unread_messages === 0;

  return (
    <Link
      key={conversation_id}
      href={`/inbox/${conversation_id}${getUrlQueryString()}`}
    >
      <div
        className={`flex flex-row -mx-6 px-12 hover:cursor-pointer flex-wrap justify-start ${
          isActive ? "bg-gray-200" : "bg-white"
        }`}
      >
        <div className="border-b border-gray-100 pt-4 flex flex-row w-full gap-3">
          <div className="min-w-[40px] mr-2 w-[12%]">
            <Link href={handle ? `/p/${handle}` : ""}>
              {image ? (
                <Image
                  src={image ?? "/avatar.png"}
                  // src={chat.image_src}
                  alt="Profile Picture"
                  className="rounded-full w-10 h-10 object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                // the fas user seems abit of for this.
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-gray-500 rounded-full w-10 h-10"
                />
              )}
            </Link>
          </div>
          <div className="max-w-[87%] w-full">
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row gap-3 max-w-[75%] ">
                <p
                  className={`text-sm leading-5 text-gray-900 truncate ... ${
                    !hasReadMessage ? "font-bold" : "font-medium"
                  }`}
                >
                  {title
                    ? title
                    : generateTitle(users_in_conv, conversation_id)}
                </p>
                {/* TODO: Feature Not Available Yet; To Be Implemented in Future */}
                {/* <div className="">
                                    {chat.status === "closing" ? (
                                      <StatusCircle color="text-green-600" />
                                    ) : chat.status === "interest_expressed" ? (
                                      <StatusCircle color="text-yellow-300" />
                                    ) : chat.status === "invited" ? (
                                      <StatusCircle color="text-red-600" />
                                    ) : (
                                      <></>
                                    )}
                                  </div> */}
              </div>
              <p className="text-sm leading-5 font-medium text-gray-900  text-right">
                {latest_message_sent_at && (
                  <time>
                    {new Date(latest_message_sent_at).toDateString() ===
                    new Date(Date.now()).toDateString()
                      ? format(new Date(latest_message_sent_at), "h:MM aa")
                      : format(new Date(latest_message_sent_at), "MMM d")}
                  </time>
                )}
              </p>
            </div>
            {position ||
              (company && (
                <p
                  className={`text-sm leading-5 -mt-1 mb-3 ${
                    !hasReadMessage
                      ? "font-bold text-gray-900"
                      : "font-normal text-gray-500"
                  }`}
                >
                  {position}
                  {"  "}
                  {company ? <></> : <>, </>}
                  {!hasReadMessage ? <>{company}</> : <b>{company}</b>}
                </p>
              ))}
            <div className="flex flex-row">
              <p
                className={`text-sm flex-1 leading-5 text-gray-700 pb-4
                      ${!hasReadMessage ? "font-bold pr-2" : " font-normal"}
                    `}
              >
                {/* i fuser handle is null it will use one of th euser name fas the message sender name */}
                {chatUser}: {latest_message_content && latest_message_content}
              </p>
              {!hasReadMessage ? (
                <span className="bg-green-700 px-1.5 rounded-full text-xs font-medium md:inline-block h-5 w-6">
                  <p className="text-sm leading-5 font-bold text-white">
                    {number_of_unread_messages}
                  </p>
                </span>
              ) : (
                <span className="h-5 w-6"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
