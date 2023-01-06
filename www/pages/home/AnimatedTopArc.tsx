import { Transition } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";

export default function AnimatedTopArc() {
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
      enter="transition duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <svg
        width="434"
        height="128"
        viewBox="0 0 434 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.animateArc}
      >
        <path
          d="M0.5 104.5C0.5 104.5 71.5 0.499844 218 0.999844C364.5 1.49984 433.5 127 433.5 127"
          stroke="url(#paint0_radial_4330_13647)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_4330_13647"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(225 -79.0001) rotate(89.8232) scale(324.002 324.002)"
          >
            <stop stopColor="#15803D" stopOpacity="0.62" />
            <stop offset="1" stopColor="#15803D" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </Transition>
  );
}
