import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-light-svg-icons";

import React from "react";

export default function ModalHeader({
  title = "Modal",
  setOpen,
}: {
  title?: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="bg-white h-[82px] fixed top-0 w-full px-[30px] pt-[30px] pb-[24px] flex justify-between z-10">
      <p className="font-inter font-bold text-[20px] leading-[28px] text-[#374151] line-clamp-1">
        {title}
      </p>
      <button
        // ref={ref}
        onClick={() => setOpen(false)}
      >
        <FontAwesomeIcon icon={faXmark} className="text-green-700" size="xl" />
      </button>
    </div>
  );
}
