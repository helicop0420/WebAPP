import {
  faPaperclip,
  faPaperPlane,
  faSpinner,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalState } from "www/shared/modules/global_context";
import {
  ConversationMessage,
  ConversationPreview,
  InboxConversationView,
} from "types/views";
import { compareDesc, isSameDay } from "date-fns";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createMessageInConversation,
  fetchInboxConversationView,
  getAttachemntInfo,
  InboxQueryKey,
  invalidateInboxViews,
  setMessagesRead,
} from "./Inbox.fetchers";
import { useRouter } from "next/router";
import DateDivider from "./DateDivider";
import { ChatUpdate } from "./ChatUpdate";
import { updateConversationDone } from "./EditConversation.fetchers";
import { AttachmentPopover } from "./AttachmentPopover";

export const IndividualChatContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex rounded-lg w-[67%] h-[calc(100vh-140px)] gap-4 px-5 py-2 lg:col-span-2 col-span-1 bg-white flex-col mb-11 ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};

const IndividualChat = () => {
  const router = useRouter();
  const conversation_ids = router.query.conversation_id as string[];
  const conversationId = conversation_ids?.[0];

  const user = useGlobalState((s) => s.supabaseUser);

  const { data: res } = useQuery({
    queryKey: [InboxQueryKey.ConversationView, user?.id, conversationId],
    queryFn: () => fetchInboxConversationView(user?.id!, conversationId),
  });

  const conversationData = res?.data;

  return (
    <IndividualChatContainer>
      {conversationData ? (
        <>
          <ChatHeader conversationData={conversationData} />
          <ChatBodyList conversationData={conversationData} />
        </>
      ) : (
        <div className="flex-1" />
      )}
      {!conversationData?.is_marked_done && (
        <IndividualChatFooter
          conversation_id={conversationId}
          isConversationDone={!!conversationData?.is_marked_done}
        />
      )}
    </IndividualChatContainer>
  );
};

type ChatFooterWithConversationIdType = {
  conversation_id: string;
  isFromNewMessage?: boolean;
  isConversationDone?: boolean;
  newConversationProps?: never;
};
type ChatFooterWithoutConversationIdType = {
  conversation_id: null;
  isFromNewMessage?: never;
  isConversationDone?: never;
  newConversationProps: {
    initializeConversationFn: (
      soloUserId?: string
    ) => Promise<number | undefined>;
    shouldSendIndividually: boolean;
    soloConversations: { [key: string]: ConversationPreview };
    selectedIds: string[];
  };
};
export function IndividualChatFooter({
  conversation_id,
  isFromNewMessage,
  isConversationDone,
  newConversationProps,
}: ChatFooterWithConversationIdType | ChatFooterWithoutConversationIdType) {
  const user = useGlobalState((s) => s.supabaseUser);
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMessage = useMutation(createMessageInConversation);

  const [message, setMessage] = useState("");
  const [filenameId, setFilenameId] = useState<number | undefined>();

  const sendIndividualMessage = async (convoId: string | number) => {
    const res = await createMessage.mutateAsync({
      conversationId: Number(convoId),
      content: message,
      userId: user?.id!,
      dealAttachmentId: filenameId,
    });

    setMessage("");
    setFilenameId(undefined);

    if (res.error != null) {
      toast.error("Error processing messages, reload the page and try again");
      return;
    }

    invalidateInboxViews(queryClient);
    toast.success("Message sent");

    if (isFromNewMessage) {
      router.push(`/inbox/${convoId}`);
    }
  };

  const onSubmit = async () => {
    if (!message) {
      toast.error("Message cannot be empty");
      return;
    }
    if (message.length >= 1900) {
      toast.error("Message cannot be too long");
      return;
    }

    if (!newConversationProps) {
      if (isConversationDone) {
        await updateConversationDone({
          conversation_id: Number(conversation_id),
          is_done: !isConversationDone,
        });
      }

      sendIndividualMessage(conversation_id);
      return;
    }

    const {
      initializeConversationFn,
      shouldSendIndividually,
      soloConversations,
      selectedIds,
    } = newConversationProps;

    if (!shouldSendIndividually) {
      const newGroupConversationId = await initializeConversationFn();

      if (!newGroupConversationId) {
        toast.error("Unable to get conversation detail");
        return;
      }

      const res = await createMessage.mutateAsync({
        conversationId: Number(newGroupConversationId),
        content: message,
        userId: user?.id!,
      });
      setMessage("");

      if (res.error != null) {
        toast.error("Error processing messages, reload the page and try again");
        return;
      }

      invalidateInboxViews(queryClient);
      toast.success("Message created");
      router.push(`/inbox/${newGroupConversationId}`);
    } else {
      // send individually

      for (let i = 0; i < selectedIds.length; i++) {
        const assignee = selectedIds[i];

        const hasExistingConversation = soloConversations[assignee];

        const conversationId = hasExistingConversation
          ? hasExistingConversation.conversation_id
          : await initializeConversationFn(assignee);

        if (conversationId) {
          await sendIndividualMessage(conversationId);
        }

        if (i === selectedIds.length - 1) {
          router.push(`/inbox/${conversationId}`);
        }
      }
    }
  };

  return (
    <div className="">
      {filenameId && (
        <FileAttachmentSend
          filenameId={filenameId}
          onDelete={() => {
            setFilenameId(undefined);
          }}
        />
      )}
      <textarea
        name="chat-message"
        id="chat-message"
        className="resize-none p-0 pb-2 focus:outline-none focus:border-t-green-500 focus:ring-0 sm:text-sm block h-24 w-full pt-2.5 text-lg font-medium bg-white placeholder:text-sm placeholder:leading-5 placeholder:font-bold border-0 border-t border-t-green-500"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="justify-between flex flex-row content-center border-t border-b border-gray-200 py-1">
        {conversation_id && (
          <div className="flex flex-row space-x-5 pt-3 pl-1">
            <AttachmentPopover onSelectAttachment={setFilenameId} />
          </div>
        )}
        <button
          type="submit"
          className="flex flex-row items-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none"
          onClick={onSubmit}
        >
          <FontAwesomeIcon
            icon={createMessage.isLoading ? faSpinner : faPaperPlane}
            className={`${
              createMessage.isLoading ? "animate-spin" : ""
            } text-white mr-2.5`}
          />
          <p className="text-sm leading-5 font-medium text-white">Send</p>
        </button>
      </div>
      <div className="flex justify-end text-xs leading-4 text-gray-600 font-normal mt-2 mb-2">
        Note: the recipient(s) will receive an email notification, and they may
        respond directly to the email to reply to your message.
      </div>
    </div>
  );
}

