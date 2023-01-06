import { db } from "www/shared/modules/supabase";

// create post comment
export const postAnnouncement = async ({
  userId,
  dealId,
  comment,
}: {
  userId: string;
  dealId: number;
  comment: string;
}) => {
  return await db
    .deal_comments()
    .insert({
      user_id: userId,
      deal_id: dealId,
      comment,
      type: "ANNOUNCEMENT",
      is_private: false,
    })
    .single();
};
// like a n announcement
export const likeComment = async ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: number;
}) => {
  return await db
    .deal_comment_likes()
    .insert({
      user_id: userId,
      deal_comment_id: commentId,
    })
    .single();
};

// change comment privacy
export const changeAnnouncementPrivacy = async ({
  commentId,
  dealId,
  privateStatus,
}: {
  commentId: number;
  dealId: number;
  privateStatus: boolean;
}) => {
  return await db
    .deal_comments()
    .update({
      id: commentId,
      deal_id: dealId,
      is_private: privateStatus,
    })
    .single();
};
