import Image from "next/image";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import _ from "lodash";

interface AvatarStackProps {
  pictureUrls: string[];
}
export default function AvatarStack({ pictureUrls }: AvatarStackProps) {
  return (
    <div className="isolate flex -space-x-1 overflow">
      {_.take(pictureUrls, Math.min(2, pictureUrls.length)).map((pic, index) => (
        <div
          key={index}
          className={`relative w-8 h-8 rounded-full ring-1 ring-white overflow-hidden ${index === 0 ? "z-20" : "z-10"}`}
        >
          <Image
            src={pic}
            alt={"profile pic"}
            className="inline-block rounded-full h-[32px] w-[32px] object-cover"
            style={{ width: "32px", height: "32px" }}
            width={32}
            height={32}
          />
        </div>
      ))}
      {pictureUrls.length >= 3 && (
        <div className="relative w-8 h-8 rounded-full ring-1 ring-white overflow-hidden bg-gray-500 text-white flex justify-center text-center items-center">
          <FontAwesomeIcon icon={faPlus} className="text-white" />
        </div>
      )}
    </div>
  );
}
