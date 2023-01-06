import Image from "next/image";
import Link from "next/link";
import { useGlobalState } from "www/shared/modules/global_context";
import { clientSupabase } from "www/shared/modules/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import DropdownMenu from "./DropdownMenu";
import { useRouter } from "next/router";
import NotificationMenu from "./NotificationMenu";
export function NavBar() {
  const router = useRouter();
  const supabaseUser = useGlobalState((s) => s.supabaseUser);
  const userProfile = useGlobalState((s) => s.userProfile);

  const setGlobalState = useGlobalState((s) => s.setGlobalState);

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
          <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                {/* Span handles ref passed from link */}
                <span>
                  <Image
                    className="cursor-pointer"
                    height={32}
                    width={31}
                    src="/logo.svg"
                    alt=""
                  />
                </span>
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-8">
            <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0 justify-center">
              <div className="w-4/5">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"></path>
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-gray-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none sm:text-sm"
                    placeholder="Search connections, deals"
                    type="search"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:flex lg:items-center lg:justify-end xl:col-span-2 gap-8 content-center">
            {supabaseUser === null && (
              <>
                <Link href="/signup">
                  <button className="p-2 bg-slate-200 rounded-xl hover:bg-green-100 font-bold">
                    Join now
                  </button>
                </Link>

                <Link href="/login">
                  <button className="bg-slate-100 rounded-xl hover:bg-green-100 p-2 font-semibold">
                    Sign in
                  </button>
                </Link>
              </>
            )}
            {supabaseUser && userProfile !== null && (
              <>
                <Link href="/inbox">
                  <FontAwesomeIcon
                    icon={faComment}
                    size="lg"
                    className="hover:cursor-pointer hover:text-gray-500 text-gray-400 pb-1"
                  />
                </Link>
                <NotificationMenu />
                <DropdownMenu
                  logout={() => {
                    clientSupabase.auth.signOut();
                    setGlobalState({ supabaseUser: null, userProfile: null });
                    router.push("/");
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
