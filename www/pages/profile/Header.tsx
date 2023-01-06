/* eslint-disable @next/next/no-img-element */
import dateFormat from "dateformat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faChartLine,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OutlineButton } from "www/shared/components/button/OutlineButton";
import { take } from "lodash";
import { ProfilePageView } from "types/views";

import Image from "next/future/image";
import _ from "lodash";
import { faPen } from "@fortawesome/pro-regular-svg-icons";

// library.add(fab, faCheckSquare, faCoffee, faPenAlt, faPen);
interface HeaderProps {
  profile: ProfilePageView;
  openEditModal: (value: boolean) => void;
}
export default function Header({ profile, openEditModal }: HeaderProps) {
  const {
    first_name,
    profile_pic_url,
    last_name,
    is_verified,
    is_sponsor,
    is_investor,
    nominated_by_user_profile_pic_url,
    subtitle,
    nominated_by_user_id,
    nominated_by_user_first_name,
    nominated_by_user_last_name,
    connections_count,
    mutual_connections,
    current_org_id,
    current_org_position,
    current_org_profile_pic_url,
    current_org_name,
    created_at,
  } = profile;

  const first2 = take(mutual_connections, 2);
  const first3 = take(mutual_connections, 3);
  return (
    <div className="bg-white rounded-lg pb-3 relative">
      <div className="bg-gradient-to-r from-sky-800 to-cyan-600 h-48 w-full rounded-t-lg group">
        <button
          className="bg-white absolute top-5 right-5 px-4 py-2 rounded shadow group-hover:bg-gray-100"
          onClick={() => {
            openEditModal(true);
          }}
        >
          <FontAwesomeIcon
            icon={faPen}
            className="text-gray-700 group-hover:text-gray-500"
            size="sm"
          />
        </button>
      </div>
      <div className="flex pt-4 gap-4 px-12">
        <Image
          src={profile_pic_url ? profile_pic_url : ""}
          alt={typeof first_name == "string" ? first_name : "User image"}
          width={192}
          height={192}
          className="-mt-20 border-4 border-white rounded-full"
        />
        <div className="flex flex-col flex-grow">
          <div className="text-3xl font-extrabold flex gap-4 text-black items-center">
            {first_name && first_name} {"  "} {last_name && last_name}
            {is_verified && (
              <FontAwesomeIcon
                className="text-green-700 text-base mt-1"
                icon={faCheckCircle}
                size="sm"
              />
            )}
          </div>
          {subtitle && (
            <div className="font-sm max-w-none text-gray-600 font-medium">
              {subtitle}
            </div>
          )}
          <div className="flex ml-1 gap-4 mt-3 text-gray-500 items-center text-sm">
            {is_investor && (
              <div className="flex-row">
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="lg"
                  className="text-gray-400 mr-2"
                />
                Investor
              </div>
            )}
            {is_sponsor && (
              <div className="flex-row">
                <FontAwesomeIcon
                  icon={faBuilding}
                  size="lg"
                  className="text-gray-400 mr-2"
                />
                Sponsor
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col text-sm gap-3">
          {current_org_id && (
            <div className="flex gap-4 pr-8">
              <img
                src={
                  current_org_profile_pic_url
                    ? current_org_profile_pic_url
                    : undefined
                }
                alt={current_org_name ? current_org_name : undefined}
                className="h-8 w-8"
              />
              <div className="flex flex-col">
                <div className="text-sm leading-5 font-semibold">
                  {current_org_name && current_org_name}
                </div>
                <div className="text-gray-500 text-sm leading-5 font-normal">
                  {current_org_position && current_org_position}
                </div>
              </div>
            </div>
          )}
          {nominated_by_user_id && (
            <div className="flex gap-4 pr-8">
              <img
                src={
                  nominated_by_user_profile_pic_url
                    ? nominated_by_user_profile_pic_url
                    : undefined
                }
                alt={
                  (nominated_by_user_first_name
                    ? nominated_by_user_first_name
                    : undefined) +
                  " " +
                  (nominated_by_user_last_name
                    ? nominated_by_user_last_name
                    : undefined)
                }
                className="h-8 w-8 rounded-full"
              />
              <div className="flex flex-col">
                <div className="text-sm leading-5 font-semibold">
                  Joined{" "}
                  {created_at && dateFormat(new Date(created_at), "mmmm yyyy")}
                </div>
                <div className="text-gray-500 text-sm leading-5 font-normal">
                  Nominated by{" "}
                  {nominated_by_user_first_name && nominated_by_user_first_name}{" "}
                  {nominated_by_user_last_name && nominated_by_user_last_name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-12 my-3 text-gray-600 flex flex-row">
        {connections_count ? (
          <p>
            <b>{connections_count > 500 ? "500+" : connections_count}</b>{" "}
            connections
          </p>
        ) : (
          <p>
            <b>0</b> connections
          </p>
        )}
      </div>
      {connections_count && connections_count > 0 && (
        <div className="text-sm px-14 flex gap-4 items-center">
          <div className="flex">
            {first3.splice(0, 3).map(({ profile_pic_url }, i) => (
              <img
                key={i}
                alt=""
                src={
                  typeof profile_pic_url === "string"
                    ? profile_pic_url
                    : undefined
                }
                className="h-7 w-7 -ml-2 rounded-full border border-white"
              />
            ))}
          </div>
          <p className="text-gray-600 text-base">
            <b className="">
              {connections_count}
              &nbsp;mutual connections:&nbsp;
            </b>
            {first2.map(({ first_name, last_name }, i) => (
              <span key={i}>
                {first_name && first_name} {"  "} {last_name && last_name},{" "}
              </span>
            ))}
            {connections_count > 2 && (
              <span>and {connections_count - 2} others.</span>
            )}
          </p>
        </div>
      )}
      <div className="px-12 py-4 flex gap-2">
        <OutlineButton>Connect</OutlineButton>
        <OutlineButton>Message</OutlineButton>
      </div>
    </div>
  );
}
