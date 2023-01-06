import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MutualTeamMemberCardProps {
  firstName: string | null;
  lastName: string | null;
  subtitle: string | null;
  profilePic: string | null;
  handle: string | null;
  isConnected: boolean | null;
  mutualConnections: number | null;
}
export default function MutualTeamMemberCard({
  firstName,
  lastName,
  handle,
  profilePic,
  isConnected,
  subtitle,
  mutualConnections,
}: MutualTeamMemberCardProps) {
  return (
    <div className="flex items-start space-x-2 lg:space-x-2 pb-3 border-b border-b-gray-100">
      <Image
        className="h-[50px] w-[50px] rounded-full lg:h-[50px] lg:w-[50px]"
        src={profilePic ?? "/avatar.png"}
        alt=""
        height="50"
        width="50"
      />
      <div className=" text-sm leading-5 font-medium space-y-2">
        <span className="span">
          <Link href={`p/${handle}`}>
            <a className="text-sm/leading-5/font-medium">
              {firstName} {lastName}
            </a>
          </Link>
          <p className="text-gray-500 text-sm leading-5 font-normal">
            {/* Seasoned Investor,{" "}
            <Link href="">
              <a className=" font-semibold">Hogwash</a>
            </Link>{" "} */}
            {subtitle}
          </p>
        </span>
        <span className="flex space-x-1 items-center">
          <InfinitySVG />
          <p className="text-gray-500 text-xs leading-4 font-normal">
            {mutualConnections} mutual connections
          </p>
        </span>
        {isConnected ? (
          <button className="border bg-green-700 py-2 text-sm leading-5 font-semibold text-white rounded-md w-fit px-3 mt-2 hover:text-white hover:bg-green-800 focus:bg-green-700 focus:border-3 focus:border-green-800 hidden group-hover:block box-border">
            Connected
          </button>
        ) : (
          <button className="button text-white bg-green-700 py-2 px-3 rounded-md text-sm leading-5 font-semibold inline w-auto">
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

const InfinitySVG = () => {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="10"
        height="10"
        rx="5"
        stroke="#6B7280"
        strokeWidth="2"
      />
      <rect
        x="9"
        y="1"
        width="10"
        height="10"
        rx="5"
        stroke="#6B7280"
        strokeWidth="2"
      />
    </svg>
  );
};
