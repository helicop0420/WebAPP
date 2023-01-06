import { Transition } from "@headlessui/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function MiniCard({ imgSrc }: { imgSrc?: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2900);
  }, []);
  return (
    <>
      <Transition show={show} className="relative">
        <div className="relative w-[160px] h-full">
          <Transition.Child
            enter="transition-transform ease-out duration-[9000] transform"
            enterFrom=" scale-0 opacity-0"
            enterTo=" scale-100 opacity-100"
            leave="transition-transform ease-out duration-[9000] transform"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="relative transform origin-center"
          >
            <div className="w-[66px]">
              <div className="">
                <Image
                  src={imgSrc ?? "/home-images/minicardimg1.png"}
                  height={66}
                  width={66}
                  className="h-[66px] w-[66px]"
                  alt="mini card"
                />
              </div>
              <div className="flex w-full justify-center -mt-2">
                <div className="w-[30px] h-[30px] rounded-full bg-[rgba(21,128,61,0.06)] flex justify-center items-center">
                  <div className="w-[15px] h-[15px] rounded-full bg-[rgba(21,128,61,0.32)] flex justify-center items-center">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#15803D] flex justify-center items-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
}
