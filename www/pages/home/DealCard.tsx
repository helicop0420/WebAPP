import { Transition } from "@headlessui/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import classNames from "www/shared/utils/classNames";
import dealImage from "../../../public/home-images/dealimage.png";

export default function DealCard() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2900);
  }, []);
  let title = "78-Acre Commercial & Residential Development in Elgin, TX";
  let content = `An opportunity to invest in the acquisition and entitlement (“Phase 1”) of approximately 76 acres of land located at 18401 US 290, Elgin,
Texas, only 25 minutes from downtown Austin.`;
  return (
    <Transition show={show} className="relative">
      <div className="relative w-[168px]  h-full box-border ">
        <Transition.Child
          enter="transition ease-out duration-1000 transform"
          enterFrom="opacity-0 scale-50 -translate-x-full -translate-y-full  drop-shadow-none"
          enterTo="opacity-100 scale-100 translate-x-0 translate-y-0  drop-shadow-[0px_0px_100px_rgba(21,128,61,0.5)]"
          leave="transition ease-out duration-500 transform"
          leaveFrom="opacity-100 scale-100 translate-x-full"
          leaveTo="opacity-0 scale-50 translate-x-0"
          className="relative transform origin-center"
        >
          <div className="my-12 w-full flex justify-center flex-col transform origin-center ">
            <div className="px-[10px] py-[13px] bg-black border-1 border-[#15803D] rounded-t-[10px] inline-block mx-auto w-auto justify-self-center ">
              <p className="text-white font-medium text-[10px] leading-[130%]">DEAL</p>
            </div>
            <div
              className={classNames(
                "transition ease-in duration-500 delay-200 w-full box-content relative z-10 -mt-3  border-4 border-opacity-100  stroke-2 rounded-[8px]",
                show ? "border-green-700 border-4 border-opacity-100" : "bg-transparent"
              )}
            >
              <div className="rounded-t-[10px] h-[79px] w-[169px]">
                <Image src={dealImage} alt="home" height={79} width={169} className="h-full" placeholder="blur" />
              </div>
              <div className="pt-[20.34px] px-[8.55px] pb-[9.62px] bg-white rounded-b-[10px] ">
                <p className="font-inter font-semibold text-[8.54795px] leading-[15px] text-gray-900">{title}</p>
                <p className="font-normal text-[6.41096px] leading-[13px]">{content}</p>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}
