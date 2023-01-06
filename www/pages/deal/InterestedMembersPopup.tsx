import React from "react";
import { ConnectionDealInterest } from "types/views";
import Popover from "www/shared/components/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import UserList from "www/shared/components/user_list";

interface InterestedMembersPopupProps {
  interestedProfiles: ConnectionDealInterest[] | null;
  children: React.ReactNode;
  mutualInterestCount: number;
  interestCount: number;
}
export default function InterestedMembersPopup({
  children,
  interestedProfiles,
  mutualInterestCount,
  interestCount,
}: InterestedMembersPopupProps) {
  const interestedMembers = interestedProfiles
    ? interestedProfiles?.map((item) => ({
        subtitle: item.subtitle,
        firstName: item.first_name,
        handle: item.handle,
        lastName: item.last_name,
        profilePicUrl: item.profile_pic_url,
      }))
    : null;
  return (
    <div className="inline cursor-pointer">
      <Popover
        element={
          <UserList
            users={interestedMembers}
            showIcon
            header={
              <div className="px-[18px] py-4">
                <p className="text-xs leading-4  font-normal text-gray-400">
                  <span className="text-green-700 font-bold ">{mutualInterestCount}</span> mutual connections have
                  indicated interest
                </p>
              </div>
            }
            footer={
              <div className="flex  items-center gap-4 px-6 py-[10px]">
                <div className="h-10 w-10 rounded-full flex justify-center items-center border border-gray-500">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <p className="">{interestCount - mutualInterestCount} others have indicated interest</p>
              </div>
            }
          />
        }
      >
        {children}
      </Popover>
    </div>
  );
}
