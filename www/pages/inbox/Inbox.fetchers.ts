import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { QueryClient } from "react-query";
import { db } from "www/shared/modules/supabase";
import { useInboxFilterQueryParams } from "./InboxPopover";

export enum InboxQueryKey {
  ConversationView = "ConversationView",
  InboxView = "InboxView",
  FriendsView = "FriendsView",
  PrivateNotesView = "PrivateNotesView",
}

export const fetchFriendsView = async (userId: string) => {
  if (!userId) {
    // TODO: redirect to login?
    throw Error("userId is required");
  }

  return await db.friends_list_view().select().eq("from_user_id", userId);
};

export const fetchInboxConversationView = async (
  userId: string,
  conversationId: string
) => {
  if (!userId) {
    // TODO: redirect to login?
    throw Error("userId is required");
  }
  if (!conversationId) {
    throw Error("conversationId is required");
  }

  return await db
    .inbox_conversation_view()
    .select()
    .eq("for_user_id", userId)
    .filter("conversation_id", "eq", Number(conversationId))
    .limit(1)
    .single();
};

export const fetchInboxView = async ({
  userId,
  dealIds,
  showArchivedConversations,
  interestLevels,
  indicatedInterestYes,
  indicatedInterestNo,
  showNoAttachments,
  attachmentIdsExcluded,
  allAttachmentIds,
}: {
  userId: string;
  allAttachmentIds: number[];
} & ReturnType<typeof useInboxFilterQueryParams>) => {
  if (!userId) {
    throw Error("userId is required");
  }

  let inboxFilters = db.inbox_page_view_v2().select().eq("user_id", userId);

  if (dealIds.length > 0) {
    inboxFilters = inboxFilters.in("deal_id", dealIds);
  }

  if (!showArchivedConversations) {
    inboxFilters = inboxFilters.eq("is_marked_done", false);
  }

  if (interestLevels.length > 0) {
    inboxFilters = inboxFilters.in("interest_level", interestLevels);
  }

  if (indicatedInterestYes || indicatedInterestNo) {
    const interestFilters = [];
    if (indicatedInterestYes)
      interestFilters.push("expressed_interest.eq.true");
    if (indicatedInterestNo)
      interestFilters.push("expressed_interest.eq.false");

    inboxFilters = inboxFilters.or(interestFilters.join(","));
  }

  const attachmentIds = allAttachmentIds.filter((id) => {
    const shouldExclude = attachmentIdsExcluded.includes(id);
    if (shouldExclude) {
      return false;
    }

    return true;
  });

  if (attachmentIds.length > 0 || showNoAttachments) {
    const attachmentIdFilters = attachmentIds.map((attachmentId) => {
      return `attachment_ids_in_convo.cs.{"${attachmentId}"}`;
    });

    if (showNoAttachments) {
      attachmentIdFilters.push("attachment_ids_in_convo.is.null");
    }

    inboxFilters = inboxFilters.or(attachmentIdFilters.join(","));
  }

  return await inboxFilters;
};

export const fetchUserProfile = async (userId: string) => {
  return await db.user_profiles().select().eq("user_id", userId).single();
};

export const setMessagesRead = async (
  messages: { message_id: number; user_id: string }[]
) => {
  return await db.message_read_receipts().insert(messages);
};

export const createConversation = async ({ title }: { title: string }) => {
  return await db.conversations().insert({ title }).limit(1).single();
};

export const createUserAssosciations = async ({
  userIds,
  conversationId,
}: {
  userIds: string[];
  conversationId: number;
}) => {
  return await db.conversation_to_user_associations().insert(
    userIds.map((userId) => ({
      user_id: userId,
      conversation_id: Number(conversationId),
    }))
  );
};

export const createMessageInConversation = async ({
  conversationId,
  content,
  userId: authorUserId,
  dealAttachmentId,
}: {
  conversationId: number;
  content: string;
  userId: string;
  dealAttachmentId?: number;
}) => {
  const res = await db
    .messages()
    .insert({
      content,
      conversation_id: conversationId,
      user_id: authorUserId,
      deal_attachment_id: dealAttachmentId,
    })
    .single();

  const newMessageId = res.data?.id;
  if (newMessageId) {
    await setMessagesRead([
      { message_id: newMessageId, user_id: authorUserId },
    ]);
  }

  return res;
};

export const fetchPrivateNote = async (userId: string, dealId: number) => {
  return (await db
    .private_notes()
    .select("*, last_edit_by_user_id(first_name, last_name, profile_pic_url)")
    .eq("user_id", userId)
    .eq("deal_id", dealId)
    .single()) as PostgrestSingleResponse<{
    id: number;
    deal_id: number;
    user_id: string;
    note: string;
    created_at: string | null;
    updated_at: string | null;
    last_edit_by_user_id: {
      first_name: string | null;
      last_name: string | null;
      profile_pic_url: string | null;
    };
  }>;
};

export const upsertPrivateNote = async ({
  noteId,
  dealId,
  forUserId,
  authorUserId,
  content,
}: {
  noteId?: number;
  dealId: number;
  forUserId: string;
  authorUserId: string;
  content: string;
}) => {
  return await db
    .private_notes()
    .upsert(
      {
        id: noteId,
        deal_id: dealId,
        note: content,
        last_edit_by_user_id: authorUserId,
        user_id: forUserId,
      },
      { onConflict: "id" }
    )
    .single();
};

export const invalidateInboxViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(InboxQueryKey.ConversationView);
  queryClient.invalidateQueries(InboxQueryKey.InboxView);
};

export const getAttachemntInfo = async (filenameId: number) => {
  let attachmentRes = await db
    .deal_attachments()
    .select()
    .eq("deal_filename_id", filenameId)
    .single();

  let filenameRes = await db
    .deal_filenames()
    .select()
    .eq("id", filenameId)
    .single();

  return {
    ...attachmentRes,
    data: {
      ...attachmentRes.data,
      ...filenameRes.data,
    },
  };
};
