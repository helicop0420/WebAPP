import { Transition } from "@headlessui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
interface UserCardProps {
  imgSrc?: string;
  name?: string;
  type?: string;
  status?: string;
  animate?: boolean;
}
export default function UserCard({
  imgSrc = "/home-images/sicard1.png",
  name = "Floyd Miles",
  type = "Investor",
  status = "Connected",
}: UserCardProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  }, []);

  return (
    <Transition show={show} className="relative flex flex-col justify-center">
      <div className="relative w-[160px] h-full box-content">
        <Transition.Child
          enter="transition-opacity ease-in duration-[900]"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-[900]"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="relative"
        >
          <div
            className={`rounded-[10px]  transition hover:bg-gradient-to-r hover:shadow-lg  h-[180px] border-box 
            `}
          >
            <Image src={imgSrc} alt="home" height={180} width={160} className="rounded-[10px]" />
          </div>
        </Transition.Child>
        <Transition.Child
          enter="transition ease-in-out delay-1000 duration-1000 transform opacity"
          enterFrom="-translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transition ease-in-out delay-1000 duration-1000 transform opacity"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="-translate-x-full opacity-0"
          className="absolute -bottom-[10%] -right-[15%]"
        >
          <div className="w-[150px] bg-[#FFFFFF] shadow-[0px_40px_80px_rgba(0,0,0,0.1)] rounded-[6px] ">
            <div className="relative  px-[10px] py-[15px]">
              <div className="w-[70%]">
                <p className="font-medium text-sm leading-[20px]">{name}</p>
                <p className="font-medium text-xs text-green-700">{type}</p>
              </div>
              <Transition.Child
                enter="transition ease-in-out delay-[2000ms] duration-1000 transform opacity  "
                enterFrom=" opacity-0 transform"
                enterTo=" opacity-100 transform"
                leave="transition ease-in-out delay-[2000ms] duration-1000 transform opacity "
                leaveFrom=" opacity-100 transform"
                leaveTo=" opacity-0 transform"
                className="absolute top-[25%] -right-[25%]"
              >
                <div className="p-[10px] bg-green-700 inline-block shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-[8px]">
                  <p className="font-medium text-xs text-white">{status}</p>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}
