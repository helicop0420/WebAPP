import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { faEnvelope } from "@fortawesome/pro-thin-svg-icons";
import styles from "./Home.module.css";
import cx from "classnames";

import Image from "next/image";
import { BareModal } from "www/shared/components/modal/Modal";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { addWaitlistEntry } from "./UserHome.fetchers";

const TYPING_DELAY = 3000;
const TYPING_SPEED = 9;

export function HomeHeroHeader() {
  return (
    <div className="flex flex-col  items-center lg:items-start relative w-fit min-w-screen">
      <div className="font-inter font-normal sm:text-5xl text-4xl leading-[48px]  flex gap-2">
        <p className="  text-green-700"> Grow your </p>
        <TypeAnimation
          sequence={["net worth", TYPING_DELAY, "network", TYPING_DELAY]}
          speed={TYPING_SPEED}
          deletionSpeed={TYPING_SPEED}
          wrapper="div"
          cursor={true}
          repeat={Infinity}
          className="text-gray-700 font-bold"
        />
      </div>
      <p className="lg:mt-6 mt-3 font-inter font-normal sm:text-xl text-lg  text-gray-500 max-w-[350px] lg:text-left text-center">
        A professional network for discovering exclusive real estate
        opportunities
      </p>
    </div>
  );
}

export function HomeHeroFooter() {
  const addWaitlistEntryMutate = useMutation(addWaitlistEntry);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const onSignUp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (hasJoined) return;

    await addWaitlistEntryMutate.mutateAsync(email);
    setHasJoined(true);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-col relative w-fit md:min-w-[515px] sm:px-0 px-3">
        <div className="lg:p-6 p-4 bg-white mt-6 rounded-[6px] shadow-[0px_10px_30px_rgba(0,0,0,0.1)]">
          <div className="w-full flex sm:gap-5 gap-2 items-center sm:flex-row flex-col">
            <div className={`mt-1 flex rounded-md shadow-sm w-full flex-1`}>
              <span className="inline-flex rounded-l-[5px] border border-r-0 border-gray-200 bg-[rgba(209,219,227,0.2)] px-3 text-sm text-gray-500 sm:h-[60px] h-[42px] w-[59px] justify-center items-center">
                <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6" />
              </span>
              <div className={cx("relative rounded-md  w-full", styles.hero)}>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cx(
                    "block w-full rounded-r-md border-l-0 border-gray-300 px-4 py-[20px] focus:border-green-500 focus:ring-green-500 sm:text-sm sm:h-[60px] h-10 font-light text-sm leading-[17px] text-[#828B93] bg-white "
                  )}
                  placeholder="Your Email"
                />
              </div>
            </div>
            <button
              className="font-medium text-sm leading-[20px] text-white bg-green-700 sm:py-[20px] sm:px-[26px] rounded-md hover:bg-green-800 active:bg-green-700 active:box-border active:border-2 active:border-green-800 sm:h-[60px] h-10 sm:w-auto w-full"
              onClick={onSignUp}
            >
              {hasJoined ? "On Waitlist" : "Join Waitlist"}
            </button>
          </div>
        </div>
        <p
          className="
          font-normal text-xs leading-[150%] text-gray-500 lg:mt-6 mt-4"
        >
          Currently the platform is referrals-only. Join the waitlist to be
          invited for early access.
        </p>
      </div>
      <WaitlistSuccess isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

function WaitlistSuccess({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <BareModal open={isOpen} setOpen={setIsOpen} size="md">
      <div className="h-full flex flex-col  items-center">
        <h2 className="text-green-700 text-4xl leading-10 font-bold mt-8">
          Success!
        </h2>
        <div className="text-2xl leading-8 font-semibold mt-3 text-gray-700">
          You are on the waitlist
        </div>
        <div className="m-6">
          <Image
            className="bg-white rounded-full"
            src="/home-images/waitlist.svg"
            alt=""
            height={150}
            width={400}
          />
        </div>
        <div className="text-lg leading-7 font-medium w-96 text-center text-gray-500">
          <p>
            You are one step closer to growing your network and net worth with
            Elmase.
          </p>

          <p className="mt-6">We'll email you when your spot is ready</p>
        </div>

        <div className="flex-1" />
        <div className="shadow-2xl px-6 py-4 w-full flex items-center justify-center">
          <button
            className="bg-green-700 py-3 px-5 rounded-md text-white"
            onClick={() => setIsOpen(false)}
          >
            Continue
          </button>
        </div>
      </div>
    </BareModal>
  );
}
