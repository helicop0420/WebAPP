import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { ConnectionDealInterest, DealReferrer } from "types/views";
import { faFire, faLock } from "@fortawesome/pro-solid-svg-icons";
import { faPen, faChartMixed } from "@fortawesome/pro-solid-svg-icons";
import AvatarStack from "www/shared/components/avatar_stack";
import UserLinkList from "www/shared/components/user_link_list";
import Link from "next/link";

interface DealInterestType {
  dealInterestCount: number;
  connectionsDealInterest: number;
  mutualFriends: MutualFriend[];
}
interface InterestBoxProps {
  interestCount: number | null;
  dealConnectionInterest: null | ConnectionDealInterest[];
  referrer: DealReferrer[] | null;
  isDealOwner: boolean;
  onEditActionClick: React.Dispatch<React.SetStateAction<boolean>>;
  onDealAnalyticsActionClick: React.Dispatch<React.SetStateAction<boolean>>;
}
interface MutualFriend {
  name: string;
  profilePic: string;
  handle: string;
}

const InterestBox = ({
  interestCount,
  dealConnectionInterest,
  isDealOwner,
  onEditActionClick,
  onDealAnalyticsActionClick,
  referrer,
}: InterestBoxProps) => {
  const getDealInterest = (): DealInterestType => {
    let dealInterestCount: number = interestCount ? interestCount : 0;
    let connectionsDealInterest: number = dealConnectionInterest
      ? dealConnectionInterest.length
      : 0;
    let mutualFriends: MutualFriend[] = [];

    dealConnectionInterest &&
      dealConnectionInterest.forEach(
        ({ profile_pic_url, last_name, first_name, handle }) => {
          mutualFriends.push({
            name: `${first_name} ${last_name}`,
            profilePic: profile_pic_url ?? "",
            handle: handle ?? "",
          });
        }
      );
    return {
      dealInterestCount,
      connectionsDealInterest,
      mutualFriends,
    };
  };
  const dealInterests = getDealInterest();
  const mutualPictureUrls = dealInterests.mutualFriends.map(
    (item) => item.profilePic
  );

  return (
    <div className="w-full">
      <div className="bg-green-100 border-l-4 border-l-green-700 rounded-r-[8px] inline-flex items-center gap-2 py-4 px-4 w-full">
        <div className="flex-1 flex flex-col ">
          <div className="flex flex-row items-center gap-3">
            {dealInterests.connectionsDealInterest >= 1 && (
              <AvatarStack pictureUrls={mutualPictureUrls} />
            )}
            <div className="">
              {dealInterests.dealInterestCount === 0 &&
                dealInterests.connectionsDealInterest === 0 && (
                  <div className="flex items-center gap-[6px]">
                    <FontAwesomeIcon icon={faFire} className="text-red-700" />
                    <p className="text-sm leading-5 font-bold text-gray-500">
                      This deal is hot off the press! Be the first to indicate
                      interest.
                    </p>
                  </div>
                )}
              {dealInterests.dealInterestCount >= 1 && (
                <UserLinkList
                  totalCount={dealInterests.dealInterestCount}
                  users={dealConnectionInterest}
                  singularSuffix="person has"
                  pluralSuffix="people have"
                  extraText="indicated interest"
                  mutualFriends={dealInterests.mutualFriends}
                />
              )}

              {!isDealOwner && referrer && (
                <p className="text-sm leading-5 font-normal text-gray-500 mt-2">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-green-700 mr-1.5"
                  />{" "}
                  You have access to this offering because{" "}
                  <Link href={`/p/${referrer[0].handle}`}>
                    <a className="text-sm leading-5 font-bold">
                      {referrer[0].first_name} {referrer[0].last_name}
                    </a>
                  </Link>{" "}
                  invited you.{" "}
                  <span className="underline">Not interested?</span>
                </p>
              )}
            </div>
          </div>
        </div>
        {isDealOwner ? (
          <div className="flex gap-2 items-center">
            <button
              className="bg-green-700 px-4 py-2 text-white rounded justify-center text-sm font-medium hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border"
              onClick={() => {
                onEditActionClick(true);
              }}
            >
              <FontAwesomeIcon icon={faPen}></FontAwesomeIcon> Edit deal ability
            </button>
            <button
              className="bg-green-700 px-4 py-2  text-white rounded justify-center text-sm font-medium  hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border"
              onClick={() => {
                onDealAnalyticsActionClick(true);
              }}
            >
              <FontAwesomeIcon icon={faChartMixed}></FontAwesomeIcon> Open
              analytics
            </button>
          </div>
        ) : (
          <button className="bg-green-700 px-4 py-2 ml-4 my-1 text-white rounded justify-center text-sm font-medium  hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border">
            INDICATE INTEREST
          </button>
        )}
      </div>
    </div>
  );
};

export default InterestBox;
