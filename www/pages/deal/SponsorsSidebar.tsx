import { Disclosure } from "@headlessui/react";
import React from "react";
import { Sponsor } from "types/views";
import { TeamLeadHeader } from "www/pages/deal/TeamLeadHeader";
import PreviousDeals from "www/pages/deal/PreviousDeals";

export interface TeamType {
  teamLead: Sponsor | null;
  team: Sponsor[] | null;
}
export interface SponsorExtended {
  mutualConnectionsCount: number;
  mutualFriends: MutualFriend[];
}
interface MutualFriend {
  name: string;
  profilePic: string;
  handle: string;
}
interface Props {
  sponsors: Sponsor[] | null;
  currentDeal: string;
}
export default function SponsorsSidebar({ sponsors, currentDeal }: Props) {
  const getSponsorMeta = () => {
    let sponsorsNumber = sponsors ? sponsors.length : 0;
    let sponsorsDeals = sponsors
      ? sponsors.reduce((acc, curr) => {
          return acc + (curr.deals ? curr.deals.length : 0);
        }, 0)
      : 0;

    return { sponsorsNumber, sponsorsDeals };
  };

  const sponsorsMeta = getSponsorMeta();

  return (
    <div className="bg-white sm:rounded-t-lg p-4">
      <p className="font-bold text-2xl leading-8 text-gray-900 subpixel-antialiased">
        The Sponsor(s)
      </p>
      <p className="text-gray-500 mt-2 mb-2">
        {sponsorsMeta.sponsorsNumber == 1
          ? `This opportunity is brought to you by 1 sponsor team, `
          : `This opportunity is brought to you by ${sponsorsMeta.sponsorsNumber} sponsors, `}
        with a collective{" "}
        <b className="text-green-700 font-bold">
          {sponsorsMeta.sponsorsDeals}{" "}
          {sponsorsMeta.sponsorsDeals > 1 ? "deals" : "deal"}
        </b>{" "}
        under their belt.
      </p>
      <div className="flex flex-col space-y-4">
        {sponsors &&
          sponsors.map((sponsor, index: number) => (
            <div
              className="w-full border border-gray-100 rounded-lg py-4 mt-4 "
              key={index}
            >
              <Disclosure
                as="div"
                key={index}
                className=" w-full"
                defaultOpen={index === 0 ? true : false}
              >
                {({ open }) => (
                  <div className="flex flex-col space-y-4">
                    <dt className="text-lg w-full">
                      <Disclosure.Button
                        as={TeamLeadHeader}
                        open={open}
                        sponsor={sponsor}
                        orgMembers={sponsor.org_members}
                      />
                    </dt>

                    <Disclosure.Panel
                      as="dd"
                      className="mt-0  w-full flex flex-col space-y-4"
                    >
                      <div className="px-4">
                        <hr className="" />
                      </div>
                      <div className="px-4">
                        <p className="text-sm leading-5 font-bold text-gray-800">
                          Work family
                        </p>
                        <p className="text-sm leading-5 font-normal text-gray-500 mt-1">
                          When you make more than 2 deals with one person, you
                          will be in the same working family with him
                        </p>
                      </div>
                      <div className="px-4">
                        <hr className="" />
                      </div>
                      <PreviousDeals
                        deals={
                          sponsor?.deals
                            ? sponsor.deals.filter(
                                (deal) => deal.handle !== currentDeal
                              )
                            : null
                        }
                      />
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
      </div>
    </div>
  );
}
