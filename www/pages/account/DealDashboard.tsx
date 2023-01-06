import React, { useState } from "react";
import DealDashboardTable from "www/pages/account/DealDashboardTable";
import { db } from "www/shared/modules/supabase";
import { DealDashboardView } from "types/views";
import { LoadingItem, useGlobalState } from "www/shared/modules/global_context";
import UpdateDealModal from "../../shared/components/UpdateDealModal";
import Modal from "www/shared/components/modal/Modal";

// TODO: come back to ddd missing Filed Name, company, how to check for pending deal deals and what component to show if there is no deal

export default function AccountSettings() {
  const promiseLoadingHelper = useGlobalState((s) => s.promiseLoadingHelper);
  const userProfileLoadingItem: LoadingItem = { componentName: "profile" };
  const { supabaseUser } = useGlobalState();
  const [open, setOpen] = useState(false);

  const [deals, setDeals] = React.useState<DealDashboardView>();

  React.useEffect(() => {
    const fetchDeals = async () => {
      const { data, error } = await db
        .deal_dashboard_view()
        .select("*")
        // .eq("user_id", "858b5bca-04eb-4410-a9c3-6130af188bc0")
        .eq("user_id", supabaseUser?.id as string)
        .limit(1)
        .single();
      if (error) {
        console.log("Error", error);
      }
      if (!error && data) {
        setDeals(data);
        // console.log("deal data", data);
      }
    };
    fetchDeals().finally(promiseLoadingHelper(userProfileLoadingItem));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-labelledby="payment-details-heading"
      className="w-full  h-full"
    >
      <Modal open={open} setOpen={setOpen} title="Add new deal">
        <UpdateDealModal setOpen={setOpen} />
      </Modal>
      <form action="#" method="POST" className="w-full h-full">
        <div className="shadow sm:overflow-hidden sm:rounded-md w-full h-full">
          <div className="bg-white py-6 px-4 sm:p-6 w-full h-full">
            <div className="flex justify-between items-center">
              <div className="">
                <h2
                  id="payment-details-heading"
                  className="text-gray-900 text-2xl leading-8 font-medium"
                >
                  Deal Dashboard
                </h2>
                <p className="mt-2  text-gray-500 text-base leading-6 font-normal">
                  Manage your deals and/or create new ones.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-green-700 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => setOpen(true)}
              >
                Add New Deal
              </button>
            </div>
            <DealDashboardTable deals={deals?.deals} />
          </div>
        </div>
      </form>
    </section>
  );
}
