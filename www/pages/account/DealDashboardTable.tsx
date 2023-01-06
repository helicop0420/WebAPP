import React from "react";
import DealStatus from "./DealStatus";
import TeamMembers from "./TeamMembers";
import { DealDashboardView } from "types/views";
import Link from "next/link";
import { format, parse } from "date-fns";
import { useRouter } from "next/router";
interface DealDashboardTableProps {
  deals?: DealDashboardView["deals"];
}
export default function DealDashboardTable({ deals }: DealDashboardTableProps) {
  const router = useRouter();
  const openEditModal = (id: string) => {
    console.log("deal_id", id);
    router.push("/deal/[deal_id]", `/deal/${id}?edit=true`);
  };
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            {deals && (
              <table className="min-w-full divide-y divide-gray-300 table-fixed w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Launch Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 xl:w-[249px]"
                    >
                      Deal name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[235px]"
                    >
                      Sponsors
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 [120px]"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {deals.map((deal) => (
                    <tr key={deal.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {deal.launch_date &&
                          format(
                            parse(deal.launch_date, "yyyy-MM-dd", new Date()),
                            "MMM d yyyy"
                          )}
                      </td>
                      <td className="whitespace-normal px-3 py-4 text-sm  pr-6 font-semibold text-green-700 hover:underline active:underline active:text-green-800">
                        <Link href={`/deal/${deal.handle}`}>{deal.title}</Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        <div className="inline-flex">
                          <TeamMembers teamMembers={deal.sponsors} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <DealStatus status={deal.is_active} />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {deal.is_sponsor && (
                          <button
                            // href="#"
                            className="text-green-700 hover:text-green-900"
                            onClick={(e) => {
                              e.preventDefault();
                              openEditModal(deal.handle);
                            }}
                          >
                            Edit<span className="sr-only">, {deal.title}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
