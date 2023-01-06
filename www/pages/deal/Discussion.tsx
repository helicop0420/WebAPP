import Comment from "./Comment";
import Image from "next/future/image";
import { DealComment } from "types/views";
import { useGlobalState } from "www/shared/modules/global_context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/pro-regular-svg-icons";
import { useMutation, useQueryClient } from "react-query";
import {
  changeCommentPrivacy,
  likeComment,
  postDiscussion,
} from "./Discussion.fetchers";
import { invalidateDealViews } from "./Deal.fetchers";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import TextArea from "www/shared/components/form_inputs/TextArea";

interface DiscussionProps {
  comments: null | DealComment[];
  replies: null | DealComment[];
  isDealOwner: boolean;
  dealId: number;
}
type Inputs = {
  comment: string;
};
const Discussion = ({
  comments,
  replies,
  isDealOwner,
  dealId,
}: DiscussionProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const userProfile = useGlobalState((s) => s.userProfile);
  const queryClient = useQueryClient();
  const postDiscussionMutation = useMutation(postDiscussion);
  const likeCommentMutation = useMutation(likeComment);
  const privacyChangeMutation = useMutation(changeCommentPrivacy);
  const submitDiscussionComment: SubmitHandler<Inputs> = async (data) => {
    const response = await postDiscussionMutation.mutateAsync({
      comment: data.comment,
      dealId: dealId,
      userId: userProfile?.user_id as string,
    });
    if (response?.data) {
      invalidateDealViews(queryClient);
      toast.success("Comment added successfully");
      setValue("comment", "");
    }
    if (response?.error) {
      toast.error("Error adding comment");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };
  // comment on announcement
  const onCommentLike = async (commentId: number) => {
    const response = await likeCommentMutation.mutateAsync({
      commentId: commentId,
      userId: userProfile?.user_id as string,
    });
    if (response?.data) {
      invalidateDealViews(queryClient);
      toast.success("Comment liked successfully");
    }
    if (response?.error) {
      toast.error("Error liking comment");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };
  // change announcement privacy
  const onPrivacyChangeClick = async (
    commentId: number,
    privateStatus: boolean
  ) => {
    let ids: number[] = [commentId];
    // recursive function for geting replying ids
    const getReplyingIds = (commentId: number) => {
      replies?.map((reply) => {
        if (reply.replying_to_comment_id === commentId) {
          ids.push(reply.id);
          getReplyingIds(reply.id);
        }
      });
    };
    getReplyingIds(commentId);
    let list = replies ? comments?.concat(replies) : comments;
    let updatedChat = list
      ?.filter((comment) => ids.find((id) => id === comment.id))
      .map((comment) => ({
        id: comment.id,
        is_private: !privateStatus,
        user_id: comment.user_id,
        comment: comment.comment,
        deal_id: dealId,
      }));
    const response = await privacyChangeMutation.mutateAsync({
      updatedChat: updatedChat ?? [],
    });
    if (response?.data) {
      invalidateDealViews(queryClient);
      toast.success("Privacy changed successfully");
    }
    if (response?.error) {
      toast.error("Error changing Privacy");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };
  return (
    <section aria-labelledby="">
      <div className="bg-white sm:overflow-hidden sm:rounded-lg mx-4 px-6 pb-3">
        <div className="divide-y divide-gray-200">
          <div className="px-4 py-1 sm:px-6">
            <ul role="list" className="space-y-8">
              {comments &&
                comments.map((comment, index) => {
                  return (
                    <div key={comment.id}>
                      <Comment
                        comment={comment}
                        isLast={index + 1 === comments.length}
                        isSubComment={
                          comment.replying_to_comment_id ? true : false
                        }
                        hasReply={
                          replies &&
                          replies.filter(
                            (reply) =>
                              reply.replying_to_comment_id === comment.id
                          ).length > 0
                            ? true
                            : false
                        }
                        onLikeClick={onCommentLike}
                        type="discussion"
                        onPrivacyChangeClick={() => {
                          onPrivacyChangeClick(comment.id, comment.is_private);
                        }}
                        isDealOwner={isDealOwner}
                        dealId={dealId}
                        replyingId={comment.id}
                      />
                      {replies &&
                        replies
                          .filter(
                            (reply) =>
                              reply.replying_to_comment_id == comment.id
                          )
                          .map((subComment, subIndex) => (
                            <div key={subComment.id} className="mt-6">
                              <Comment
                                comment={subComment}
                                isLast={
                                  subIndex + 1 ===
                                  replies.filter(
                                    (reply) =>
                                      reply.replying_to_comment_id ===
                                      comment.id
                                  ).length
                                }
                                hasReply={
                                  replies &&
                                  replies.filter(
                                    (reply) =>
                                      reply.replying_to_comment_id ===
                                      subComment.id
                                  ).length > 0
                                    ? true
                                    : false
                                }
                                isSubComment={true}
                                onLikeClick={onCommentLike}
                                type="discussion"
                                onPrivacyChangeClick={() => {
                                  onPrivacyChangeClick(
                                    comment.id,
                                    comment.is_private
                                  );
                                }}
                                isDealOwner={isDealOwner}
                                dealId={dealId}
                                replyingId={subComment.id as number}
                                replies={
                                  replies &&
                                  replies.filter(
                                    (reply) => reply.id != subComment.id
                                  )
                                }
                              />
                            </div>
                          ))}
                    </div>
                  );
                })}
            </ul>
          </div>
        </div>
        {(comments === null || comments.length === 0) && (
          <div className="flex justify-center flex-col items-center pt-[26px] pb-12">
            <FontAwesomeIcon
              icon={faComments}
              className="text-gray-500 text-2xl "
            />
            <p className="text-base leading-6 font-semibold mt-3">
              No Comments Yet
            </p>
            <p className="text-sm leading-5 font-normal mt-1">
              Be the first to ask a question!
            </p>
          </div>
        )}
        <div className="bg-white px-4 pt-6  sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0 overflow-hidden min-h-[40px] min-w-[40px]">
              <Image
                className="rounded-full w-[40px] h-[40px] object-cover"
                src={userProfile?.profile_pic_url ?? "/images/avatar.png"}
                // src={user.imageUrl}
                alt=""
                width={40}
                height={40}
              />
            </div>
            <div className="min-w-0 flex-1">
              <form onSubmit={handleSubmit(submitDiscussionComment)}>
                <div>
                  <label htmlFor="comment" className="sr-only">
                    About
                  </label>
                  <TextArea
                    id="comment"
                    rows={3}
                    className="resize-none block w-full rounded-md bg-white border-gray-300 border shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm p-3"
                    placeholder="Ask a question"
                    defaultValue={""}
                    {...register("comment", { required: true })}
                    error={errors.comment ? true : false}
                  />
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm  focus:outline-none   hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border"
                    type="submit"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discussion;
