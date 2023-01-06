import React, { useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/pro-solid-svg-icons";
import { useQuery } from "react-query";
import {
  DealQueryKey,
  fetchDealAnalyticsView,
} from "./DealAnalyticsModal.fetchers";
import { DealAnalyticsData } from "types/views";
import slightlyInterested from "../../../public/icons/slightlyInterested.svg";
import moderatelyInterested from "../../../public/icons/moderatelyInterested.svg";
import veryInterested from "../../../public/icons/veryInterested.svg";
import checkBig from "../../../public/icons/checkBig.svg";
import Image from "next/image";
import Link from "next/link";
import { faXmark } from "@fortawesome/pro-thin-svg-icons";
import { GridReadyEvent, ICellRendererParams } from "ag-grid-community";

// additional row for making the data show in csv file;
// like a diect mapping
interface DealAnalyticsDataExtended extends DealAnalyticsData {
  user: string;
  interest_level: string;
  referredBy: string;
}
export default function DealAnalyticsModal({ dealId }: { dealId: number }) {
  const [rowCount, setRowCount] = React.useState(0);
  const { data: res } = useQuery({
    queryKey: [DealQueryKey.DealAnalyticsView, dealId],
    queryFn: () => fetchDealAnalyticsView(dealId!),
    onError: (err) => {
      console.log("err", err);
    },
  });
  const gridRef = useRef<AgGridReact<DealAnalyticsDataExtended>>(null);
  // real col defintation
  const realColDefs = [
    {
      field: "user",
      headerName: "User",
      cellRenderer: UserProfileCellRenderer,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 200,
      filter: "agTextColumnFilter",
    },

    {
      field: "interest_level",
      headerName: "Interest Level",
      cellRenderer: InterestedLevelCellRenderer,
      headerCheckboxSelection: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "expressedInterest",
      filter: true,
      headerName: "Expressed interest",
      cellRenderer: ExpressedInterestCellRenderer,
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: "agNumberColumnFilter",
      headerName: "View count",
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: true,
      headerName: "Pitch deck: Received",
      headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span  class="ag-header-cell-text" role="columnheader"><span class="underline">Pitch deck</span>: Received</span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          "  </div>" +
          "</div>",
      },
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: true,
      headerName: "Pitch deck: Views",
      headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span  class="ag-header-cell-text" role="columnheader"><span class="underline">Pitch deck</span>: Views</span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          "  </div>" +
          "</div>",
      },
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: true,
      headerName: "PPM: Received",
      headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span  class="ag-header-cell-text" role="columnheader"><span class="underline">PPM</span>: Received</span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          "  </div>" +
          "</div>",
      },
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: true,
      headerName: "PPM: Views",
      headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span  class="ag-header-cell-text" role="columnheader"><span class="underline">PPM</span>: Views</span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          "  </div>" +
          "</div>",
      },
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: true,
      headerName: "Referred",
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "view_count",
      filter: true,
      headerName: "Number of ppl referred",
      cellClass: "text-center",
      headerCheckboxSelection: true,
    },
    {
      field: "referredBy",
      filter: "agTextColumnFilter",
      headerName: "Referred by",
      cellRenderer: ReferredByCellRenderer,
      headerCheckboxSelection: true,
    },
    {
      field: "first_name",
      filter: true,
      headerName: "Team notes",
      headerCheckboxSelection: true,
    },
  ];

  const rowData = useMemo(
    () =>
      res?.data?.data?.map((item) => ({
        ...item,
        referred_by_user_id: "", // item.referred_by_user_id,
        user: item.first_name + " " + item.last_name,
        expressedInterest: item.expressed_interest ? "✔️" : "❌",
        referredBy: "", // item.referred_by_first_name + " " + item.referred_by_last_name,
      })) || [],
    [res?.data]
  );
  const defaultColDef = useMemo(() => {
    return {
      // set the default column width
      width: 150,
      // make every column editable
      editable: true,
      // make every column use 'text' filter by default
      filter: "agTextColumnFilter",
      // enable floating filters by default
      floatingFilter: true,
      // make columns resizable
      resizable: true,
    };
  }, []);

  const onBtnExport = useCallback(() => {
    if (gridRef.current != null) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  // Example of consuming Grid Event
  // const cellClickedListener = useCallback((event: any) => {
  //   console.log("cellClicked", event);
  // }, []);
  const onGridReady = useCallback(
    (params: GridReadyEvent<DealAnalyticsDataExtended>) => {
      setRowCount(params.api.paginationGetPageSize());
    },
    []
  );

  return (
    <div className="h-[83.33%] overflow-auto  pb-10 mb-[160px]  mt-[60px] p-[30px] flex flex-col">
      <div className="mb-3 flex justify-between">
        <div className="flex justify-between">
          <button
            className="bg-green-700 text-white px-3 py-2 text-sm font-semibold rounded-md"
            onClick={onBtnExport}
          >
            <FontAwesomeIcon
              icon={faFileCsv}
              className="w-2.5 h-3 text-white mr-3"
            />
            Download CSV
          </button>
        </div>
      </div>
      <div
        className="ag-theme-balham flex-1"
        style={{ width: "100%", height: "auto", minHeight: "45px" }}
      >
        <AgGridReact<DealAnalyticsDataExtended>
          className="h-auto bg-red-500"
          ref={gridRef}
          rowData={rowData ? rowData : null}
          columnDefs={realColDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="multiple"
          // onCellClicked={cellClickedListener}
          onGridReady={onGridReady}
        />
        <div className="border-l border-b border-r border-gray-300 p-3">
          <p className="text-sm leading-5 font-normal">
            Total:{" "}
            <span className="text-sm leading-5 font-bold">{rowCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const UserProfileCellRenderer = (
  props: ICellRendererParams<DealAnalyticsDataExtended, React.ReactElement>
) => {
  const imgCrc = props?.data?.profile_pic_url;
  const firstName = props?.data?.first_name;
  const lastName = props?.data?.last_name;
  const handle = props?.data?.handle;
  return (
    <Link href={`/p/${handle}`}>
      <span className="flex space-x-2 items-center">
        <div className="h-6 w-6 rounded-full ">
          <Image
            src={imgCrc ?? "/avatar.png"}
            alt="profile"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <div className="">
          <p className="text-xs leading-4 font-normal text-gray-900">
            {firstName} {lastName}
          </p>
        </div>
      </span>
    </Link>
  );
};
const InterestedLevelCellRenderer = (
  props: ICellRendererParams<DealAnalyticsDataExtended, React.ReactElement>
) => {
  const interestLevel = props?.data?.interest_level;
  return (
    <span className="flex space-x-2 items-center">
      <div className="h-6 w-6 flex items-center">
        <Image
          src={
            interestLevel === "SlightlyInterested"
              ? slightlyInterested
              : interestLevel === "ModeratelyInterested"
              ? moderatelyInterested
              : veryInterested
          }
          alt="interest bars"
          width={24}
          height={24}
          className=""
        />
      </div>
      <div className="">
        <p className="text-xs leading-4 font-normal text-gray-900">
          {interestLevel}
        </p>
      </div>
    </span>
  );
};

const ReferredByCellRenderer = (
  props: ICellRendererParams<DealAnalyticsDataExtended, React.ReactElement>
) => {
  console.log("props", props); // logging to suppress unused variable error
  const imgCrc = ""; // props?.data?.referred_by_profile_pic_url;
  const firstName = ""; // props?.data?.referred_by_first_name;
  const lastName = ""; // props?.data?.referred_by_last_name;
  const handle = ""; //props?.data?.referred_by_handle;

  return (
    <Link href={`/p/${handle}`}>
      <span className="flex space-x-2 items-center">
        <div className="h-6 w-6 rounded-full ">
          <Image
            src={imgCrc ?? "/avatar.png"}
            alt="profile"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <div className="">
          <p className="text-xs leading-4 font-normal text-gray-900">
            {firstName} {lastName}
          </p>
        </div>
      </span>
    </Link>
  );
};
const ExpressedInterestCellRenderer = (
  props: ICellRendererParams<DealAnalyticsDataExtended, React.ReactElement>
) => {
  const expressedInterest = props?.data?.expressed_interest;

  return (
    <div className="text-center">
      {expressedInterest ? (
        <Image
          src={checkBig ?? "/avatar.png"}
          alt="profile"
          width={24}
          height={24}
          className="rounded-full"
        />
      ) : (
        <FontAwesomeIcon icon={faXmark} className="text-red-500" />
      )}
    </div>
  );
};
