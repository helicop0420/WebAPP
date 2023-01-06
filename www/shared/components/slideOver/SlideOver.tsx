import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-thin-svg-icons";

interface LoginSlideOverProps {
  show: boolean;
  setShow: (show: boolean) => void;
  children?: React.ReactNode;
}
export default function SlideOver({
  show,
  setShow,
  children,
}: LoginSlideOverProps) {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={setShow}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full ">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white pb-6 shadow-xl">
                    <div className="px-[18px] py-[22px] sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className=" flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-gray-100 w-7 h-7 text-gray-500 font-bold"
                            onClick={() => setShow(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <FontAwesomeIcon
                              icon={faXmark}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 ">{children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
