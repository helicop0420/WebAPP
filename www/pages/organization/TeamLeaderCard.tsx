import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { MutualConnections } from "types/views";
interface TeamLeaderCardProps {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  profilePics: string | null;
  twitter: string | null;
  linkedIn: string | null;
  handle: string | null;
  isConnected: boolean | null;
  mutualConnections: MutualConnections[] | null;
}
export default function TeamLeaderCard({
  firstName,
  lastName,
  title,
  profilePics,
  isConnected,
  handle,
  twitter,
  linkedIn,
  mutualConnections,
}: TeamLeaderCardProps) {
  return (
    <div className="md:grid md:grid-cols-2 gap-[58px]">
      {/* left */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Image
              className="h-14 w-14 rounded-full lg:h-20 lg:w-20"
              src={profilePics ?? "/avatar.png"}
              alt=""
              height="56"
              width="56"
            />
            <div className="space-y-1 text-lg font-medium leading-6">
              <h3 className="text-sm leading-5 font-bold flex gap-2 items-center">
                <Link href={`/p/${handle}`}>
                  <a className="">
                    {firstName} {lastName}
                  </a>
                </Link>
                <span className="flex gap-1 items-center">
                  <CheckBadgeSVG />
                  <LeafBadgeSVG />
                </span>
              </h3>
              <p className="text-green-700 text-sm leading-5 font-medium">
                {title}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 min-w-[52px]">
          {twitter && (
            <a href={twitter} className="">
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
            </a>
          )}
          {linkedIn && (
            <a href={linkedIn} className="">
              <FontAwesomeIcon icon={faLinkedin} className="h-5 w-[18px]" />
            </a>
          )}
        </div>
      </div>
      {/* right */}
      <div className="inline-flex flex-col md:flex-row justify-between items-center">
        {mutualConnections && (
          <p className="text-xs leading-4 font-normal text-gray-500">
            {/* Leslie Abbott, Richard Hendricks, and 32 other mutual connections */}
            <MutualList
              mutuals={mutualConnections.map(
                (connection) =>
                  `${connection.first_name} ${connection.last_name}`
              )}
            />
          </p>
        )}
        {isConnected ? (
          <button className="border bg-green-700 py-2 text-sm leading-5 font-semibold text-white rounded-lg w-fit px-3 mt-2 hover:text-white hover:bg-green-800 focus:bg-green-700 focus:border-3 focus:border-green-800 hidden group-hover:block box-border">
            Connected
          </button>
        ) : (
          <button className="border border-green-700 py-2 text-sm leading-5 font-semibold text-green-700 rounded-lg  mt-2 hover:bg-green-700 hover:text-white w-fit px-3">
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

const LeafBadgeSVG = () => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.1082 1.91269C5.76444 2.20573 5.33699 2.38284 4.8867 2.41879C4.3782 2.45943 3.9008 2.67986 3.54009 3.04058C3.17938 3.40129 2.95895 3.87869 2.9183 4.38719C2.88235 4.83747 2.70525 5.26493 2.4122 5.60869C2.08152 5.99695 1.8999 6.49029 1.8999 7.00029C1.8999 7.51027 2.08152 8.00363 2.4122 8.39192C2.70525 8.73562 2.88235 9.16311 2.9183 9.61342C2.95895 10.1219 3.17938 10.5993 3.54009 10.96C3.9008 11.3207 4.3782 11.5412 4.8867 11.5818C5.33699 11.6177 5.76444 11.7948 6.1082 12.0879C6.49647 12.4186 6.98981 12.6002 7.4998 12.6002C8.00978 12.6002 8.50314 12.4186 8.89143 12.0879C9.23513 11.7948 9.66262 11.6177 10.1129 11.5818C10.6214 11.5412 11.0988 11.3207 11.4595 10.96C11.8202 10.5993 12.0407 10.1219 12.0813 9.61342C12.1172 9.16311 12.2943 8.73562 12.5874 8.39192C12.9181 8.00363 13.0997 7.51027 13.0997 7.00029C13.0997 6.49029 12.9181 5.99695 12.5874 5.60869C12.2941 5.26499 12.117 4.83729 12.0813 4.38719C12.0407 3.87869 11.8202 3.40129 11.4595 3.04058C11.0988 2.67986 10.6214 2.45943 10.1129 2.41879C9.66262 2.38284 9.23513 2.20573 8.89143 1.91269C8.50314 1.58201 8.00978 1.40039 7.4998 1.40039C6.98981 1.40039 6.49647 1.58201 6.1082 1.91269Z"
        fill="url(#paint0_linear_6399_77167)"
      />
      <path
        d="M10.125 4.375V4.95833C10.125 7.76622 8.55791 9.04169 6.625 9.04169H6.07025C6.13208 8.16319 6.40567 7.63147 7.11967 6.99971C7.47083 6.68908 7.44108 6.50971 7.26812 6.61267C6.07696 7.32144 5.48546 8.27925 5.45921 9.80875L5.45833 9.91669H4.875C4.875 9.51916 4.90883 9.15831 4.97592 8.82819C4.90883 8.45075 4.875 7.93856 4.875 7.29169C4.875 5.68079 6.18079 4.375 7.79169 4.375C8.375 4.375 8.95831 4.66667 10.125 4.375Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6399_77167"
          x1="-1.99614"
          y1="13.3752"
          x2="11.0325"
          y2="-1.08114"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60451E" />
          <stop offset="0.401042" stopColor="#D5B770" />
          <stop offset="0.609375" stopColor="#E9CB7E" />
          <stop offset="1" stopColor="#987730" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const CheckBadgeSVG = () => {
  return (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.8867 1.41879C4.33698 1.38284 4.76444 1.20573 5.1082 0.912692C5.49647 0.582006 5.9898 0.400391 6.4998 0.400391C7.00981 0.400391 7.50314 0.582006 7.8914 0.912692C8.23516 1.20573 8.66262 1.38284 9.1129 1.41879C9.62141 1.45943 10.0988 1.67987 10.4595 2.04058C10.8202 2.40129 11.0407 2.87869 11.0813 3.38719C11.117 3.83729 11.2941 4.26499 11.5874 4.60869C11.9181 4.99696 12.0997 5.49029 12.0997 6.00029C12.0997 6.51029 11.9181 7.00363 11.5874 7.39189C11.2944 7.73565 11.1173 8.16311 11.0813 8.61339C11.0407 9.12189 10.8202 9.59929 10.4595 9.96001C10.0988 10.3207 9.62141 10.5412 9.1129 10.5818C8.66262 10.6177 8.23516 10.7948 7.8914 11.0879C7.50314 11.4186 7.00981 11.6002 6.4998 11.6002C5.9898 11.6002 5.49647 11.4186 5.1082 11.0879C4.76444 10.7948 4.33698 10.6177 3.8867 10.5818C3.3782 10.5412 2.9008 10.3207 2.54009 9.96001C2.17938 9.59929 1.95894 9.12189 1.9183 8.61339C1.88235 8.16311 1.70525 7.73565 1.4122 7.39189C1.08152 7.00363 0.899902 6.51029 0.899902 6.00029C0.899902 5.49029 1.08152 4.99696 1.4122 4.60869C1.70525 4.26493 1.88235 3.83747 1.9183 3.38719C1.95894 2.87869 2.17938 2.40129 2.54009 2.04058C2.9008 1.67987 3.3782 1.45943 3.8867 1.41879ZM9.0947 5.09519C9.22221 4.96317 9.29277 4.78635 9.29117 4.60281C9.28958 4.41927 9.21596 4.2437 9.08618 4.11392C8.95639 3.98413 8.78082 3.91051 8.59728 3.90892C8.41375 3.90733 8.23693 3.97788 8.1049 4.10539L5.7998 6.41049L4.8947 5.50539C4.76268 5.37788 4.58586 5.30733 4.40232 5.30892C4.21878 5.31052 4.04322 5.38413 3.91343 5.51392C3.78365 5.6437 3.71003 5.81927 3.70843 6.00281C3.70684 6.18635 3.77739 6.36317 3.9049 6.49519L5.3049 7.89519C5.43617 8.02642 5.61419 8.10014 5.7998 8.10014C5.98542 8.10014 6.16343 8.02642 6.2947 7.89519L9.0947 5.09519Z"
        fill="#15803D"
      />
    </svg>
  );
};

const MutualList = ({ mutuals }: { mutuals: any[] }) => {
  return (
    <span>
      {mutuals && (
        <>
          {mutuals.length === 1 && (
            <span className="mutuals">
              {mutuals[0]} is in mutual connections
            </span>
          )}
          {mutuals.length === 2 && (
            <span className="mutuals">
              {mutuals[0]} and {mutuals[1]} are in mutual connections
            </span>
          )}
          {mutuals.length > 2 && (
            <span className="mutuals">
              {mutuals[0]}, {mutuals[1]} and {mutuals.length - 2} other mutual
              connections
            </span>
          )}
        </>
      )}
    </span>
  );
};
