import Image from "next/future/image";
import { DealComment, Likes } from "types/views";
import { intlFormatDistance } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLock, faGlobe } from "@fortawesome/pro-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/pro-regular-svg-icons";
import Popover from "www/shared/components/popover";
import UserList from "www/shared/components/user_list";
import { useState } from "react";
import TextArea from "www/shared/components/form_inputs/TextArea";
import { useForm, SubmitHandler } from "react-hook-form";
import { invalidateDealViews } from "./Deal.fetchers";
import { useMutation, useQueryClient } from "react-query";
import { replyComment } from "./Comment.fetchers";
import { toast } from "react-toastify";
import { useGlobalState } from "www/shared/modules/global_context";
import ReactTooltip from "react-tooltip";
import { classNames } from "www/shared/utils";
type Inputs = {
  comment: string;
};
interface CommentProps {
  comment: DealComment;
  isLast: boolean;
  isSubComment: boolean;
  hasReply?: boolean;
  onLikeClick: (commentId: number) => void;
  onPrivacyChangeClick: (commentId: number, privateStatus: boolean) => void;
  type: "discussion" | "announcement";
  isDealOwner: boolean;
  dealId: number;
  replyingId?: number;
  replies?: DealComment[] | null;
}
const Comment = ({
  comment,
  isLast,
  isSubComment,
  hasReply,
  onLikeClick,
  type,
  onPrivacyChangeClick,
  isDealOwner,
  dealId,
  replyingId,
  replies,
}: CommentProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const userProfile = useGlobalState((s) => s.userProfile);
  const queryClient = useQueryClient();
  const postAnnouncementsMutation = useMutation(replyComment);

  const likedUsers = comment.likes
    ? comment.likes.map((item) => ({
        subtitle: item.subtitle,
        firstName: item.first_name,
        handle: item.handle,
        lastName: item.last_name,
        profilePicUrl: item.profile_pic_url,
      }))
    : null;
  const isLiked = (likes: Likes[] | null) => {
    if (likes) {
      return likes.some((item) => item.user_id === userProfile?.user_id);
    }
    return false;
  };
  const [showReplyBox, setShowReplyBox] = useState(false);
  const createReply: SubmitHandler<Inputs> = async (data) => {
    const response = await postAnnouncementsMutation.mutateAsync({
      comment: data.comment,
      dealId: dealId,
      userId: userProfile?.user_id as string,
      replyingToCommentId: replyingId as number,
      is_private: comment.is_private,
    });
    if (response?.data) {
      setShowReplyBox(false);
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
  // some magic needs to be done in here, if there is a replyingt- id the should
  //  run as it is now but if ot it should look liike a single comment, i.e the main comment
  return (
    <>
      <li key={comment.id}>
        <div className="flex space-x-3 w-full">
          <div className="flex-shrink-0 min-w-[40px] min-h-[40px]">
            <Image
              className="rounded-full h-10 w-10"
              src={comment.profile_pic_url ?? ""}
              alt=""
              width={40}
              height={40}
            />
          </div>
          {hasReply || (isSubComment && !isLast) ? (
            <div className="relative">
              <span
                className="absolute top-14 -left-8 -ml-px h-1/2 w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            </div>
          ) : null}
          <div
            className={classNames(
              !hasReply && isSubComment && isLast ? "pl-6" : "",
              isSubComment ? "pl-3 w-full" : "w-full"
            )}
          >
            <div className="text-sm">
              <a
                href=""
                className="font-medium text-gray-900 text-sm leading-5"
              >
                {comment.first_name} {comment.last_name}
              </a>{" "}
              {comment.is_private && (
                <>
                  <span className="inline-flex items-center rounded-full bg-transparent border border-green-700 px-1 py-0.5  font-medium text-green-800 text-xs leading-4 ml-1 hover:cursor-default">
                    <p className="" data-tip data-for="global">
                      PRIVATE
                    </p>
                  </span>
                </>
              )}{" "}
              {comment.created_at && (
                <p className="text-gray-500 text-sm leading-5 font-normal">
                  commented{"  "}
                  <time>
                    {intlFormatDistance(
                      new Date(comment.created_at),
                      new Date(),
                      {
                        style: "short",
                        numeric: "always",
                      }
                    )}
                  </time>
                </p>
              )}{" "}
            </div>
            <div className="mt-3 text-sm text-gray-700 leading-5 font-normal">
              <p>{comment.comment}</p>
            </div>
            <div className="mt-3 text-sm flex flex-row items-center gap-1 space-x-4">
              <span className="flex gap-1.5 items-center group-hover:bg-red-600 group/icon hover:cursor-pointer">
                {isLiked(comment.likes) ? (
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-green-700 hover:text-green-700 mr-1"
                  />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-current  hover:text-green-700 mr-1 hidden group-hover/icon:block"
                      onClick={() => {
                        onLikeClick(comment.id);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faHeartOutline}
                      className="text-gray-500 hover:text-green-700 mr-1  group-hover/icon:hidden"
                      onClick={() => {
                        onLikeClick(comment.id);
                      }}
                    />
                  </>
                )}
                {/* <FontAwesomeIcon
                icon={faHeart}
                className="text-green-700 hover:text-green-700 mr-1"
              /> */}
                <Popover element={<UserList users={likedUsers} />}>
                  <p className="text-gray-500 text-sm leading-5 font-normal">
                    {comment.likes_count}
                  </p>
                </Popover>
              </span>
              {/* <FontAwesomeIcon icon={faReply} className="text-gray-400 stroke-gray-400 h-[18px] w-[18px] mr-1" /> */}
              {type === "discussion" && !hasReply && (
                <button
                  type="button"
                  className="text-gray-500 text-sm leading-5 font-normal"
                  onClick={() => {
                    setShowReplyBox(!showReplyBox);
                  }}
                >
                  Reply
                </button>
              )}
              {isDealOwner && (
                <ChangePrivacyComponent
                  type={type}
                  isLast={isLast}
                  hasReply={hasReply}
                  isPrivate={comment.is_private}
                  commentId={comment.id}
                  isSubComment={isSubComment}
                  onPrivacyChangeClick={onPrivacyChangeClick}
                />
              )}
            </div>
            {showReplyBox && (
              <div className="min-w-0 flex-1 w-full">
                <form onSubmit={handleSubmit(createReply)}>
                  <div>
                    <label htmlFor="comment" className="sr-only">
                      About
                    </label>
                    <TextArea
                      id="comment"
                      rows={3}
                      className="resize-none block w-full rounded-md bg-white border-gray-300 border shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm p-3"
                      placeholder="Post a reply"
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
                      Reply
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        <ReactTooltip
          id="global"
          aria-haspopup="true"
          place="right"
          arrowColor="transparent"
          backgroundColor="transparent"
        >
          <div className="bg-gray-900 text-gray-500 text-xs px-3 py-2 rounded-md w-[192px]">
            <p className="text-sm leading-5 font-medium text-white">
              Private post
            </p>
            <p className=" text-sm leading-5 font-normal text-gray-200 mt-[10px]">
              This post is private, meaning it’s only visible to sponsors on the
              deal and the author of the post.
            </p>
          </div>
        </ReactTooltip>
      </li>
      {hasReply && (
        <div className="mt-6">
          {replies &&
            replies.length > 0 &&
            replies
              .filter((reply) => reply.replying_to_comment_id === comment.id)
              .map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  isLast={true}
                  isSubComment={true}
                  // isSubComment={comment.replying_to_comment_id ? true : false}
                  hasReply={
                    replies &&
                    replies.filter(
                      (reply) => reply.replying_to_comment_id === comment.id
                    ).length > 0
                      ? true
                      : false
                  }
                  onLikeClick={onLikeClick}
                  type="discussion"
                  onPrivacyChangeClick={onPrivacyChangeClick}
                  isDealOwner={isDealOwner}
                  dealId={dealId}
                  replyingId={comment.id}
                  replies={replies}
                />
              ))}
        </div>
      )}
    </>
  );
};

export default Comment;

const ChangePrivacyComponent = ({
  type,
  isLast,
  hasReply,
  isPrivate,
  commentId,
  isSubComment,
  onPrivacyChangeClick,
}: {
  commentId: number;
  isLast: boolean;
  hasReply: boolean | undefined;
  isPrivate: boolean;
  type: "discussion" | "announcement";
  isSubComment?: boolean;
  onPrivacyChangeClick: (commentId: number, isPrivate: boolean) => void;
}) => {
  // const isCommentPrivate = (isPrivate: boolean) => (isPrivate ? true : false);
  const isThereComments = (status: boolean | undefined) =>
    status ? true : false;
  const isLastComment = (isLast: boolean) => (isLast ? true : false);
  return (
    <>
      {!isThereComments(hasReply) && (
        <span>
          {type === "discussion" && isLastComment(isLast) ? (
            <span>
              <PrivacyToggler
                onPrivacyChangeClick={onPrivacyChangeClick}
                commentId={commentId}
                isPrivate={isPrivate}
                isSubComment={isSubComment}
              />
            </span>
          ) : (
            <span>
              <PrivacyToggler
                onPrivacyChangeClick={onPrivacyChangeClick}
                commentId={commentId}
                isPrivate={isPrivate}
                isSubComment={isSubComment}
              />
            </span>
          )}
        </span>
      )}
    </>
  );
};

const PrivacyToggler = ({
  onPrivacyChangeClick,
  commentId,
  isPrivate,
  isSubComment,
}: {
  commentId: number;
  isPrivate: boolean;
  onPrivacyChangeClick: (commentId: number, isPrivate: boolean) => void;
  isSubComment: boolean | undefined;
}) => {
  return (
    <p
      className="text-sm leading-5 font-normal text-gray-500 cursor-pointer"
      onClick={() => {
        onPrivacyChangeClick(commentId, isPrivate);
      }}
    >
      {" "}
      <FontAwesomeIcon
        icon={isPrivate ? faGlobe : faLock}
        className="text-gray-500  mr-3"
      />
      Make {isSubComment && "thread"} {isPrivate ? "Public" : "Private"}
    </p>
  );
};
