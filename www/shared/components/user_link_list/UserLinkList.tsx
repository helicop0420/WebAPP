import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { ConnectionDealInterest } from "types/views";
// import InterestedMembersPopup from "../InterestedMembersPopup";
import { faUsers } from "@fortawesome/pro-solid-svg-icons";
import { faFire } from "@fortawesome/pro-solid-svg-icons";
import InterestedMembersPopup from "www/pages/deal/InterestedMembersPopup";
interface MutualFriend {
  name: string;
  profilePic: string;
  handle: string;
}
interface UserLinkListProps {
  totalCount: number;
  users: ConnectionDealInterest[] | null;
  singularSuffix?: string;
  pluralSuffix?: string;
  extraText?: string;
  mutualFriends: MutualFriend[];
}
export default function UserLinkList({
  totalCount,
  users,
  singularSuffix = "",
  pluralSuffix = "",
  extraText = "indicated interest",
  mutualFriends,
}: UserLinkListProps) {
  return (
    <span>
      {totalCount === 0 && mutualFriends.length === 0 && (
        <div className="flex items-center gap-[6px]">
          <FontAwesomeIcon icon={faFire} className="text-red-700" />
          <p className="text-sm leading-5 font-bold text-gray-500">
            This deal is hot off the press! Be the first to indicate interest.
          </p>
        </div>
      )}
      {totalCount >= 1 && mutualFriends.length == 0 && (
        <p className="text-sm leading-5 font-normal text-gray-500">
          <FontAwesomeIcon icon={faUsers} className="text-green-700 mr-1.5" />
          <span className="font-bold text-green-700">{totalCount === 1 ? `${totalCount} other` : totalCount}</span>{" "}
          {totalCount === 1 ? singularSuffix : pluralSuffix} {extraText}
        </p>
      )}
      {totalCount >= 1 && mutualFriends.length >= 1 && (
        <>
          {mutualFriends.length === 1 ? (
            <span className="py-1 text-sm font-normal text-gray-500 flex gap-1 ">
              <Link href={`/p/${mutualFriends[0].handle}`}>
                <span className="font-semibold text-green-700 hover:underline active:underline active:text-green-800 cursor-pointer">
                  {mutualFriends[0].name}
                </span>
              </Link>
              {"   "}
              {totalCount >= 2 ? (
                <>
                  and{" "}
                  {users ? (
                    <InterestedMembersPopup
                      interestedProfiles={users}
                      mutualInterestCount={mutualFriends.length}
                      interestCount={totalCount}
                    >
                      <span className="font-bold text-green-700">
                        <FontAwesomeIcon icon={faUsers} className="text-green-700 mx-1.5" />
                        {totalCount === 2 ? 1 : totalCount - 1} other
                      </span>
                    </InterestedMembersPopup>
                  ) : (
                    <span className="font-bold text-green-700">
                      <FontAwesomeIcon icon={faUsers} className="text-green-700 mx-1.5" />
                      {totalCount === 2 ? 1 : totalCount - 1} other
                    </span>
                  )}{" "}
                  {totalCount === 2 ? singularSuffix : pluralSuffix} {extraText}
                </>
              ) : (
                <>{extraText && `has ${extraText}`}</>
              )}
            </span>
          ) : (
            <span className="py-1 text-sm font-normal text-gray-500 flex gap-1">
              <span>
                <Link href={`/p/${mutualFriends[0].handle}`}>
                  <span className="font-semibold text-green-700 hover:underline active:underline active:text-green-800 cursor-pointer">
                    {mutualFriends[0].name}
                  </span>
                </Link>
                {totalCount == 2 ? <span> and </span> : <span className="font-semibold text-green-700">, </span>}
                <Link href={`/p/${mutualFriends[1].handle}`}>
                  <span className="font-semibold text-green-700 hover:underline active:underline active:text-green-800 cursor-pointer">
                    {mutualFriends[1].name}
                  </span>
                </Link>
              </span>
              {totalCount >= 3 ? (
                <span className="flex gap-1">
                  and{" "}
                  {users ? (
                    <InterestedMembersPopup
                      interestedProfiles={users}
                      mutualInterestCount={mutualFriends.length}
                      interestCount={totalCount}
                    >
                      <span className="font-bold text-green-700">
                        <FontAwesomeIcon icon={faUsers} className="text-green-700" />{" "}
                        {totalCount === 3 ? "1" : totalCount - 2} other
                      </span>
                    </InterestedMembersPopup>
                  ) : (
                    <span className="font-bold text-green-700">
                      <FontAwesomeIcon icon={faUsers} className="text-green-700" />{" "}
                      {totalCount === 3 ? "1" : totalCount - 2} other
                    </span>
                  )}{" "}
                  {totalCount === 3 ? singularSuffix : pluralSuffix} {extraText}
                </span>
              ) : (
                <span className="">
                  {" "}
                  <>{extraText && `have ${extraText}`}</>
                </span>
              )}
            </span>
          )}
        </>
      )}
    </span>
  );
}
