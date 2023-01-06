import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import CustomErrorComponent from "pages/_error";
import { ReactNode, useEffect } from "react";
import MainLayout from "www/shared/components/layout";
import { NavBar } from "www/shared/components/layout/NavBar";
import { useGlobalState } from "www/shared/modules/global_context";
import { clientSupabase, db } from "www/shared/modules/supabase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "simplebar-react/dist/simplebar.min.css";
import { User } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppQueryKey, fetchSponsorDealsView } from "./App.fetchers";

import "react-loading-skeleton/dist/skeleton.css";

const auth_pages = ["/login", "/signup"];
const public_pages = ["/", "/sentry_sample_error", ...auth_pages];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
// Main Component, all other components fall under this component
export default function MyApp(props: AppProps) {
  let { Component, pageProps } = props;
  const { asPath, push } = useRouter();
  const supabaseUser = useGlobalState((s) => s.supabaseUser);
  const setGlobalState = useGlobalState((s) => s.setGlobalState);

  // Only deal with asPath without hashes or queries
  // This prevents a hydration error when
  const path = asPath.split("#")[0].split("?")[0];
  const getUserProfile = async (user: User | null) => {
    if (!user) {
      setGlobalState({ userProfile: null });
    } else {
      let { data, error } = await db
        .user_profiles()
        .select("*, currentOrganization:current_org_id ( name ) ")
        .eq("user_id", user.id)
        .limit(1)
        .single();
      if (error) {
        console.log("Error getting user profile", error);
      }
      setGlobalState({ userProfile: data });
    }
  };

  useEffect(() => {
    // The user is not set immediately on refresh
    setGlobalState({ supabaseUser: clientSupabase.auth.user() });
    // this listener for all Supabase auth change events (login, logout expiry, etc).
    // note, this doesn't get called on auth.signOut(), so we must set it manually then.
    clientSupabase.auth.onAuthStateChange(() => {
      console.log("Detected auth change! Updating user...");
      setGlobalState({ supabaseUser: clientSupabase.auth.user() });
    });
  }, [setGlobalState]);

  useEffect(() => {
    if (auth_pages.includes(path) && supabaseUser !== null) {
      // Redirect to home page if this is an auth page
      push("/");
    }
  }, [supabaseUser, path, push]);

  useEffect(() => {
    if (supabaseUser) {
      getUserProfile(supabaseUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseUser]);

  const isPublicPage = public_pages.includes(path);

  return (
    <QueryClientProvider client={queryClient}>
      <SponsorDealsProvider>
        <MainLayout navBar={<NavBar />}>
          {/* Render all components as long as user is logged in */}
          {supabaseUser !== null && <Component {...pageProps} />}

          {/* Render only public pages or page not found */}
          {supabaseUser === null && isPublicPage && (
            <Component {...pageProps} />
          )}
          {supabaseUser === null && !isPublicPage && (
            <CustomErrorComponent statusCode={404} />
          )}
          <ToastContainer />
        </MainLayout>
        <ReactQueryDevtools initialIsOpen={false} />
      </SponsorDealsProvider>
    </QueryClientProvider>
  );
}

function SponsorDealsProvider({ children }: { children: ReactNode }) {
  const supabaseUser = useGlobalState((s) => s.supabaseUser);
  const setGlobalState = useGlobalState((s) => s.setGlobalState);
  useQuery({
    queryKey: [AppQueryKey.SponsorDealsView, supabaseUser?.id],
    queryFn: () => {
      if (!supabaseUser) return [];
      return fetchSponsorDealsView(supabaseUser?.id!);
    },
    onSuccess: (data) => {
      let deals = [...data];

      // Sort by active deals first, then by latest created_at
      deals.sort((a, b) => {
        if (a.is_active !== b.is_active) {
          return a.is_active ? 1 : -1;
        }

        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      setGlobalState({ sponsorDeals: data });
    },
  });

  return <>{children}</>;
}
