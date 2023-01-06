import ChatList from "./ChatList";
import IndividualChat from "./IndividualChat";
import { useGlobalState } from "www/shared/modules/global_context";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { fetchInboxView, InboxQueryKey } from "./Inbox.fetchers";
import { EditConversation } from "./EditConversation";
import { useMemo } from "react";
import { ConversationPreview } from "types/views";
import { useDebounce } from "www/shared/utils/hooks/useDebounce";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import {
  useFilenamesForDeals,
  useInboxFilterQueryParams,
} from "./InboxPopover";

export function Inbox() {
  const user = useGlobalState((s) => s.supabaseUser);
  const router = useRouter();
  const conversation_ids = router.query.conversation_id as string[];
  // Add slightly debounce so we can batch changes in the same inboxView query
  const inboxFilterQueryParams = useDebounce(useInboxFilterQueryParams(), 500);

  const fileNames = useFilenamesForDeals();
  const { data: inboxRes } = useQuery({
    queryKey: [InboxQueryKey.InboxView, user?.id, inboxFilterQueryParams],
    queryFn: () => {
      return fetchInboxView({
        userId: user?.id!,
        ...inboxFilterQueryParams,
        allAttachmentIds: fileNames.map((file) => file.id),
      });
    },
  });

  const inboxConversations = useMemo(() => {
    // The data for inbox has redundant conversation info because some convos
    // can have multiple deals. We need a unique array of those conversations to
    // fetch the ChatList

    const convoIdToConversationData = {} as Record<number, ConversationPreview>;
    inboxRes?.data?.forEach((convoWithDealInfo) => {
      const conversation_id = convoWithDealInfo.conversation_id!;

      if (!convoIdToConversationData[conversation_id]) {
        convoIdToConversationData[conversation_id] = {
          ...(convoWithDealInfo as ConversationPreview),
        };
      }
    });

    return Object.values(convoIdToConversationData);
  }, [inboxRes?.data]);

  const conversationId = conversation_ids?.[0];
  const isNewConversation =
    conversationId === "new" ||
    (inboxConversations?.length === 0 && !conversationId);
  const isUpdatingConversation = conversationId === "edit";
  const isEditingConversation = isNewConversation || isUpdatingConversation;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 mt-5 w-[83.33%]">
      <div className="flex space-x-4 w-full">
        {inboxConversations && (
          <>
            <ChatList chatList={inboxConversations ?? []} />
            {!isEditingConversation && conversationId && <IndividualChat />}
          </>
        )}
        {isEditingConversation && router.isReady && (
          <EditConversation
            mode={isNewConversation ? "new" : "update"}
            inboxConversations={inboxConversations || []}
          />
        )}
      </div>
    </div>
  );
}

export default function InboxWrapper() {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
      <Inbox />
    </Worker>
  );
}
