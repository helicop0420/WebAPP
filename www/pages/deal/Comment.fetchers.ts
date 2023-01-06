import { db } from "www/shared/modules/supabase";

export const replyComment = async ({
  userId,
  dealId,
  comment,
  replyingToCommentId,
  is_private,
}: {
  userId: string;
  dealId: number;
  comment: string;
  replyingToCommentId: number | null;
  is_private: boolean;
}) => {
  return await db
    .deal_comments()
    .insert({
      user_id: userId,
      deal_id: dealId,
      comment,
      type: "FAQ",
      is_private: is_private,
      replying_to_comment_id: replyingToCommentId,
    })
    .single();
};
