import {
  ChatBodyList,
  IndividualChatContainer,
  IndividualChatFooter,
} from "./IndividualChat";
import { useEffect, useState } from "react";
import { classNames, getFullName } from "www/shared/utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createConversation,
  createUserAssosciations,
  fetchFriendsView,
  fetchInboxConversationView,
  InboxQueryKey,
  invalidateInboxViews,
} from "./Inbox.fetchers";
import { useGlobalState } from "www/shared/modules/global_context";
import { ConversationPreview, FriendsListView } from "types/views";
import { toast } from "react-toastify";
import { OptionProps } from "react-select";
import { MultiSelect } from "www/shared/components/form_inputs";
import { CheckboxWithLabel } from "www/shared/components/form_inputs/Checkbox";
import { useRouter } from "next/router";
import {
  updateConversationTitle,
  updateUserAssosciations,
} from "./EditConversation.fetchers";

type Person = {
  id: string;
  name: string;
  imageUrl: string;
  subtitle: string | null;
};

function parsePersonData(
  friendConnection: Pick<
    FriendsListView,
    "to_user_id" | "first_name" | "last_name" | "profile_pic_url" | "subtitle"
  >
): Person {
  return {
    id: friendConnection.to_user_id!,
    name: getFullName({
      firstName: friendConnection.first_name!,
      lastName: friendConnection.last_name,
    }),
    imageUrl: friendConnection.profile_pic_url!,
    subtitle: friendConnection.subtitle,
  };
}

function useFriendlyConnections({
  inboxConversations,
  mode,
  existingConversation,
}: {
  inboxConversations: ConversationPreview[];
  mode: "new" | "update";
  existingConversation?: ConversationPreview;
}) {
  const user = useGlobalState((s) => s.supabaseUser);

  const { data: friendsViewRes } = useQuery({
    queryKey: [InboxQueryKey.FriendsView, user?.id],
    queryFn: () => fetchFriendsView(user?.id!),
  });
  const friendlyConnections =
    friendsViewRes?.data?.map((friend) => parsePersonData(friend)) || [];

  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);

  useEffect(() => {
    if (
      mode === "new" ||
      !existingConversation?.users_in_conv ||
      friendlyConnections.length === 0 ||
      selectedPeople.length > 1
    )
      return;

    const people = existingConversation.users_in_conv
      .map((user) => {
        return friendlyConnections.find((person) => person.id === user.user_id);
      })
      .filter(Boolean) as Person[];

    setSelectedPeople(people);
  }, [friendlyConnections.length]);

  const selectedIds = selectedPeople.map((person) => person.id);
  const peopleNotSelectedYet = friendlyConnections.filter(
    (person) => !selectedIds.includes(person.id)
  );

  const soloConversations = inboxConversations.reduce((acc, convo) => {
    if (convo.users_in_conv?.length !== 1) {
      return acc;
    }

    const userId = convo.users_in_conv[0].user_id;
    acc[userId] = convo;

    return acc;
  }, {} as { [key: string]: ConversationPreview });

  return {
    selectedIds,
    selectedPeople,
    setSelectedPeople,
    peopleNotSelectedYet,
    soloConversations,
  };
}

export function EditConversation({
  inboxConversations,
  mode,
}: {
  inboxConversations: ConversationPreview[];
  mode: "new" | "update";
}) {
  const user = useGlobalState((s) => s.supabaseUser);
  const router = useRouter();
  const { convo: updatingConversationId } = router.query as {
    convo?: string;
  };
  const existingConversation =
    mode === "update"
      ? inboxConversations.find(
          (convo) => convo.conversation_id === Number(updatingConversationId)
        )
      : undefined;

  const {
    selectedIds,
    selectedPeople,
    setSelectedPeople,
    peopleNotSelectedYet,
    soloConversations,
  } = useFriendlyConnections({
    inboxConversations,
    mode,
    existingConversation,
  });

  const [groupName, setGroupName] = useState(existingConversation?.title || "");

  const createConversationMutation = useMutation(createConversation);
  const createAssosciationsMutation = useMutation(createUserAssosciations);
  const [shouldSendIndividually, setShouldSendIndividually] = useState(false);

  const onInitializeConversation = async (soloUserId?: string) => {
    const createConvoRes = await createConversationMutation.mutateAsync({
      title: groupName,
    });

    const convoId = createConvoRes.data?.id;

    if (createConvoRes.error || !convoId) {
      toast.error("Error creating conversation");
      return;
    }

    const createAssocRes = await createAssosciationsMutation.mutateAsync({
      userIds: [...(soloUserId ? [soloUserId] : selectedIds), user?.id!],
      conversationId: convoId,
    });

    if (createAssocRes.error) {
      toast.error("Error creating conversation assosciations");
      return;
    }

    return convoId;
  };

  return (
    <IndividualChatContainer className="justify-between">
      <div>
        <div className="block text-sm font-medium text-gray-600 mt-4 mb-3 font-500">
          {mode === "new" ? "New" : "Edit"} Conversation
        </div>
        <MultiSelect<Person>
          options={peopleNotSelectedYet}
          value={selectedPeople}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={(_person) => {
            setSelectedPeople([..._person]);
          }}
          placeholder="Type a name or multiple names"
          components={{
            Option: NewMessageOption,
          }}
        />
        {selectedPeople.length > 1 && (
          <div className="mt-4">
            {mode === "new" && (
              <CheckboxWithLabel
                id="send-individually"
                checked={shouldSendIndividually}
                onChange={setShouldSendIndividually}
                label="Send Individually"
              />
            )}
            {!shouldSendIndividually && (
              <GroupNameInput
                groupName={groupName}
                setGroupName={setGroupName}
              />
            )}
          </div>
        )}
      </div>
      {mode === "new" && (
        <>
          {selectedIds.length === 1 && soloConversations[selectedIds[0]] ? (
            <ExistingConvoBody
              conversationId={String(
                soloConversations[selectedIds[0]].conversation_id
              )}
            />
          ) : (
            <IndividualChatFooter
              conversation_id={null}
              newConversationProps={{
                initializeConversationFn: onInitializeConversation,
                shouldSendIndividually:
                  shouldSendIndividually && selectedIds.length > 1,
                soloConversations,
                selectedIds,
              }}
            />
          )}
        </>
      )}
      {mode === "update" && existingConversation && (
        <UpdateMessageFooter
          selectedPeople={selectedPeople}
          groupName={groupName}
          existingConversation={existingConversation}
        />
      )}
    </IndividualChatContainer>
  );
}

