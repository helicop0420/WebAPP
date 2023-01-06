import React from "react";

export default function DealStatus({ status }: { status: boolean }) {
  // TODO: add logic for pending deals
  return (
    <>
      {status === true && (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      )}
      {status === false && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          Closed
        </span>
      )}
      {/* {status === "Pending" && (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          {status}
        </span>
      )} */}
    </>
  );
}
