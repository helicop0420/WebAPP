import { db } from "www/shared/modules/supabase";

// create post comment
export const postDiscussion = async ({
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
      type: "FAQ",
      is_private: true,
    })
    .single();
};

// like a discussion
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
export const changeCommentPrivacy = async ({
  // commentId,
  // dealId,
  // privateStatus,
  updatedChat,
}: {
  // commentId: number;
  // dealId: number;
  // privateStatus: boolean;
  updatedChat: {
    id: number;
    user_id: string;
    comment: string;
    deal_id: number;
    is_private: boolean;
  }[];
}) => {
  return await db.deal_comments().upsert([...updatedChat]);
  // .single();
};
