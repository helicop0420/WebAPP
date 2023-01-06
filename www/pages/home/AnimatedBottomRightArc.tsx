import { Transition } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";

export default function AnimatedBottomRightArc() {
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1500);
  }, []);

  const [show, setShow] = useState(false);
  return (
    <Transition
      appear={true}
      show={show}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <svg
        width="213"
        height="211"
        viewBox="0 0 213 211"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        // className="animate-arc"
        className={styles.animateArc}
      >
        <path
          d="M212 7.99976C212 7.99976 125.179 -21.5002 56.6786 44.4998C-11.8214 110.5 2.17865 210.5 2.17865 210.5"
          stroke="url(#paint0_radial_4330_13646)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_4330_13646"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(85.9999 68.4998) rotate(-140.809) scale(138.471 138.471)"
          >
            <stop stopColor="#15803D" stopOpacity="0.62" />
            <stop offset="1" stopColor="#15803D" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </Transition>
  );
}
