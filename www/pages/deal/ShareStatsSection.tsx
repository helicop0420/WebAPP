import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faArrowsRetweet } from "@fortawesome/pro-solid-svg-icons";

export default function ShareStatsSection() {
  return (
    <div className="p-4 bg-white rounded-lg flex flex-col space-y-6">
      <p className="text-2xl leading-8 font-extrabold tracking-tight text-gray-900">Share</p>
      <p className="text-base leading-6 font-normal text-gray-500">
        You have <span className="text-base leading-6 font-semibold">5</span> invites.
      </p>
      <div className="flex flex-row justify-start px-0">
        <button className="bg-green-700 py-2 px-5 text-white rounded flex flex-row justify-center mr-1 items-center  hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
          <p className="text-sm leading-5 font-medium ml-2">Refer a friend</p>
        </button>
        <button className="bg-green-700 py-2 px-5 text-white rounded flex flex-row justify-center mx-1 items-center  hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border">
          <FontAwesomeIcon icon={faArrowsRetweet} size="lg" />
          <p className="text-sm leading-5 font-medium ml-2">Repost</p>
        </button>
      </div>
    </div>
  );
}
