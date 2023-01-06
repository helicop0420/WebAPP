/* eslint-disable @next/next/no-img-element */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { take } from "lodash";

import { ProfilePageView } from "types/views";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ProjectsProps {
  profile: ProfilePageView;
}

export default function Projects({ profile }: ProjectsProps) {
  const { deals, handle } = profile;

  return (
    <div className="bg-white rounded-lg pt-6 pb-8 pl-11 flex-none">
      <div className="text-3xl font-extrabold mb-11">Projects</div>
      <div className="overflow-x-auto flex flex-nowrap flex-row gap-10 box-border pb-4 -ml-3 mb-7">
        {deals &&
          take(deals, 4).map(
            ({ deal_image, is_active, about, title, interest_count }, i) => (
              <div
                key={i}
                style={{
                  // Using a background instead of an image to avoid interference with the width
                  backgroundImage: `url('${deal_image && deal_image}')`,
                  backgroundSize: "100% 50%",
                }}
                className="rounded shadow-lg pt-52 bg-no-repeat w-96 box-border flex-none ml-3"
              >
                <div className="flex flex-col px-4 pb-4 py-3 box-border bg-white rounded-b-lg h-full">
                  <div
                    className={classNames(
                      is_active === true ? "text-green-600" : "text-gray-700",
                      "flex gap-2 items-center font-medium text-sm leading-5"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={is_active === true ? faCheck : faCircleExclamation}
                      size="xs"
                    />
                    {is_active ? "Active" : "Closed"}
                  </div>
                  <div className="h-full relative">
                    <div className="mb-12 pb-2">
                      <p className="mt-1 text-xl leading-7 font-semibold text-gray-900">
                        {title && title}
                      </p>
                      <div className="max-w-none mt-2 text-gray-500 text-base leading-6 font-normal">
                        {about && about}
                      </div>
                    </div>
                    <div className="text-gray-500 text-base leading-6 font-normal absolute bottom-2">
                      <b>{interest_count ? interest_count : 0} people</b>
                      &nbsp;have expressed interest.
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
      <div className="mt-4">
        <Link href={`/p/${handle}/projects`}>
          <div className="text-green-700 hover:text-green-900 cursor-pointer text-base leading-6 font-medium">
            View all projects{" "}
            <FontAwesomeIcon icon={faArrowRight} size="sm" className="ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
