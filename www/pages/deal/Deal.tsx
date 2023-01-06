import { useState, useEffect } from "react";
import InterestBox from "./InterestBox";
import { useRouter } from "next/router";
import { useGlobalState } from "www/shared/modules/global_context";
import { DealPageView, Sponsor } from "types/views";
import Modal from "www/shared/components/modal/Modal";
import UpdateDealModal from "../../shared/components/UpdateDealModal";
import SponsorsSidebar from "www/pages/deal/SponsorsSidebar";
import FaqAndAnnouncement from "www/pages/deal/FaqAndAnnouncement";
import DealImageSlider from "www/pages/deal/DealImageSlider";
import AllHighlights from "./AllHighlights";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faArrowsRetweet } from "@fortawesome/pro-solid-svg-icons";
import DealAnalyticsModal from "./DealAnalyticsModal";
import DealAnalyticsModalWrapper from "./DealAnalyticsModalWrapper";

import { useQuery } from "react-query";
import { DealQueryKey, fetchDealView } from "./Deal.fetchers";
export interface TeamType {
  teamLead: Sponsor | null;
  team: Sponsor[] | null;
}

interface Highlight {
  title: string | null;
  value: string | null;
}
export default function Deal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openDealAnalytics, setOpenDealAnalytics] = useState(false);
  const supabaseUser = useGlobalState((s) => s.supabaseUser);

  const { handle } = router.query as { handle?: string };

  const { data: res } = useQuery({
    queryKey: [DealQueryKey.DealView, handle],
    queryFn: () => fetchDealView(handle!),
    onError: (err) => {
      console.log("err", err);
    },
  });

  const dealData = res?.data;
  const checkDealOwner = (dealData: DealPageView | null | undefined) =>
    (dealData?.deal_sponsors &&
      dealData?.deal_sponsors?.some(
        (item) => item.user_id === supabaseUser?.id
      )) ||
    false;
  useEffect(() => {
    if (!router.isReady) return;
    if (dealData && router.query?.edit === "true") {
      // check if logged in user is the deal owner. check dealData.deal_sponors for the user id
      let isSponsor = checkDealOwner(dealData);
      isSponsor && setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query, dealData]);

  const highlights: Highlight[] | null = dealData
    ? [
        {
          title: "LP Equity Raise",
          value: dealData.highlight_equity_raise,
        },
        { title: "Term", value: dealData.highlight_term },
        { title: dealData.highlight_1_name, value: dealData.highlight_1_value },
        { title: dealData.highlight_2_name, value: dealData.highlight_2_value },
      ]
    : null;

  const isDealOwner = checkDealOwner(res?.data);

  return (
    <div className="max-w-7xl px-8 bg-gray-100 pb-20">
      {dealData && (
        <>
          <Modal open={open} setOpen={setOpen} title="Update deal">
            <UpdateDealModal setOpen={setOpen} existingDeal={dealData} />
          </Modal>
          <DealAnalyticsModalWrapper
            open={openDealAnalytics}
            setOpen={setOpenDealAnalytics}
            title={dealData.title ?? "Deal Analytics"}
          >
            <DealAnalyticsModal dealId={dealData.id as number} />
          </DealAnalyticsModalWrapper>
          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            {/* <InterestBox dealInterests={dealInterest} setOpen={setOpen} /> */}
          </div>
          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl  lg:grid-cols-1">
            <InterestBox
              interestCount={dealData.interest_count}
              dealConnectionInterest={dealData.connections_deal_interest}
              referrer={dealData.referrer}
              isDealOwner={isDealOwner}
              onEditActionClick={setOpen}
              onDealAnalyticsActionClick={setOpenDealAnalytics}
            />
          </div>
          {/* Frame 38 */}
          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            {/* Frame 43 */}
            <div className="space-y-6 lg:col-span-2 lg:col-start-1  rounded-t-lg">
              {/* Frame 41 */}
              <div className="space-y-6 flex flex-col bg-white">
                {/* <DealImageSliderOld dealImages={dealData.deal_images} /> */}
                <DealImageSlider dealImages={dealData.deal_images} />
                {/* Frame 41 */}
                <FaqAndAnnouncement
                  dealComments={dealData.deal_comments}
                  dealFaqs={dealData.deal_faqs}
                  isDealOwner={isDealOwner}
                  dealId={dealData.id as number}
                />
              </div>
            </div>
            {/* Frame 42 */}
            <div className="space-y-4 lg:col-span-1 lg:col-start-3">
              {/* Frame 44 */}
              <div className="bg-white sm:rounded-lg sm:px-6 p-4">
                <p className=" text-gray-900 subpixel-antialiased text-2xl leading-8 font-extrabold tracking-tight">
                  {dealData.title}
                </p>
                <p className="text-base leading-6 font-normal text-gray-500 my-2">
                  Highlights:
                </p>
                <AllHighlights highlights={highlights} />
                <p className=" mt-5 text-base leading-6 font-normal text-gray-500">
                  {dealData.about}
                </p>
                <p className="text-base leading-6 font-normal text-gray-500 mt-2">
                  This deal has been viewed{" "}
                  <b className="text-base leading-6 font-semibold">
                    {dealData.deal_views ?? 0}
                  </b>{" "}
                  times.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg flex flex-col space-y-6">
                <p className="text-2xl leading-8 font-extrabold tracking-tight text-gray-900">
                  Share
                </p>
                <p className="text-base leading-6 font-normal text-gray-500">
                  You have{" "}
                  <span className="text-base leading-6 font-semibold">5</span>{" "}
                  invites.
                </p>
                <div className="flex flex-row justify-start px-0">
                  <button className="bg-green-700 py-2 px-5 text-white rounded flex flex-row justify-center mr-1 items-center  hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border">
                    <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    <p className="text-sm leading-5 font-medium ml-2">
                      Refer a friend
                    </p>
                  </button>
                  <button className="bg-green-700 py-2 px-5 text-white rounded flex flex-row justify-center mx-1 items-center  hover:bg-green-800 active:bg-green-700 active:border-2 active:border-green-800 box-border">
                    <FontAwesomeIcon icon={faArrowsRetweet} size="lg" />
                    <p className="text-sm leading-5 font-medium ml-2">Repost</p>
                  </button>
                </div>
              </div>
              {/* Frame 45 */}
              <SponsorsSidebar
                sponsors={dealData?.deal_sponsors}
                currentDeal={dealData.handle}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
