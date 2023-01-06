import Image from "next/image";
import React from "react";

export default function HomeHeader({
  setShow,
}: {
  setShow: (show: boolean) => void;
}) {
  return (
    <div className="flex justify-between w-full px-[30px] py-[19px] bg-white items-center">
      <div className="flex items-center">
        <Image
          className="cursor-pointer"
          height={32}
          width={31}
          src="/logo.svg"
          alt=""
        />
        <p className="font-inter font-semibold text-2xl leading-[29px] text-green-700">
          ELMBASE
        </p>
      </div>
      <button
        className="text-green-700 text-base leading-6 font-semibold bg-white p-2 hover:bg-green-100 active:border-2 border-none"
        onClick={() => setShow(true)}
      >
        Login
      </button>
    </div>
  );
}
