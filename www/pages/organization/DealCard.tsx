import Image from "next/image";
import Link from "next/link";
import React from "react";

interface DealCardProps {
  title: string | null;
  handle: string | null;
  isActive: boolean | null;
  dealImage: string | null;
  interestCount: number | null;
  dealDescription: string | null;
}
export default function DealCard({
  title,
  handle,
  isActive,
  dealImage,
  interestCount,
  dealDescription,
}: DealCardProps) {
  return (
    <div className="min-w-[334px] lg:max-w-[334px] bg-white border border-1 border-gray-100 hover:shadow-lg rounded-lg flex flex-col justify-between">
      <div className="  h-auto flex flex-col">
        <div className="h-[168px]">
          <Image
            src={dealImage ?? "/organization/dealImg.png"}
            width="334"
            height="168"
            className=" max-w-[334px] max-h-[168px] rounded-t-lg"
            alt=""
          />
        </div>
        <div className="p-4">
          <span className="">
            {isActive ? (
              <p className="text-sm leading-5 font-medium text-green-700 flex space-x-1 items-center gap-2">
                <CheckIcon />
                Active
              </p>
            ) : (
              <p className="text-sm leading-5 font-medium text-gray-700 flex space-x-1 items-center gap-2">
                <LockIcon />
                Closed
              </p>
            )}
          </span>
          <Link
            href={`/deal/${handle}`}
            className="text-lg leading-7 font-semibold"
          >
            <a className="text-lg leading-7 font-semibold text-gray-900 line-clamp-2">
              {title}
            </a>
          </Link>
          <p className="text-sm leading-5 font-normal mt-2 text-gray-500 line-clamp-5">
            {dealDescription}
          </p>
        </div>
      </div>
      <div className="pb-4 px-4">
        <p className="text-gray-500 mt-2 text-xs leading-4 font-normal self-end justify-self-end place-self-end bottom-0">
          <span className="font-bold text-green-700">
            {interestCount
              ? interestCount === 0
                ? "0 people"
                : interestCount === 1
                ? "1 person"
                : `${interestCount} people`
              : "0 people"}
          </span>{" "}
          have expressed interest.
        </p>
      </div>
    </div>
  );
}

const CheckIcon = () => {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 4L3.5 6L8.5 1"
        stroke="#15803D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LockIcon = () => {
  return (
    <svg
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.29995 5.49995C9.29995 6.64038 8.84692 7.7341 8.04051 8.54051C7.2341 9.34692 6.14038 9.79995 4.99995 9.79995C3.85952 9.79995 2.7658 9.34692 1.95939 8.54051C1.15299 7.7341 0.699951 6.64038 0.699951 5.49995C0.699951 4.35952 1.15299 3.2658 1.95939 2.45939C2.7658 1.65299 3.85952 1.19995 4.99995 1.19995C6.14038 1.19995 7.2341 1.65299 8.04051 2.45939C8.84692 3.2658 9.29995 4.35952 9.29995 5.49995ZM5.77777 3.87777C5.98406 3.67148 6.09995 3.39169 6.09995 3.09995C6.09995 2.80821 5.98406 2.52842 5.77777 2.32213C5.57148 2.11584 5.29169 1.99995 4.99995 1.99995C4.70821 1.99995 4.42842 2.11584 4.22213 2.32213C4.01584 2.52842 3.89995 2.80821 3.89995 3.09995C3.89995 3.39169 4.01584 3.67148 4.22213 3.87777C4.42842 4.08406 4.70821 4.19995 4.99995 4.19995C5.29169 4.19995 5.57148 4.08406 5.77777 3.87777ZM4.39995 4.39995C4.10821 4.39995 3.82842 4.51584 3.62213 4.72213C3.41584 4.92842 3.29995 5.20821 3.29995 5.49995C3.29995 5.79169 3.41584 6.07148 3.62213 6.27777C3.70436 6.36 3.79827 6.42786 3.89995 6.47975V7.89995C3.89995 8.19169 4.01584 8.47148 4.22213 8.67777C4.42842 8.88406 4.70821 8.99995 4.99995 8.99995H5.59995C5.89169 8.99995 6.17148 8.88406 6.37777 8.67777C6.58406 8.47148 6.69995 8.19169 6.69995 7.89995C6.69995 7.60821 6.58406 7.32842 6.37777 7.12213C6.29554 7.03991 6.20164 6.97204 6.09995 6.92015V5.49995C6.09995 5.20821 5.98406 4.92842 5.77777 4.72213C5.57148 4.51584 5.29169 4.39995 4.99995 4.39995H4.39995Z"
        fill="#374151"
        stroke="#374151"
      />
    </svg>
  );
};