function ExistingConvoBody({ conversationId }: { conversationId: string }) {
  const user = useGlobalState((s) => s.supabaseUser);

  const { data: res } = useQuery({
    queryKey: [InboxQueryKey.ConversationView, user?.id, conversationId],
    queryFn: () => fetchInboxConversationView(user?.id!, conversationId),
  });

  const conversationData = res?.data;

  return (
    <>
      {conversationData && <ChatBodyList conversationData={conversationData} />}
      <IndividualChatFooter
        conversation_id={conversationId}
        isFromNewMessage
        isConversationDone={!!conversationData?.is_marked_done}
      />
    </>
  );
}

function GroupNameInput({
  groupName,
  setGroupName,
}: {
  groupName: string;
  setGroupName: (val: string) => void;
}) {
  return (
    <div className="mt-3">
      <label htmlFor="new-message-group-name" className="block  text-gray-700">
        <span className="text-sm font-medium">Group Name </span>
        <span className="font-normal">(optional)</span>
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="new-message-group-name"
          id="new-message-group-name"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter group name"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        />
      </div>
    </div>
  );
}

const NewMessageOption = (props: OptionProps<Person>) => {
  const person: Person = props.data;

  return (
    <ConnectionListItem
      name={person.name}
      imageUrl={person.imageUrl}
      subtitle={person.subtitle}
      onDelete={() => props.selectOption(person)}
    />
  );
};

// TODO: This component can be better refactored but not sure how yet
function ConnectionListItem({
  imageUrl,
  name,
  subtitle,
  onDelete,
}: {
  name: string;
  subtitle?: string | null;
  imageUrl: string;
  onDelete?: () => void;
}) {
  return (
    <div
      className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-green-700 hover:text-white hover:font-semibold"
      onClick={onDelete}
    >
      <div className="flex items-center group">
        <img
          src={imageUrl}
          alt=""
          className="h-9 w-9 flex-shrink-0 rounded-full"
        />
        <div className="flex flex-col ml-3">
          <div className={classNames("truncate", "text-sm font-medium")}>
            {name}
          </div>
          {subtitle && (
            <div
              className={`text-xs leading-4 font-normal text-gray-500
            group-hover:text-white`}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpdateMessageFooter({
  selectedPeople,
  groupName,
  existingConversation,
}: {
  selectedPeople: Person[];
  groupName: string;
  existingConversation: ConversationPreview;
}) {
  const queryClient = useQueryClient();
  const conversationId = existingConversation.conversation_id;
  const updateConvoTitle = useMutation(updateConversationTitle);
  const updatePeopleInConvo = useMutation(updateUserAssosciations);
  const router = useRouter();

  const updateGroupName = async () => {
    const hasGroupNameChanged = existingConversation.title !== groupName;

    if (!hasGroupNameChanged) return null;

    const res = await updateConvoTitle.mutateAsync({
      title: groupName,
      conversation_id: conversationId,
    });

    toast.success(
      res.error == null
        ? `Group name updated to ${groupName}`
        : "Error updating group name"
    );
    return res;
  };

  const updatePeopleInConversation = async () => {
    const newPeopleIds = selectedPeople.map((person) => person.id);
    const oldPeopleIds =
      existingConversation.users_in_conv?.map((user) => user.user_id) || [];
    newPeopleIds.sort();
    oldPeopleIds.sort();

    const hasPeopleChanged = newPeopleIds.join(",") !== oldPeopleIds.join(",");

    if (!hasPeopleChanged) return null;

    const peopleAdded = newPeopleIds.filter((id) => !oldPeopleIds.includes(id));

    const peopleRemoved = oldPeopleIds.filter(
      (id) => !newPeopleIds.includes(id)
    );

    const netPeopleChanged = peopleAdded.length - peopleRemoved.length;
    const newTotalPeopleInConvo = oldPeopleIds.length + netPeopleChanged + 1;
    // +1 for the current user

    if (newTotalPeopleInConvo < 3) {
      throw new Error(
        "Cannot have a group conversation with less than 3 people"
      );
    }

    const res = await updatePeopleInConvo.mutateAsync({
      conversation_id: conversationId,
      ids_to_add: peopleAdded,
      ids_to_remove: peopleRemoved,
    });

    toast.success("Updated people in conversation");
    return res;
  };

  const onSubmit = async () => {
    try {
      await updateGroupName();
      await updatePeopleInConversation();
      invalidateInboxViews(queryClient);

      router.push(`/inbox/${conversationId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex justify-end pt-7 pb-3 border-t-green-700 border-t">
      <button
        type="submit"
        className="flex flex-row items-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none"
        onClick={() => {
          onSubmit();
        }}
      >
        <p className="text-sm leading-5 font-medium text-white">Save</p>
      </button>
    </div>
  );
}
