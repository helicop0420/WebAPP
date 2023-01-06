import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardQuestion } from "@fortawesome/pro-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/pro-light-svg-icons";
import { Disclosure, Transition } from "@headlessui/react";
import { faChevronUp } from "@fortawesome/pro-light-svg-icons";
import { useEffect, useState } from "react";
import { DealFaq } from "types/views";
import EditFaqModal from "./EditFaqModal";
import ModalWrapper from "www/shared/components/modal/ModalWrapper";
interface FaqItemProps {
  dealFaqs: DealFaq[] | null;
  isDealOwner: boolean;
  dealId: number;
}
const FAQ = ({ dealFaqs, isDealOwner, dealId }: FaqItemProps) => {
  return (
    <section aria-labelledby="" className="mt-[26px] mb-[56px] px-10">
      {dealFaqs && dealFaqs.length > 0 ? (
        <FaqPosts
          dealFaqs={dealFaqs}
          isDealOwner={isDealOwner}
          dealId={dealId}
        />
      ) : (
        <EmptyState isDealOwner={isDealOwner} dealId={dealId} />
      )}
    </section>
  );
};

const FaqPosts = ({
  dealFaqs,
  isDealOwner,
  dealId,
}: {
  dealFaqs: DealFaq[];
  isDealOwner: boolean;
  dealId: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <ModalWrapper open={open} setOpen={setOpen}>
        <EditFaqModal
          dealFaqs={dealFaqs}
          dealId={dealId}
          openEditFaqModal={setOpen}
          setOpen={setOpen}
          title="Edit FAQ"
        />
      </ModalWrapper>
      <div className="flex justify-between items-center">
        <p className="text-xl leading-7 font-extrabold">
          Frequently Asked Questions
        </p>
        <span className="flex space-x-2">
          <button
            className="px-4 py-2 rounded-md border border-gray-500 text-sm leading-5 font-medium"
            onClick={() => {
              setShowAll(!showAll);
            }}
          >
            {showAll ? "Hide all" : "Show all"}
          </button>
          {isDealOwner && (
            <button
              className="px-4 py-2 rounded-md border border-gray-500 text-sm leading-5 font-medium space-x-2"
              onClick={() => setOpen(true)}
            >
              <FontAwesomeIcon icon={faPenToSquare} className="h-3 w-3" /> Edit
            </button>
          )}
        </span>
      </div>
      {/* Faq list */}
      <div className="mt-6">
        <FaqItemsList showAll={showAll} dealFaqs={dealFaqs} />
      </div>
    </div>
  );
};

const FaqItemsList = ({
  showAll,
  dealFaqs,
}: {
  showAll: boolean;
  dealFaqs: DealFaq[];
}) => {
  return (
    <div className="w-full pt-4">
      {dealFaqs.map((faq, index) => (
        <FaqItem showAll={showAll} key={index} faq={faq} />
      ))}
    </div>
  );
};

export default FAQ;

const EmptyState = ({
  isDealOwner,
  dealId,
}: {
  isDealOwner: boolean;
  dealId: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {isDealOwner && (
        <div className="flex justify-end">
          <span className="flex space-x-2">
            {isDealOwner && (
              <button
                className="px-4 py-2 rounded-md border border-gray-500 text-sm leading-5 font-medium space-x-2"
                onClick={() => setOpen(true)}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="h-3 w-3" /> Add
              </button>
            )}
          </span>
        </div>
      )}

      <div className="bg-white sm:overflow-hidden sm:rounded-lg mx-4 px-6 py-[70px]">
        <ModalWrapper open={open} setOpen={setOpen}>
          <EditFaqModal
            dealId={dealId}
            openEditFaqModal={setOpen}
            setOpen={setOpen}
            title="Edit FAQ"
          />
        </ModalWrapper>
        <div className="flex justify-center flex-col items-center pt-[26px] pb-12">
          <FontAwesomeIcon
            icon={faClipboardQuestion}
            className="text-gray-500 text-2xl "
          />
          <p className="text-base leading-6 font-semibold mt-3 text-gray-600">
            No FAQ Posts Yet
          </p>
          <p className="text-base leading-6 font-semibold mt-1"></p>
        </div>
      </div>
    </div>
  );
};

const FaqItem = ({ showAll, faq }: { showAll: boolean; faq: DealFaq }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(showAll);
  }, [showAll]);

  return (
    <div className="mx-auto w-full max-w-full rounded-2xl bg-white p-2 space-y-4">
      <Disclosure>
        <>
          <div className="border border-gray-200 hover:border-gray-500 rounded-md px-4 py-3 box-content">
            <Disclosure.Button
              className="flex w-full justify-between text-left text-gray-900 text-sm leading-5 font-semibold"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <span>{faq.question}</span>
              <FontAwesomeIcon
                icon={faChevronUp}
                className={`${
                  open ? "rotate-180 transform" : "rotate-90 transform"
                } h-5 w-5 text-gray-700 `}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className=" pt-3 pb-1 text-sm text-gray-500 leading-5 font-normal">
                {faq.answer}
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      </Disclosure>
    </div>
  );
};
