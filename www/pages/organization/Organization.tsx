import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useMemo, useRef } from "react";
import {
  faBuilding,
  faUsers,
  faEnvelope,
  faArrowUpRightFromSquare,
} from "@fortawesome/pro-solid-svg-icons";
import organisationImage from "../../../public/organization/cover.png";
import {
  faArrowRight,
  faCameraRetro,
  faPenToSquare,
} from "@fortawesome/pro-light-svg-icons";
import DealCard from "./DealCard";
import TeamLeaderCard from "./TeamLeaderCard";
import TeamMemberCard from "./TeamMemberCard";
import MutualTeamMemberCard from "./MutualTeamMemberCard";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { fetchOrganizationView } from "./Organization.fetchers";
import Skeleton from "react-loading-skeleton";
export default function Organization() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const { data: res } = useQuery({
    queryKey: [id],
    queryFn: () => fetchOrganizationView(id as unknown as number),
    onError: (err) => {
      console.log("err", err);
    },
  });
  const organizationData = res?.data;

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [organizationData]);

  const teamMembersContainerRef = useRef<HTMLDivElement>(null);
  const twitterUrl = useMemo(() => {
    let res: string | null = null;
    if (organizationData?.twitter_url) {
      const regex = /(?<=\.com\/).*/;
      const match = organizationData?.twitter_url.match(regex);
      if (match) {
        res = match[0];
      }
    }
    return res;
  }, [organizationData]);

  return (
    <>
      {organizationData && (
        <div className="px-7 sm:px-14 md:px-20 xl:px-[112px] xl:pb-12 overflow-x-hidden">
          <div className="lg:flex w-full py-[22px] lg:space-x-4">
            {/* left */}
            <div className="w-full lg:w-[66.2%]  flex flex-col space-y-4">
              {/* Header */}
              <div className="w-full bg-white rounded-lg pb-[22px]">
                <div className="h-[180px] w-full rounded-t-lg relative">
                  <Image
                    className="h-[180px] md:h-full w-full  rounded-t-lg object-cover"
                    src={organizationData.cover_photo_url ?? organisationImage}
                    alt="People working on laptops"
                    layout="fill"
                    // width="1171"
                    // height="180"
                  />
                  <button className="h-8 w-8 rounded-full bg-white absolute top-[17px] right-[18px] flex justify-center items-center">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="text-green-700 h-4 w-4"
                    />
                  </button>
                </div>
                <div className="px-[32px] flex relative">
                  <div className="min-h-[80px] min-w-[80px] h-[100px] w-[100px] md:h-[192px] md:w-[192px] -mt-[96px] md:-mt-[96px] absolute top-[40px] md:top-0">
                    <Image
                      src={organizationData.profile_pic_url ?? "/avatar.png"}
                      alt="bg "
                      height="192"
                      width="192"
                      className="rounded-full  "
                    />
                    <button className="h-8 w-8 rounded-full bg-white absolute bottom-0 right-[18px] flex justify-center items-center shadow-md">
                      <FontAwesomeIcon
                        icon={faCameraRetro}
                        className="text-gray-500 h-4 w-4"
                      />
                    </button>
                  </div>
                  <div
                    className="flex flex-col ml-0 md:ml-[192px] mt-16 md:mt-4"
                    // style={{ marginLeft: "0" }}
                  >
                    <span className="flex items-center space-x-[14px]">
                      <h2 className="font-style: normal leading-6 font-semibold md:font-extrabold text-[20px] md:text-[30px] md:leading-[36px] text-black ">
                        {organizationData.name}
                      </h2>
                      <VerificationSVG />
                    </span>
                    <p className="text-gray-500 text-sm leading-5 font-normal mt-1">
                      {organizationData.headline}
                    </p>
                    <div className="space-y-3 mt-3">
                      <span className="flex text-green-700 space-x-[10px] items-center">
                        <span className="w-5 flex justify-center">
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-gray-500"
                          />
                        </span>
                        {/* Team members */}
                        {organizationData.team_members &&
                          organizationData.team_members.length > 0 && (
                            <p className="text-xs leading-4 font-normal text-gray-500">
                              {organizationData.team_members.length} Team{" "}
                              {organizationData.team_members.length === 1
                                ? " member"
                                : " members"}
                            </p>
                          )}
                      </span>
                      {/* head quarters */}
                      {organizationData.headquarters && (
                        <span className="flex space-x-[10px] items-center">
                          <span className="w-5 flex justify-center">
                            <FontAwesomeIcon
                              icon={faBuilding}
                              className="text-gray-500"
                            />
                          </span>
                          <p className="text-xs leading-4 font-normal">
                            {organizationData.headquarters}
                          </p>
                        </span>
                      )}
                      {/* email */}
                      {organizationData.email && (
                        <span className="flex text-green-700 space-x-[10px] items-center">
                          <span className="w-5 flex justify-center">
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className="text-gray-500"
                            />
                          </span>
                          <a
                            href={`mailto:${organizationData.email}`}
                            className="text-xs leading-4 font-medium"
                          >
                            {organizationData.email}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Overview */}
              <div className="p-8 bg-white rounded-lg flex flex-col space-y-5">
                <h3 className="text-2xl leading-8 font-extrabold txt-gray-900">
                  Overview
                </h3>
                <p className="text-sm leading-5 font-normal text-gray-500">
                  {organizationData?.about}
                </p>
                {/* Links */}
                <div className="mt-4">
                  <p className="text-base leading-6 font-semibold text-gray-900">
                    Links
                  </p>
                  <div className="flex flex-col gap-2 mt-3">
                    {/* our website */}
                    {organizationData.website_url && (
                      <a
                        href={organizationData.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full md:w-[240px] flex justify-between items-center border border-gray-200 p-3 text-sm leading-5 font-medium rounded-md text-gray-500 hover:border-green-700 hover:text-green-700"
                      >
                        Our Website{" "}
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    )}
                    {/* linkedin */}
                    {organizationData.linkedin_url && (
                      <a
                        href={organizationData.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full md:w-[240px] flex justify-between items-center border border-gray-200 p-3 text-sm leading-5 font-medium rounded-md text-gray-500 hover:border-green-700 hover:text-green-700"
                      >
                        LinkedIn{" "}
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    )}
                    {/* instagram */}
                    {organizationData.instagram_url && (
                      <a
                        href={organizationData.instagram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full md:w-[240px] flex justify-between items-center border border-gray-200 p-3 text-sm leading-5 font-medium rounded-md text-gray-500 hover:border-green-700 hover:text-green-700"
                      >
                        Instagram{" "}
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    )}
                    {/* twitter */}
                    {organizationData.twitter_url && (
                      <a
                        href={organizationData.twitter_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full md:w-[240px] flex justify-between items-center border border-gray-200 p-3 text-sm leading-5 font-medium rounded-md text-gray-500 hover:border-green-700 hover:text-green-700"
                      >
                        Twitter{" "}
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {/* Meet our leadership */}
              <div className="rounded-lg bg-white w-full p-8 flex flex-col gap-4">
                <h3 className="text-2xl leading-8 font-extrabold text-gray-900">
                  Meet our leadership
                </h3>

                <p className="text-gray-500 text-sm leading-5 font-normal mt-2.5">
                  {organizationData.leadership_bio}
                </p>
                {/* Team leaders list */}
                <div className="flex flex-col w-full gap-4">
                  {organizationData.team_members &&
                    organizationData.team_members.length > 0 &&
                    organizationData.team_members
                      .filter((item) => item.is_leadership === true)
                      .map((member, index) => (
                        <TeamLeaderCard
                          key={index}
                          firstName={member.team_member_first_name}
                          lastName={member.team_member_last_name}
                          title={member.job_title}
                          profilePics={member.team_member_profile_pic_url}
                          isConnected={member.team_member_is_connected}
                          handle={member.team_member_handle}
                          twitter={member.team_member_twitter_url}
                          linkedIn={member.team_member_linkedin_url}
                          mutualConnections={
                            member.team_member_mutual_connections
                          }
                        />
                      ))}
                </div>
                {organizationData.team_members &&
                  organizationData.team_members.length > 0 &&
                  organizationData.team_members.filter(
                    (item) => item.is_leadership === true
                  ).length > 3 && (
                    <button className="border border-gray-400 py-2 text-sm leading-5 font-semibold text-gray-600 rounded-lg  mt-2  hover:text-gray-900 hover:border-gray-900 w-fit px-3 ">
                      Show all
                    </button>
                  )}
              </div>
              {/* Team */}
              <div className="rounded-lg bg-white flex flex-col space-y-4 w-full p-8">
                <p className="text-2xl leading-8 font-extrabold text-gray-900">
                  Team
                </p>
                {/* Team members list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {organizationData.team_members &&
                    organizationData.team_members.length > 0 &&
                    organizationData.team_members
                      .filter((item) => item.is_leadership === false)
                      .map((member, index) => (
                        <TeamMemberCard
                          key={index}
                          firstName={member.team_member_first_name}
                          lastName={member.team_member_last_name}
                          title={member.job_title}
                          profilePics={member.team_member_profile_pic_url}
                          isConnected={member.team_member_is_connected}
                          handle={member.team_member_handle}
                          // isConnected={false}
                        />
                      ))}
                </div>
                {organizationData.team_members &&
                  organizationData.team_members.length > 0 &&
                  organizationData.team_members.filter(
                    (item) => item.is_leadership === false
                  ).length > 6 && (
                    <button className="border border-gray-400 py-2 text-sm leading-5 font-semibold text-gray-600 rounded-lg  mt-2  hover:text-gray-900 hover:border-gray-900 w-fit px-3 ">
                      Show all members (
                      {
                        organizationData.team_members.filter(
                          (item) => item.is_leadership === false
                        ).length
                      }
                      )
                    </button>
                  )}
              </div>
            </div>
            {/* Right */}
            <div className="mt-4 lg:mt-0  w-full lg:w-[32.48%] flex flex-col gap-4">
              {/* team members you may know */}
              <div className="p-6 bg-white rounded-lg">
                <h3 className="text-2xl leading-8 font-extrabold text-gray-900">
                  Team Members You May Know
                </h3>
                <p className="mt-3 text-gray-500 text-sm leading-5 font-normal">
                  Connect with fellow investors to get the inside scoop when
                  they express interest in deals.
                </p>
                {/* list */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col space-y-3 pt-4"
                  ref={teamMembersContainerRef}
                >
                  {/* list item */}
                  {organizationData.team_members_you_may_know &&
                    organizationData.team_members_you_may_know.length > 0 &&
                    organizationData.team_members_you_may_know.map(
                      (member, index) => (
                        <MutualTeamMemberCard
                          key={index}
                          firstName={member.first_name}
                          lastName={member.last_name}
                          handle={member.handle}
                          subtitle={member.subtitle}
                          profilePic={member.profile_pic_url}
                          isConnected={member.is_connected}
                          mutualConnections={member.num_mutuals}
                        />
                      )
                    )}
                </div>
              </div>
              {/* twitter feed */}
              {twitterUrl && (
                <div className="flex flex-col gap-4 bg-white px-2 py-6">
                  <h3 className="text-2xl leading-8 font-extrabold text-gray-900 px-4">
                    Twitter feed
                  </h3>

                  <a
                    className="twitter-timeline"
                    data-width={teamMembersContainerRef.current?.clientWidth}
                    data-height={1000}
                    data-theme="light"
                    href={`https://twitter.com/${twitterUrl}?ref_src=twsrc%5Etfw`}
                    data-chrome="nofooter transparent noborders noheader"
                  >
                    <Skeleton height={200} count={10} />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-[30px]">
            {/* Deals */}
            <div className="p-8 bg-white rounded-lg">
              <div className="w-full flex justify-between">
                <p className="text-2xl leading-8 font-extrabold text-gray-900">
                  Deals
                </p>
                <button className="text-base leading-6 font-medium text-green-700">
                  View all Deals <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
              <div className="flex space-x-7 mt-4  py-2 overflow-x-scroll">
                {organizationData.deals &&
                  organizationData.deals.length > 0 &&
                  organizationData.deals.map((deal, index) => (
                    <DealCard
                      key={index}
                      title={deal.title}
                      handle={deal.handle}
                      isActive={deal.is_active}
                      dealImage={deal.deal_image}
                      interestCount={deal.interest_count}
                      dealDescription={deal.about}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const VerificationSVG = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.26698 1.4551C4.91024 1.40375 5.52089 1.15073 6.01198 0.732104C6.56664 0.259695 7.27141 0.000244141 7.99998 0.000244141C8.72856 0.000244141 9.43332 0.259695 9.98798 0.732104C10.4791 1.15073 11.0897 1.40375 11.733 1.4551C12.4594 1.51316 13.1414 1.82807 13.6567 2.34337C14.172 2.85867 14.4869 3.54067 14.545 4.2671C14.596 4.9101 14.849 5.5211 15.268 6.0121C15.7404 6.56677 15.9998 7.27153 15.9998 8.0001C15.9998 8.72868 15.7404 9.43344 15.268 9.9881C14.8493 10.4792 14.5963 11.0898 14.545 11.7331C14.4869 12.4595 14.172 13.1415 13.6567 13.6568C13.1414 14.1721 12.4594 14.487 11.733 14.5451C11.0897 14.5965 10.4791 14.8495 9.98798 15.2681C9.43332 15.7405 8.72856 16 7.99998 16C7.27141 16 6.56664 15.7405 6.01198 15.2681C5.52089 14.8495 4.91024 14.5965 4.26698 14.5451C3.54055 14.487 2.85855 14.1721 2.34325 13.6568C1.82794 13.1415 1.51304 12.4595 1.45498 11.7331C1.40362 11.0898 1.15061 10.4792 0.731982 9.9881C0.259573 9.43344 0.00012207 8.72868 0.00012207 8.0001C0.00012207 7.27153 0.259573 6.56677 0.731982 6.0121C1.15061 5.52102 1.40362 4.91036 1.45498 4.2671C1.51304 3.54067 1.82794 2.85867 2.34325 2.34337C2.85855 1.82807 3.54055 1.51316 4.26698 1.4551ZM11.707 6.7071C11.8891 6.5185 11.9899 6.2659 11.9877 6.0037C11.9854 5.74151 11.8802 5.49069 11.6948 5.30529C11.5094 5.11988 11.2586 5.01471 10.9964 5.01243C10.7342 5.01015 10.4816 5.11095 10.293 5.2931L6.99998 8.5861L5.70698 7.2931C5.51838 7.11095 5.26578 7.01015 5.00358 7.01243C4.74138 7.01471 4.49057 7.11988 4.30516 7.30529C4.11976 7.49069 4.01459 7.74151 4.01231 8.0037C4.01003 8.2659 4.11082 8.5185 4.29298 8.7071L6.29298 10.7071C6.48051 10.8946 6.73482 10.9999 6.99998 10.9999C7.26515 10.9999 7.51945 10.8946 7.70698 10.7071L11.707 6.7071Z"
        fill="#15803D"
      />
    </svg>
  );
};
