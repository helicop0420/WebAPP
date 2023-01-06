import React from "react";

export default function DealCard() {
  return (
    <div className="p-4 pb-11 sm:w-[250px] bg-[#D2D5DA] rounded-[6px]">
      <div className="h-16 bg-[#E4E7EA]"></div>
      <div className="top flex flex-col space-y-3 ">
        {/* Status */}
        <p className="">Active</p>
        {/* Title */}
        <p
          className="
          font-inter font-[13px] font-medium leading-5"
        >
          78-Acre Commercial & Residential Development in Elgin, TX
        </p>
        {/* img will be here */}
        <p className="text-[#158040] font-inter font-[13px] font-semibold leading-5">
          Go to deal
        </p>
        {/* show publicly or not */}
        <fieldset className="">
          <legend className="sr-only">Notifications</legend>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="comments" className="font-medium text-gray-700">
                Show publicly on profile
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