export function ChatBodyList({
  conversationData,
}: {
  conversationData: InboxConversationView;
}) {
  const user = useGlobalState((s) => s.supabaseUser);
  const queryClient = useQueryClient();
  const mutation = useMutation(setMessagesRead, {
    onSuccess: (res) => {
      if (res.error == null) {
        invalidateInboxViews(queryClient);
      } else {
        toast.error("Error processing messages, reload the page and try again");
      }
    },
  });

  const { all_messages, all_conversation_changes, users_in_conv } =
    conversationData;

  const { allMessages, allUpdates } = useMemo(() => {
    const allMessages = all_messages ?? [];
    const allConversationChanges = all_conversation_changes ?? [];
    const allUpdates = [...allMessages, ...allConversationChanges];
    allUpdates.sort((a, b) =>
      compareDesc(new Date(b.created_at!), new Date(a.created_at!))
    );

    return { allMessages, allConversationChanges, allUpdates };
  }, [all_conversation_changes, all_messages]);

  const unreadMessages = getUnreadMessages(allMessages, user?.id!);

  useEffect(() => {
    let readTimer: null | NodeJS.Timeout = null;

    if (unreadMessages.length > 0) {
      readTimer = setTimeout(() => {
        mutation.mutate(
          unreadMessages.map((message) => ({
            message_id: message.id,
            user_id: user?.id!,
          }))
        );
      }, 1000);
    }

    return () => {
      if (readTimer) clearTimeout(readTimer);
    };
  }, [allMessages, mutation, unreadMessages, user?.id]);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allUpdates]);

  return (
    <div
      className="flex h-full flex-col flex-nowrap overflow-y-auto"
      ref={containerRef}
    >
      {allUpdates.map((update, index) => {
        const { created_at } = update;
        let dateDivider: React.ReactNode | null = null;
        if (index === 0) {
          dateDivider = <DateDivider date={created_at!} />;
        } else {
          const previousUpdateCreatedAt = new Date(
            allUpdates[index - 1].created_at!
          );
          const currentCreatedAt = new Date(created_at!);

          if (!isSameDay(previousUpdateCreatedAt, currentCreatedAt)) {
            dateDivider = <DateDivider date={created_at!} />;
          }
        }

        const body =
          "content" in update ? (
            <ChatBody chatContent={update} />
          ) : (
            <ChatUpdate update={update} usersInConv={users_in_conv ?? []} />
          );

        return (
          <React.Fragment key={update.id}>
            {dateDivider}
            {body}
          </React.Fragment>
        );
      })}
      {conversationData.is_marked_done && (
        <div className="flex justify-center text-gray-400 text-sm leading-5 font-normal m-2">
          <span>
            This conversation has been{" "}
            <span className="font-semibold">marked done.</span>
          </span>
        </div>
      )}
    </div>
  );
}

function getUnreadMessages(
  conversationMessages: ConversationMessage[],
  userId: string
) {
  return conversationMessages.filter((message) => {
    const hasReadReceipt = message.all_read_receipts?.some(
      (read_receipt) => read_receipt.read_by_user_id === userId
    );
    return !hasReadReceipt;
  });
}

function FileAttachmentSend({
  filenameId,
  onDelete,
}: {
  filenameId: number;
  onDelete: () => void;
}) {
  const { data: fileRes } = useQuery({
    queryKey: ["FileAttachmentSend", filenameId],
    queryFn: () => getAttachemntInfo(filenameId),
  });

  const file = fileRes?.data;
  if (file == null) return null;

  return (
    <div className="flex flex-row justify-between items-center py-3 border-t border-t-green-600">
      <div className="flex">
        <div className="flex items-center mr-3">
          <FontAwesomeIcon icon={faPaperclip} />
        </div>
        <div>
          <div className="flex items-center text-sm leading-5">
            {file.filename}.{file.attachment_type}
            <span className="mx-0.5">•</span>
            <span className="font-semibold text-green-700">Version 1</span>
            <span className="mx-0.5">•</span>
            <span className="text-xs leading-4 font-normal text-gray-400">
              {file.size_in_bytes! / 1000} kb
            </span>
          </div>
          <div className="text-gray-400 text-xs leading-4 font-normal mt-0.5">
            Attached
          </div>
        </div>
      </div>
      <button onClick={onDelete}>
        <FontAwesomeIcon icon={faX} fontSize={13} />
      </button>
    </div>
  );
}

export default IndividualChat;
