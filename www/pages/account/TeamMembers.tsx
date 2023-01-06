import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import TeamMembersListPopover from "./TeamMembersListPopover";
import { usePopper } from "react-popper";
import { DealDashboardRowSponsors } from "types/views";
import _ from "lodash";

interface TeamMembersProps {
  teamMembers: DealDashboardRowSponsors[] | null;
}
export default function TeamMembers({ teamMembers }: TeamMembersProps) {
  let [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(
    null
  );
  let [openPanel, setOpenPanel] = useState(false);
  let [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
  });
  return (
    <div className="">
      <Popover>
        <div
          onMouseEnter={() => {
            setOpenPanel(true);
          }}
          onMouseLeave={() => {
            setOpenPanel(false);
          }}
        >
          <div className="flex items-center space-x-1 relative">
            <div
              className="flex -space-x-1 overflow-hidden"
              ref={setReferenceElement}
            >
              {teamMembers &&
                _.take(teamMembers, 3).map((member) => (
                  <div
                    key={member.user_id}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  >
                    <Image
                      src={member.profile_pic_url ?? "/avatar.png"}
                      alt={member.handle ?? "Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                ))}
            </div>
            <p className="">
              {teamMembers &&
                teamMembers?.length >= 4 &&
                `+${teamMembers?.length - 3}`}
            </p>
          </div>
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
              <Popover.Panel
                static
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="z-[6]"
              >
                <TeamMembersListPopover teamMembers={teamMembers} />
              </Popover.Panel>
            </Transition>
          )}
        </div>
      </Popover>
    </div>
  );
}
