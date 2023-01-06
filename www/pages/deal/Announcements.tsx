import Comment from "./Comment";
import { DealComment } from "types/views";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMegaphone } from "@fortawesome/pro-light-svg-icons";
import Image from "next/image";
import { useGlobalState } from "www/shared/modules/global_context";
import { useMutation, useQueryClient } from "react-query";
import {
  changeAnnouncementPrivacy,
  likeComment,
  postAnnouncement,
} from "./Annoucements.fetchers";
import { useForm, SubmitHandler } from "react-hook-form";
import TextArea from "www/shared/components/form_inputs/TextArea";
import { toast } from "react-toastify";
import { invalidateDealViews } from "./Deal.fetchers";

interface AnnouncementProps {
  comments: null | DealComment[];
  replies: null | DealComment[];
  isDealOwner: boolean;
  dealId: number;
}
type Inputs = {
  comment: string;
};
const Announcements = ({
  comments,
  replies,
  isDealOwner,
  dealId,
}: AnnouncementProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const userProfile = useGlobalState((s) => s.userProfile);
  const queryClient = useQueryClient();

  const postAnnouncementsMutation = useMutation(postAnnouncement);
  const likeCommentMutation = useMutation(likeComment);
  const changeAnnouncementPrivacyMutation = useMutation(
    changeAnnouncementPrivacy
  );
  // create announcement post
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await postAnnouncementsMutation.mutateAsync({
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
    console.log("hello world...");
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
    console.log("about changing announcement privacy...");
    const response = await changeAnnouncementPrivacyMutation.mutateAsync({
      commentId: commentId,
      privateStatus: !privateStatus,
      dealId: dealId,
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
          <div className="px-4 py-6 sm:px-6">
            <ul role="list" className="space-y-8">
              {comments &&
                comments.map((comment, index) => {
                  return (
                    <div key={comment.id}>
                      <>
                        <Comment
                          comment={comment}
                          isLast={index + 1 === comments?.length}
                          isSubComment={
                            typeof comment.replying_to_comment_id === "number"
                              ? true
                              : false
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
                          type="announcement"
                          onPrivacyChangeClick={onPrivacyChangeClick}
                          isDealOwner={isDealOwner}
                          dealId={dealId}
                        />
                        {replies &&
                          replies
                            .filter(
                              (reply) =>
                                reply.replying_to_comment_id == comment.id
                            )
                            .map((subComment, subIndex) => (
                              <div key={subComment.id} className="mt-7">
                                <Comment
                                  comment={subComment}
                                  isLast={
                                    subIndex + 1 ===
                                    replies.filter(
                                      (reply) =>
                                        reply.replying_to_comment_id ==
                                        comment.id
                                    ).length
                                  }
                                  isSubComment={true}
                                  onLikeClick={onCommentLike}
                                  type="announcement"
                                  onPrivacyChangeClick={onPrivacyChangeClick}
                                  isDealOwner={isDealOwner}
                                  dealId={dealId}
                                />
                              </div>
                            ))}
                      </>
                    </div>
                  );
                })}
            </ul>
            {(comments === null || comments.length === 0) && (
              <div className="flex justify-center flex-col items-center pt-[26px] pb-12">
                <FontAwesomeIcon
                  icon={faMegaphone}
                  className="text-gray-500 text-2xl "
                />
                <p className="text-base leading-6 font-semibold mt-3">
                  No Announcement Yet
                </p>
              </div>
            )}
            {isDealOwner && (
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <label htmlFor="comment" className="sr-only">
                          About
                        </label>
                        <TextArea
                          id="comment"
                          rows={3}
                          className="resize-none block w-full rounded-md bg-white border-gray-300 border shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm p-3"
                          placeholder="Post an announcement"
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
