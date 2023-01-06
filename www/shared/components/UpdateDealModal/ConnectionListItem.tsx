import React from "react";
import { classNames } from "www/shared/utils";

export default function ConnectionListItem({
  imageUrl,
  name,
  subtitle,
  onDelete,
}: {
  name: string;
  subtitle?: string | null;
  imageUrl: string;
  onDelete?: () => void;
}) {
  return (
    <div
      className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-green-700 hover:text-white hover:font-semibold"
      onClick={onDelete}
    >
      <div className="flex items-center group">
        <img
          src={imageUrl}
          alt=""
          className="h-9 w-9 flex-shrink-0 rounded-full"
          // height={36}
          // width={36}
        />
        <div className="flex flex-col ml-3">
          <div className={classNames("truncate", "text-sm font-medium")}>
            {name}
          </div>
          {subtitle && (
            <div
              className={`text-xs leading-4 font-normal text-gray-500
            group-hover:text-white`}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
