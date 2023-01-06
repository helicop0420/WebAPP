import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faEllipsisVertical,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConversationPreview } from "types/views";
import { useRouter } from "next/router";
import { compareDesc } from "date-fns";
import ChatListCard from "./ChatListCard";
import { getUrlQueryString } from "www/shared/utils";
import { InboxPopover } from "./InboxPopover";

interface ChatListProps {
  chatList: ConversationPreview[];
}

export default function ChatList({ chatList }: ChatListProps) {
  const router = useRouter();
  const { conversation_id: selectedConversationId } = router.query as {
    conversation_id?: string;
  };

  const isActiveConversation = (chatConversationId: number, index: number) => {
    if (!selectedConversationId) {
      return index === 0;
    }

    return parseInt(selectedConversationId) === chatConversationId;
  };

  return (
    <div className="rounded-lg w-[33%] h-[calc(100vh-140px)] gap-4 px-6 pt-8 bg-white">
      <div className="flex flex-row justify-between border-b-2 border-green-700 w-full">
        <p className="text-2xl leading-8 font-extrabold tracking-tight mb-1">
          Inbox
        </p>
        <div className="space-x-2.5 mt-1.5 -mr-1.5">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="hover:cursor-pointer h-[17px] w-[17px]"
            onClick={() => {
              router.push(`/inbox/new${getUrlQueryString()}`);
            }}
          />
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="hover:cursor-pointer h-[17px] w-[17px]"
          />
        </div>
      </div>
      <div className="relative mt-4 pb-5 ">
        <div className="flex absolute inset-y-0 left-3 items-center h-10">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block p-4 pl-12 h-10 w-full placeholder:text-gray-500 placeholder:text-base placeholder:leading-6 place-holder:font-medium bg-gray-100 rounded-lg focus:outline-none"
          placeholder="Search Messages"
        />
      </div>

      <InboxPopover chatList={chatList} />
      <div className="flex flex-col h-3/4 flex-nowrap pt-2 overflow-y-auto overflow-x-hidden -mx-6 -pb-4 justify-start">
        {chatList
          ?.sort((a, b) =>
            compareDesc(
              new Date(a.latest_message_sent_at),
              new Date(b.latest_message_sent_at)
            )
          )
          .map((chat, index) => (
            <ChatListCard
              {...chat}
              key={index}
              isActive={isActiveConversation(chat.conversation_id, index)}
            />
          ))}
      </div>
    </div>
  );
}
