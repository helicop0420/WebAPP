import React from "react";

export default function RoundPointer() {
  return (
    <div className="w-[60px] h-[60px] rounded-full bg-[rgba(21,128,61,0.06)] flex justify-center items-center">
      <div className="w-[30px] h-[30px] rounded-full bg-[rgba(21,128,61,0.32)] flex justify-center items-center">
        <div className="w-[14px] h-[14px] rounded-full bg-[#15803D] flex justify-center items-center"></div>
      </div>
    </div>
  );
}
