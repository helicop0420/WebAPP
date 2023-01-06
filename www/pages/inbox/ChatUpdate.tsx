import Link from "next/link";
import { InboxConversationChange, UsersInConversation } from "types/views";
import { getFullName } from "www/shared/utils";

enum ConversationChangeType {
  Rename = "Rename",
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
}

const getUpdateText: Record<ConversationChangeType, string> = {
  [ConversationChangeType.Rename]: "Conversation renamed to ",
  [ConversationChangeType.AddUser]: " was added to the conversation",
  [ConversationChangeType.RemoveUser]: " was removed from the conversation",
};

export function ChatUpdate({
  update,
  usersInConv,
}: {
  update: InboxConversationChange;
  usersInConv: UsersInConversation[];
}) {
  const userModifiedInChat = {
    name: "",
    handle: "",
  };
  let changeType = ConversationChangeType.Rename;
  if (update.added_user_id) {
    changeType = ConversationChangeType.AddUser;
    const user = usersInConv.find(
      (user) => user.user_id === update.added_user_id
    );
    userModifiedInChat.name = user
      ? getFullName({ firstName: user.first_name!, lastName: user.last_name })
      : "";

    userModifiedInChat.handle = user?.handle || "";
  }

  if (update.removed_user_id && update.removed_user_first_name) {
    changeType = ConversationChangeType.RemoveUser;
    userModifiedInChat.name = getFullName({
      firstName: update.removed_user_first_name,
      lastName: update.removed_user_last_name,
    });
    userModifiedInChat.handle = update.removed_user_handle || "";
  }

  return (
    <div
      key={update.id}
      className="flex justify-center text-gray-400 text-sm leading-5 font-normal m-2"
    >
      <span>
        {changeType === ConversationChangeType.Rename && (
          <>
            {getUpdateText[changeType]}
            <span className="font-semibold">{update.renamed_to}</span>
          </>
        )}

        {userModifiedInChat.name && (
          <>
            <Link href={`/p/${userModifiedInChat.handle}`}>
              <a className="font-semibold">{userModifiedInChat.name}</a>
            </Link>
            {getUpdateText[changeType]}
          </>
        )}
      </span>
    </div>
  );
}
