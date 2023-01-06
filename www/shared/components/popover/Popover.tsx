import { Popover as PopoverComponent, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { usePopper } from "react-popper";
type Placement =
  | "auto"
  | "auto-start"
  | "auto-end"
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "right"
  | "right-start"
  | "right-end"
  | "left"
  | "left-start"
  | "left-end";
interface PopoverProps {
  children: React.ReactNode;
  element: React.ReactNode;
  placement?: Placement;
  offset?: [number, number];
}

export default function Popover({
  children,
  element,
  placement = "bottom-start",
  offset = [0, 0],
}: PopoverProps) {
  let [referenceElement, setReferenceElement] =
    useState<HTMLSpanElement | null>(null);
  let [openPanel, setOpenPanel] = useState(false);
  let [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          padding: 8,
        },
      },
      {
        name: "offset",
        options: {
          offset: offset,
        },
      },
      {
        name: "flip",
        options: {
          padding: 8,
        },
      },
    ],
  });
  return (
    <div className="inline-flex cursor-pointer w-full">
      <PopoverComponent className="w-full">
        <div
          className="inline w-full"
          onMouseEnter={() => {
            setOpenPanel(true);
          }}
          onMouseLeave={() => {
            setOpenPanel(false);
          }}
        >
          <span className="inline w-full" ref={setReferenceElement}>
            {children}
          </span>
          {openPanel && (
            <Transition
              as={Fragment}
              show={openPanel}
              enter="transition-opacity ease-out duration-200"
              enterFrom="opacity-0 "
              enterTo="opacity-100"
              leave="transition-opacity ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <PopoverComponent.Panel
                static
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="z-[40] "
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-[40] bg-white">
                  {element}
                </div>
              </PopoverComponent.Panel>
            </Transition>
          )}
        </div>
      </PopoverComponent>
    </div>
  );
}
