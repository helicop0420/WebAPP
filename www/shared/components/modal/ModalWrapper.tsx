/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useCallback, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
interface ModalWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
}
export default function ModalWrapper({
  open,
  setOpen,
  children,
}: ModalWrapperProps) {
  const cancelButtonRef = useRef(null);
  const keyPressedFn = useCallback(
    ({ keyCode }: { keyCode: number; [id: string]: any }) => {
      //   keycode 27, is for escape key; with escape the modal will close
      if (keyCode === 27) {
        setOpen(false);
      }
    },
    [setOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPressedFn, false);
    return () => {
      document.removeEventListener("keydown", keyPressedFn, false);
    };
  }, [keyPressedFn]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto h-screen"
        initialFocus={cancelButtonRef}
        onClose={() => {}}
      >
        <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0 h-full">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setOpen(false)}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle "
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <span className="w-full h-full">{children}</span>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
