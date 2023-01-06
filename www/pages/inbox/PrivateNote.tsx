import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { getFullName } from "www/shared/utils";
import { useGlobalState } from "www/shared/modules/global_context";
import { Popover } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  fetchPrivateNote,
  InboxQueryKey,
  upsertPrivateNote,
} from "./Inbox.fetchers";
import { faMemoPad } from "@fortawesome/pro-regular-svg-icons";
import { formatDistance } from "date-fns";
import { toast } from "react-toastify";

export function PrivateNote({
  targetUserId,
  targetUsername,
}: {
  targetUserId: string;
  targetUsername: string;
}) {
  const queryClient = useQueryClient();

  const author = useGlobalState((s) => s.supabaseUser);
  const deal = useGlobalState((s) => s.sponsorDeals)[0];

  const [notes, setNotes] = useState("");
  const { data: privateNoteRes } = useQuery({
    queryKey: InboxQueryKey.PrivateNotesView,
    queryFn: () => fetchPrivateNote(targetUserId, deal.id),
    onSuccess: (res) => {
      setNotes(res?.data?.note || "");
    },
  });
  const privateNote = privateNoteRes?.data;

  const updateNote = useMutation(upsertPrivateNote);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Popover className="relative">
      <Popover.Button>
        <span className="ml-2">
          <FontAwesomeIcon icon={faMemoPad} />
        </span>
      </Popover.Button>
      <Popover.Panel>
        <div className="absolute z-10 w-80 bg-gray-900 text-white rounded-md shadow-lg p-6 flex flex-col">
          <h3 className="text-base leading-6">Notes - {targetUsername}</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 bg-gray-900 text-white w-full rounded-sm text-sm min-h-[100px]"
            placeholder="Add a note"
          />
          <button
            className="bg-green-700 py-2 px-3 mt-2 rounded-md"
            onClick={async () => {
              setIsLoading(true);
              await updateNote.mutateAsync({
                dealId: deal.id,
                noteId: privateNote?.id,
                content: notes,
                forUserId: targetUserId,
                authorUserId: author!.id,
              });
              // Fake sleep since update happens so fast
              await new Promise((r) => setTimeout(r, 1000));

              queryClient.invalidateQueries(InboxQueryKey.PrivateNotesView);
              setIsLoading(false);
              toast.success("Updated the note");
            }}
          >
            {isLoading ? (
              <div className="animate-spin">
                <FontAwesomeIcon icon={faSpinner} />
              </div>
            ) : (
              "Save"
            )}
          </button>
          {privateNote?.last_edit_by_user_id && (
            <PrivateUserNoteUpdate
              username={getFullName({
                firstName: privateNote.last_edit_by_user_id.first_name!,
                lastName: privateNote.last_edit_by_user_id.last_name,
              })}
              userPic={privateNote.last_edit_by_user_id.profile_pic_url!}
              updatedAt={privateNote.updated_at!}
            />
          )}
          <div className="mt-3 text-xs leading-4 font-normal">
            Visible only to sponsors and their team on your deal "{deal.title}".
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
function PrivateUserNoteUpdate({
  updatedAt,
  username,
  userPic,
}: {
  updatedAt: string;
  username: string;
  userPic: string;
}) {
  return (
    <div className="mt-2">
      Last edited by:
      <div className="flex items-center mt-3 mb-1">
        <Image
          src={userPic}
          width={24}
          height={24}
          style={{ borderRadius: 24 }}
          alt="user image"
        />
        <span className="text-green-700 text-sm leading-5 font-semibold mx-2">
          {username}
        </span>
        <span className="text-xs">
          {formatDistance(new Date(updatedAt), new Date(), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
