import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

interface UserCardProps {
  profile: UserProfile | null;
  icon?: IconProp;
  showIcon?: boolean;
}
interface UserProfile {
  subtitle: string | null;
  firstName: string | null;
  handle: string | null;
  lastName: string | null;
  profilePicUrl: string | null;
}
export default function UserCard({ profile, icon, showIcon }: UserCardProps) {
  const {
    firstName,
    lastName,
    handle = "",
    profilePicUrl,
    subtitle = "",
  } = profile ?? {};
  return (
    <Link href={handle ? `/p/${handle}` : "/"}>
      <li className="py-2">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Image
              className="h-10 w-10 rounded-full"
              height={40}
              width={40}
              src={profilePicUrl ?? "/avatar.png"}
              alt=""
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{`${firstName} ${lastName}`}</p>
            <p className="truncate text-xs leading-4 font-normal text-gray-500">
              {subtitle}
            </p>
          </div>
          {showIcon && (
            <div className="bg-green-700 h-7 w-7 rounded-md flex justify-center items-center hover:cursor-pointer group hover:bg-green-900">
              <FontAwesomeIcon
                icon={icon ?? faMessage}
                className="text-white group-hover:text-gray-100"
              />
            </div>
          )}
        </div>
      </li>
    </Link>
  );
}
