import { db } from "www/shared/modules/supabase";
import { createUserAssosciations } from "./Inbox.fetchers";

export const updateConversationTitle = async ({
  title,
  conversation_id,
}: {
  title: string;
  conversation_id: number;
}) => {
  const res = await db
    .conversations()
    .update({ title })
    .eq("id", conversation_id);

  await db
    .conversation_changes()
    .insert({ conversation_id: conversation_id, renamed_to: title });

  return res;
};

export const updateUserAssosciations = async ({
  ids_to_add,
  ids_to_remove,
  conversation_id,
}: {
  ids_to_add: string[];
  ids_to_remove: string[];
  conversation_id: number;
}) => {
  if (ids_to_remove.length > 0) {
    await db
      .conversation_to_user_associations()
      .delete()
      .eq("conversation_id", conversation_id)
      .in("user_id", ids_to_remove);

    await db.conversation_changes().insert(
      ids_to_remove.map((id) => ({
        conversation_id: conversation_id,
        removed_user_id: id,
      }))
    );
  }

  if (ids_to_add.length > 0) {
    await createUserAssosciations({
      userIds: ids_to_add,
      conversationId: conversation_id,
    });

    await db.conversation_changes().insert(
      ids_to_add.map((id) => ({
        conversation_id: conversation_id,
        added_user_id: id,
      }))
    );
  }
};

export const updateConversationDone = async ({
  is_done,
  conversation_id,
}: {
  is_done: boolean;
  conversation_id: number;
}) => {
  const res = await db
    .conversations()
    .update({ is_marked_done: is_done })
    .eq("id", conversation_id);

  return res;
};
