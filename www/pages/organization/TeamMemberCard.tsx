import Image from "next/image";
import Link from "next/link";
import React from "react";
interface TeamMemberCardProps {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  profilePics: string | null;
  handle: string | null;
  isConnected: boolean | null;
}
export default function TeamMemberCard({
  firstName,
  lastName,
  title,
  profilePics,
  isConnected,
  handle,
}: TeamMemberCardProps) {
  return (
    <div className="text-center hover:shadow-md p-2 hover:cursor-pointer group min-h-[152px] max-w-[116px]">
      <div className="">
        <Image
          src={profilePics ?? "/avatar.png"}
          width="70"
          height="70"
          className="rounded-full h-[70px] w-[70px]"
          alt=""
        />
      </div>
      <div className="flex flex-col items-center">
        <Link href={`/p/${handle}`}>
          <a className="text-xs leading-4 font-semibold text-black">
            {firstName} {lastName}
          </a>
        </Link>
        <p className="text-xs leading-4 font-medium text-gray-500 group-hover:hidden">
          {title}
        </p>
        {isConnected ? (
          <button className="border bg-green-700 py-2 text-xs leading-4 font-semibold text-white rounded-lg w-fit px-3 mt-2 hover:text-white hover:bg-green-800 focus:bg-green-700 focus:border-3 focus:border-green-800 hidden group-hover:block box-border">
            Connected
          </button>
        ) : (
          <button className="border border-green-700 py-2 text-xs leading-4 font-semibold text-green-700 rounded-lg w-fit px-3 mt-2 hover:text-white hover:bg-green-700 hidden group-hover:block">
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
