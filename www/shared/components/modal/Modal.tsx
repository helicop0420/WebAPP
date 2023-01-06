import { Fragment, useRef, useCallback, useEffect, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-light-svg-icons";
interface ModalWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: ReactNode;
  title?: string;
}
export default function ModalWrapper({
  open,
  setOpen,
  children,
  title = "Modal",
}: ModalWrapperProps) {
  const cancelButtonRef = useRef(null);
  const keyPressedFn = useCallback(
    ({ keyCode }: { keyCode: number; [id: string]: any }) => {
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
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
            {/* my paste starts here */}
            <div className="inline-block align-bottom bg-white rounded-lg  pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[815px] sm:w-full  overflow-y-hidden h-full max-h-[83.33%] relative">
              {/* Header content here */}
              <div className="bg-white h-[82px] fixed top-0 w-full px-[30px] pt-[30px] pb-[24px] flex justify-between z-10">
                <p className="font-inter font-bold text-[20px] leading-[28px] text-[#374151]">
                  {title}
                </p>
                <button
                  // ref={ref}
                  onClick={() => setOpen(false)}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-green-700"
                    size="xl"
                  />
                </button>
              </div>
              {children}
              {/* Footer content here */}
              {/* <div className="bg-white px-8 py-[24.5px] h-[103px] absolute bottom-0 w-full flex justify-end shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]">
                <button className="px-12 py-4 bg-[#15803D] rounded-[6px]">Save</button>
              </div> */}
            </div>
            {/* my paste ends here */}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function BareModal({
  open,
  setOpen,
  children,
  size = "default",
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: ReactNode;
  size: "default" | "md";
}) {
  let windowSize = "sm:max-w-[815px] h-full max-h-[83.33%]";
  if (size === "md") {
    windowSize = "w-[522px] h-[543px]";
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto h-screen"
        onClose={() => {}}
      >
        <div className="flex items-end justify-center text-center sm:block sm:p-0 h-full">
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
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
            <div
              className={`inline-block align-middle bg-white text-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all ${windowSize} relative `}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
