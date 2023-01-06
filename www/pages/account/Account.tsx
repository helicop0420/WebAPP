import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import {
  faChartPie,
  faUserGear,
  IconDefinition,
} from "@fortawesome/pro-regular-svg-icons";
import AccountSettings from "./AccountSettings";
import DealDashboard from "./DealDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function AccountTest() {
  const { asPath } = useRouter();

  const pages: {
    [path: string]: {
      icon: IconDefinition;
      label: string;
      Component: FC;
    };
  } = {
    "/account": {
      icon: faUserGear,
      label: "Account",
      Component: AccountSettings,
    },
    "/account/deals": {
      icon: faChartPie,
      label: "Deal Dashboard",
      Component: DealDashboard,
    },
  };

  const Details = pages[asPath];

  return (
    <div className="h-full w-full">
      <main className="mx-auto max-w-7xl pb-10 lg:py-12 lg:px-8 h-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 w-full h-full">
          <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1">
              {Object.entries(pages).map(([path, { icon, label }]) => (
                <Link key={path} href={path}>
                  <a
                    className={classNames(
                      asPath === path
                        ? "bg-gray-50 text-green-600 hover:bg-white"
                        : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                      "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                    )}
                    aria-current={asPath === path ? "page" : undefined}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className={classNames(
                        asPath === path
                          ? "text-green-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{label}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main section */}
          <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0 w-full h-full">
            {/* <AccountSettings /> */}
            {Details && <Details.Component />}
            {!pages[asPath] && (
              <div className="flex flex-col flex-grow gap-3 items-center justify-center">
                <h1 className="text-3xl">404</h1>
                <h4 className="text-xl">Page not found</h4>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
