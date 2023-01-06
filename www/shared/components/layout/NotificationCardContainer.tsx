import React from "react";
import { classNames } from "www/shared/utils";
import Link from "next/link";
import { intlFormatDistance } from "date-fns";
import Image from "next/image";

export type NotificationCardContainerProps = {
  id: number;
  profilePicUrl: string | null;
  name: string;
  time: string;
  isSeen: boolean;
  handle: string;
  children: React.ReactNode;
};
export default function NotificationCardContainer({
  time,
  profilePicUrl,
  name,
  isSeen,
  handle,
  children,
}: NotificationCardContainerProps) {
  return (
    <div
      className={classNames(
        "pointer-events-auto w-full max-w-[400px]  bg-white ring-1 ring-black ring-opacity-5 hover:bg-green-100",
        isSeen
          ? "bg-white hover:cursor-default"
          : "bg-green-100 hover:cursor-pointer"
      )}
    >
      <div className="p-4 pb-2.5">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Image
              className="h-[30px] w-[30px] rounded-full"
              src={profilePicUrl ?? "/avatar.png"}
              height={30}
              width={30}
              alt=""
            />
          </div>
          <div className="ml-3 w-0 flex-1">
            <Link href={handle}>
              <p className="text-sm leading-5 font-medium text-gray-900 hover:cursor-pointer">
                {name}
              </p>
            </Link>
            {children}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <span className="inline-flex rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs leading-4 font-normal">
              {time && intlFormatDistance(new Date(time), new Date())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
