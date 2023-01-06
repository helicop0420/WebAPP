import { Transition } from "@headlessui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import classNames from "www/shared/utils/classNames";
import sponsorImage from "../../../public/home-images/sicard1.png";
import cx from "classnames";
import styles from "./Home.module.css";

interface UserCardProps {
  imgSrc?: string;
  name?: string;
  type?: string;
  status?: string;
  animate?: boolean;
}

export default function UserCardStroked({
  name = "Floyd Miles",
  type = "Investor",
  status = "Connected",
}: UserCardProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  }, []);

  return (
    <Transition
      show={show}
      className={cx("relative flex flex-col justify-center drop-shadow-primary  ", styles.shadowPrimary)}
    >
      <div className="relative w-[160px] h-auto box-border">
        <Transition.Child
          enter="transition ease-in duration-500 transform"
          enterFrom="opacity-0  drop-shadow-none"
          enterTo="opacity-100 drop-shadow-[0px_0px_100px_rgba(21,128,61,0.5)]"
          leave="transition-opacity ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="relative"
        >
          <div
            className={classNames(
              "transition ease-in duration-500 hover:bg-gradient-to-r hover:shadow-lg   border-4  rounded-[8px] box-content h-[170px] relative",
              loading ? "border-green-700 border-4 border-opacity-100" : "border-transparent border-opacity-0"
            )}
          >
            <Image
              src={sponsorImage}
              alt="home"
              height={180}
              width={160}
              className="h-[180px] box-content p-0 m-0"
              onLoadingComplete={() => setLoading(true)}
            />
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
          <div className="w-[150px] bg-[#FFFFFF]  rounded-[6px] ">
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
