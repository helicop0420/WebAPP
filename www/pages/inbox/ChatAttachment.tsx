import React from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/future/image";

interface ChatAttachmentProps {
  dealTitle: string | null;
  dealAbout: string | null;
  dealHandle: string | null;
  dealImage: string | null;
}
export default function ChatAttachment({
  dealTitle,
  dealAbout,
  dealHandle,
  dealImage,
}: ChatAttachmentProps) {
  return (
    <div className="rounded-lg border border-gray-100 h-[365px] w-5/6 py-2 px-3 mb-9">
      <p className="text-sm leading-5 font-bold text-gray-700">{dealTitle}</p>
      <p className="text-sm leading-5 font-normal text-gray-700 mt-5">
        {dealAbout}
        <Link href={`/deal/${dealHandle}`}>
          <b className="flex-row inline hover:cursor-pointer">
            see more <FontAwesomeIcon icon={faArrowRight} />
          </b>
        </Link>
      </p>
      <div className="overflow-hidden flex-none">
        <Image
          src={dealImage ? dealImage : ""}
          alt="deal pic"
          className="object-cover h-64 rounded-lg"
          width={492}
          height={254}
        />
      </div>
    </div>
  );
}
