import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import Image from "next/future/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMessage } from "@fortawesome/free-solid-svg-icons";
import { OrgMember, Sponsor } from "types/views";
import Popover from "www/shared/components/popover";
import UserList from "www/shared/components/user_list";
interface TeamLeadHeaderProps {
  open?: boolean;
  sponsor: Sponsor | null;
  orgMembers: OrgMember[] | null;
  children?: Element;
  as: ForwardRefExoticComponent<
    TeamLeadHeaderProps & RefAttributes<HTMLDivElement>
  >;
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export const TeamLeadHeader = React.forwardRef<
  HTMLButtonElement,
  TeamLeadHeaderProps
>(({ open, sponsor, orgMembers, ...rest }, ref) => {
  const orgMembersList = orgMembers
    ? orgMembers.map((item) => ({
        subtitle: item.current_org_position,
        firstName: item.first_name,
        handle: item.handle,
        lastName: item.last_name,
        profilePicUrl: item.profile_pic_url,
      }))
    : null;
  return (
    <>
      {sponsor && (
        <div className="flex items-center justify-between px-4 space-x-4 w-full  ">
          <div className="w-12 min-w-[48px] h-12 ">
            <Image
              src={sponsor.profile_pic_url ?? ""}
              alt=""
              className=" rounded-full w-12 h-12"
              width={48}
              height={48}
            />
          </div>
          <div className="w-full">
            <p className=" text-gray-900 group-hover:text-gray-700 text-sm leading-5 font-bold">
              {sponsor.first_name} {sponsor.last_name}
            </p>
            <span className="text-sm leading-5 font-normal text-gray-500 group-hover:text-gray-700">
              {sponsor.current_org_position}
              {sponsor.current_org_position && sponsor.current_org_name && ", "}
              {orgMembers && orgMembers.length > 0 ? (
                <Popover
                  element={
                    <UserList
                      header={
                        <div className="px-[18px] py-4">
                          <p className="text-xs leading-4 font-bold text-green-700">
                            {orgMembers.length}{" "}
                            <span className=" font-normal text-gray-700">
                              team members
                            </span>
                          </p>
                        </div>
                      }
                      showIcon
                      users={orgMembersList}
                    />
                  }
                  placement="bottom-start"
                  offset={[-60, 0]}
                >
                  <span className="font-bold text-green-700">
                    {sponsor.current_org_name}
                  </span>
                </Popover>
              ) : (
                <span className="font-bold text-green-700">
                  {sponsor.current_org_name}
                </span>
              )}
            </span>

            <div className="flex gap-4 mt-4">
              <button className="bg-green-700 inline-flex justify-center text-sm font-semibold text-white items-center rounded-md py-[11px] px-[17px] hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border">
                <FontAwesomeIcon
                  icon={faMessage}
                  size="lg"
                  className={classNames(
                    "h-6 w-6 transform group-hover:stroke-gray-800"
                  )}
                />
              </button>
              <button
                ref={ref}
                {...rest}
                className={classNames(
                  open
                    ? "bg-transparent text-green-700 border border-green-700 hover:bg-green-100 active:border-[3px]"
                    : "bg-green-700 text-white",
                  " inline-flex w-full justify-center text-sm font-semibold items-center rounded-md py-2 gap-2 hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border"
                )}
              >
                {open ? "Show Less" : "Show More"}{" "}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  size="lg"
                  className={classNames(
                    open ? "-rotate-180" : "rotate-0",
                    "h-6 w-6 transform group-hover:stroke-gray-800"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

TeamLeadHeader.displayName = "TeamLeadHeader";
