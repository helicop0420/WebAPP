import { Fragment, forwardRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/future/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, IconDefinition } from "@fortawesome/free-regular-svg-icons";
import {
  faGear,
  faCommentCheck,
  faChartPie,
} from "@fortawesome/pro-regular-svg-icons";
import { useGlobalState } from "www/shared/modules/global_context";
import Link from "next/link";

interface NavLinkProps {
  label: string;
  href: string;
  icon: IconDefinition;
}

import React from "react";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function DropdownMenu({ logout }: { logout: () => void }) {
  const userProfile = useGlobalState((s) => s.userProfile);
  const NavLinks = [
    {
      label: "Go to Profile",
      url: `/p/${userProfile?.handle}`,
      icon: faUser,
    },
    {
      label: "Share Feedback",
      url: "https://elmbase.canny.io/feature-requests",
      icon: faCommentCheck,
    },
    { label: "Deal Dashboard", url: "/account/deals", icon: faChartPie },
    { label: "Settings", url: "/account", icon: faGear },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left ">
      <div>
        <Menu.Button className="inline-flex w-full justify-center  bg-transparent  shadow-sm hover:bg-gray-50 focus:outline-none ">
          {userProfile?.profile_pic_url ? (
            <Image
              src={userProfile?.profile_pic_url}
              placeholder="blur"
              blurDataURL={userProfile?.profile_pic_url}
              alt="Profile Picture"
              className="rounded-full w-8 h-8 object-cover mx-auto"
              width={32}
              height={32}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 rounded-full w-[32px] h-[32px]"
            />
          )}
          {/* <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 rounded-full w-[32px] h-[32px]" /> */}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[241px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-5 pt-5 flex justify-center flex-col border-b-1  border-b-gray-200">
            <div className="w-full text-center">
              {userProfile?.profile_pic_url ? (
                <Image
                  src={userProfile?.profile_pic_url}
                  alt="Profile Picture"
                  className="rounded-full w-[70px] h-[70px] object-cover mx-auto"
                  width={70}
                  height={70}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-gray-500 rounded-full w-[70px] h-[70px] "
                />
              )}
            </div>
            <p className="text-base leading-6 font-medium text-center">
              {userProfile?.first_name} {userProfile?.last_name}
            </p>
            {userProfile?.is_sponsor && userProfile?.is_investor ? (
              <p className="text-xs leading-4 font-normal text-center">
                Sponsor
              </p>
            ) : (
              <>
                {userProfile?.is_sponsor && (
                  <p className="text-xs leading-4 font-normal text-center">
                    Sponsor
                  </p>
                )}
                {userProfile?.is_investor && (
                  <p className="text-xs leading-4 font-normal text-center">
                    Investor
                  </p>
                )}
              </>
            )}
            {userProfile?.currentOrganization && (
              <div className="flex gap-[14px] items-center py-[14px]">
                <div
                  className="w-[20px] h-[20px] bg-gradient-to-r from-[#166534] to-[#1BD05F] rounded-full mr-2"
                  style={{
                    background:
                      "linear-gradient(287.2deg, #166534 7.5%, #1BD05F 92.91%)",
                  }}
                ></div>
                {/* <div className="w-[18px] h-[18px] bg-gradient-to-r from-[#166534] to-[#1BD05F] rounded-full"></div> */}
                <Link href="">
                  <p className="text-sm leading-5 font-medium text-left">
                    {userProfile?.currentOrganization.name}
                  </p>
                </Link>
              </div>
            )}
          </div>
          <div className="">
            <div className=""></div>
            {NavLinks.map((link, index) => (
              <Menu.Item key={index}>
                <NavLink href={link.url} label={link.label} icon={link.icon} />
              </Menu.Item>
            ))}
          </div>
          <div className="border-t-1 border-t-gray-200">
            <Menu.Item>
              <button
                type="submit"
                className={classNames(
                  "w-full px-5 py-4 text-sm flex gap-[14px] text-red-700 hover:bg-gray-100 hover:text-red-900"
                )}
                onClick={logout}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className=" text-base font-normal w-5 h-5 mr-2"
                />
                <p className="text-sm leading-5 font-normal">Sign Out</p>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => {
    let { href, icon, label, ...rest } = props;

    return (
      <Link href={href}>
        <a
          ref={ref}
          className={classNames(
            "px-5 py-4 text-sm flex gap-[14px] hover:bg-gray-100 text-gray-700"
          )}
          {...rest}
        >
          <FontAwesomeIcon
            icon={icon}
            className="text-green-700 text-base font-normal w-5 h-5 mr-2"
          />
          {label}
        </a>
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";
