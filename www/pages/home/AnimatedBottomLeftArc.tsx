import { Transition } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";

export default function AnimatedBottomLeftArc() {
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
        width="223"
        height="224"
        viewBox="0 0 223 224"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        // className="animate-arc"
        className={styles.animateArc}
      >
        <path
          d="M0.5 1.00006C0.5 1.00006 98 -8.49994 166.5 57.5001C235 123.5 221 223.5 221 223.5"
          stroke="url(#paint0_radial_4330_13645)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_4330_13645"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(128 90) rotate(-46.2668) scale(143.931 143.931)"
          >
            <stop stopColor="#15803D" stopOpacity="0.62" />
            <stop offset="1" stopColor="#15803D" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </Transition>
  );
}
