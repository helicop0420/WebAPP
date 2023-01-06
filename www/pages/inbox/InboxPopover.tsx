import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faFilter,
  faPaperclip,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConversationPreview, DealInterestLevel, Deals } from "types/views";
import { useRouter } from "next/router";
import { Popover } from "@headlessui/react";
import { ReactNode, useMemo, useState } from "react";
import { CheckboxWithLabel } from "www/shared/components/form_inputs/Checkbox";
import { useGlobalState } from "www/shared/modules/global_context";
import { getUrlQueryString } from "www/shared/utils";
import Image from "next/image";
import { useQuery } from "react-query";
import {
  AttachmentPopoverQuerykey,
  getAllFilenamesForDeals,
} from "./AttachmentPopover.fetchers";

function getParamValue(
  param: string | string[] | undefined,
  defaultValue = true
) {
  if (!param) {
    return defaultValue;
  }

  return param === "true";
}

export function useInboxFilterQueryParams() {
  const router = useRouter();
  const routerQuery = router.query as {
    [key: string]: string;
  };
  const conversation_ids = (
    (routerQuery.conversation_id as unknown as string[]) || []
  ).join(",");

  const deals = useGlobalState((s) => s.sponsorDeals);

  return useMemo(() => {
    const slightlyInterested = getParamValue(
      routerQuery[DealInterestLevel.SlightlyInterested]
    );
    const moderatelyInterested = getParamValue(
      routerQuery[DealInterestLevel.ModeratelyInterested]
    );
    const veryInterested = getParamValue(
      routerQuery[DealInterestLevel.VeryInterested]
    );

    const interestLevels: DealInterestLevel[] = [];
    if (slightlyInterested) {
      interestLevels.push(DealInterestLevel.SlightlyInterested);
    }

    if (moderatelyInterested) {
      interestLevels.push(DealInterestLevel.ModeratelyInterested);
    }
    if (veryInterested) {
      interestLevels.push(DealInterestLevel.VeryInterested);
    }

    const onToggleInterestLevel = (interestLevel: DealInterestLevel) => {
      const hasInterestLevel = interestLevels.includes(interestLevel);

      if (hasInterestLevel && interestLevels.length === 1) {
        alert("Need at least one interest level selected");
        return;
      }

      router.replace({
        query: {
          ...routerQuery,
          [interestLevel]: !hasInterestLevel,
        },
      });
    };

    const onToggleField =
      (field: string, defaultValue = true) =>
      () => {
        router.replace({
          query: {
            ...routerQuery,
            [field]: !getParamValue(routerQuery[field], defaultValue),
          },
        });
      };

    const attachmentIdsExcluded = routerQuery["attachmentIdsExcluded"]
      ? routerQuery["attachmentIdsExcluded"].split(",").map(Number)
      : [];

    const onToggleAttachmentIdsExcluded = (attachId: number) => {
      let newAttachments = [...attachmentIdsExcluded];
      const hasAttachIdAlready = attachmentIdsExcluded.includes(attachId);

      if (hasAttachIdAlready) {
        newAttachments = newAttachments.filter((id) => id !== attachId);
      } else {
        newAttachments.push(attachId);
      }

      const newQuery = {
        ...routerQuery,
        attachmentIdsExcluded: newAttachments.join(","),
      };
      if (newAttachments.length === 0) {
        // @ts-ignore
        delete newQuery.attachmentIdsExcluded;
      }

      router.replace({
        query: newQuery,
      });
    };
    const showNoAttachments = getParamValue(
      routerQuery["showNoAttachments"],
      true
    );
    const onToggleShowNoAttachments = onToggleField("showNoAttachments");

    const indicatedInterestYes = getParamValue(
      routerQuery["indicatedInterestYes"],
      true
    );
    const onToggleIndicatedInterestYes = onToggleField("indicatedInterestYes");
    const indicatedInterestNo = getParamValue(
      routerQuery["indicatedInterestNo"],
      true
    );
    const onToggleIndicatedInterestNo = onToggleField("indicatedInterestNo");

    const showArchivedConversations = getParamValue(
      routerQuery["showArchivedConversations"],
      false
    );
    const onToggleShowArchivedConversations = onToggleField(
      "showArchivedConversations",
      false
    );

    const dealIds = routerQuery["dealIds"]
      ? routerQuery["dealIds"].split(",").map(Number)
      : [];

    const onToggleDealIds = (dealId: number) => {
      let newDeals = [...dealIds];
      const hasDealIdAlready = dealIds.includes(dealId);

      if (hasDealIdAlready) {
        if (newDeals.length === 1) {
          alert("Need at least one deal selected");
          return;
        }

        newDeals = newDeals.filter((id) => id !== dealId);
      } else {
        newDeals.push(dealId);
      }

      router.replace({
        query: {
          ...routerQuery,
          dealIds: newDeals.join(","),
        },
      });
    };
    if (deals && deals.length > 0 && dealIds.length === 0) {
      const firstActiveDeal = deals
        .filter((deal) => deal.is_active)
        .sort(
          (a, b) =>
            new Date(a.created_at).getDate() - new Date(b.created_at).getDate()
        )[0];

      if (firstActiveDeal) {
        dealIds.push(firstActiveDeal.id);
      }
    }

    return {
      interestLevels,
      onToggleInterestLevel,
      indicatedInterestYes,
      onToggleIndicatedInterestYes,
      indicatedInterestNo,
      onToggleIndicatedInterestNo,
      showNoAttachments,
      onToggleShowNoAttachments,
      attachmentIdsExcluded,
      onToggleAttachmentIdsExcluded,
      showArchivedConversations,
      onToggleShowArchivedConversations,
      dealIds,
      onToggleDealIds,
      deals,
    };
  }, [deals, getUrlQueryString(), conversation_ids]);
}

export function useFilenamesForDeals() {
  const dealIds = useGlobalState((s) => s.sponsorDeals).map((deal) => deal.id);

  const { data: fileNameRes } = useQuery({
    queryKey: [AttachmentPopoverQuerykey.Filenames, dealIds.join(",")],
    queryFn: () => getAllFilenamesForDeals(dealIds),
  });

  return fileNameRes?.data || [];
}

export function InboxPopover({
  chatList,
}: {
  chatList: ConversationPreview[];
}) {
  const filenames = useFilenamesForDeals();
  const {
    interestLevels,
    onToggleInterestLevel,
    indicatedInterestYes,
    onToggleIndicatedInterestYes,
    indicatedInterestNo,
    onToggleIndicatedInterestNo,
    showNoAttachments,
    onToggleShowNoAttachments,
    attachmentIdsExcluded,
    onToggleAttachmentIdsExcluded,
    showArchivedConversations,
    onToggleShowArchivedConversations,
    deals,
    dealIds,
    onToggleDealIds,
  } = useInboxFilterQueryParams();

  const { activeDeals, inactiveDeals } = useMemo(() => {
    let activeDeals: Deals[] = [];
    let inactiveDeals: Deals[] = [];

    deals.forEach((deal) => {
      if (deal.is_active) {
        activeDeals.push(deal);
      } else {
        inactiveDeals.push(deal);
      }
    });

    return {
      activeDeals,
      inactiveDeals,
    };
  }, [deals]);

  return (
    <div className="flex justify-between  border-b border-gray-100 pb-2">
      <div className="text-xs leading-4 font-normal text-gray-500">
        Showing {chatList?.length} conversations.
      </div>

      <Popover className="relative">
        <Popover.Button>
          <FontAwesomeIcon icon={faFilter} className="text-sm" />
        </Popover.Button>
        <Popover.Panel className="absolute z-10 bg-white w-[320px] shadow-lg rounded-md overflow-y-auto max-h-[400px]">
          <InboxPopoverHeader title="Interest Level" />
          <div className="py-1 text-sm ">
            <InboxPopoverBodyItem>
              <CheckboxWithLabel
                id={DealInterestLevel.SlightlyInterested}
                checked={interestLevels.includes(
                  DealInterestLevel.SlightlyInterested
                )}
                icon={
                  <Image
                    src="/icons/slightlyInterested.svg"
                    alt="Low interest"
                    height={16}
                    width={16}
                  />
                }
                onChange={() => {
                  onToggleInterestLevel(DealInterestLevel.SlightlyInterested);
                }}
                label={"Slightly Interested"}
              />
            </InboxPopoverBodyItem>
            <InboxPopoverBodyItem>
              <CheckboxWithLabel
                id={DealInterestLevel.ModeratelyInterested}
                checked={interestLevels.includes(
                  DealInterestLevel.ModeratelyInterested
                )}
                icon={
                  <Image
                    src="/icons/moderatelyInterested.svg"
                    alt="Moderate interest"
                    height={16}
                    width={16}
                  />
                }
                onChange={() => {
                  onToggleInterestLevel(DealInterestLevel.ModeratelyInterested);
                }}
                label={"Moderately Interested"}
              />
            </InboxPopoverBodyItem>
            <InboxPopoverBodyItem>
              <CheckboxWithLabel
                id={DealInterestLevel.VeryInterested}
                checked={interestLevels.includes(
                  DealInterestLevel.VeryInterested
                )}
                icon={
                  <Image
                    src="/icons/veryInterested.svg"
                    alt="High interest"
                    height={16}
                    width={16}
                  />
                }
                onChange={() => {
                  onToggleInterestLevel(DealInterestLevel.VeryInterested);
                }}
                label={"Very Interested"}
              />
            </InboxPopoverBodyItem>
          </div>
          <InboxPopoverHeader title="Indicated interest" />
          <InboxPopoverBodyItem>
            <CheckboxWithLabel
              id="indicatedInterestYes"
              label="Yes"
              icon={
                <FontAwesomeIcon
                  icon={faCheck}
                  className="mr-1"
                  fontSize={16}
                />
              }
              checked={indicatedInterestYes}
              onChange={onToggleIndicatedInterestYes}
            />
          </InboxPopoverBodyItem>
          <InboxPopoverBodyItem>
            <CheckboxWithLabel
              id="indicatedInterestNo"
              label="No"
              icon={
                <FontAwesomeIcon icon={faX} className="mr-1" fontSize={16} />
              }
              checked={indicatedInterestNo}
              onChange={onToggleIndicatedInterestNo}
            />
          </InboxPopoverBodyItem>
          <InboxPopoverHeader title="Attachments Received" />
          {filenames.map((attachmentInfo) => {
            return (
              <InboxPopoverBodyItem key={attachmentInfo.id}>
                <CheckboxWithLabel
                  id={String(attachmentInfo.id)}
                  label={attachmentInfo.filename + attachmentInfo.id}
                  icon={
                    <FontAwesomeIcon
                      icon={faPaperclip}
                      className="mr-1"
                      fontSize={16}
                    />
                  }
                  checked={!attachmentIdsExcluded.includes(attachmentInfo.id)}
                  onChange={() =>
                    onToggleAttachmentIdsExcluded(attachmentInfo.id)
                  }
                />
              </InboxPopoverBodyItem>
            );
          })}
          <InboxPopoverBodyItem>
            <CheckboxWithLabel
              id="No Attachments"
              label="No Attachements"
              icon={
                <FontAwesomeIcon icon={faX} className="mr-1" fontSize={16} />
              }
              checked={showNoAttachments}
              onChange={onToggleShowNoAttachments}
            />
          </InboxPopoverBodyItem>
          <InboxPopoverHeader title="Marked Done" />
          <InboxPopoverBodyItem>
            <CheckboxWithLabel
              id="ArchivedConversations"
              label="Show archived conversations"
              icon={<FontAwesomeIcon icon={faFolderOpen} className="mr-1" />}
              checked={showArchivedConversations}
              onChange={onToggleShowArchivedConversations}
            />
          </InboxPopoverBodyItem>
          <InboxPopoverHeader title="Deals" />
          {activeDeals.map((deal) => {
            return (
              <InboxPopoverBodyItem key={deal.id}>
                <CheckboxWithLabel
                  id={String(deal.id)}
                  label={deal.title!}
                  checked={dealIds.includes(deal.id)}
                  onChange={() => {
                    onToggleDealIds(deal.id);
                  }}
                />
              </InboxPopoverBodyItem>
            );
          })}
          {inactiveDeals.length > 0 && (
            <InboxPopoverCollapsibleSection header="Inactive">
              {inactiveDeals.map((deal) => {
                return (
                  <InboxPopoverBodyItem key={deal.id}>
                    <CheckboxWithLabel
                      id={String(deal.id)}
                      label={deal.title!}
                      checked={dealIds.includes(deal.id)}
                      onChange={() => {
                        onToggleDealIds(deal.id);
                      }}
                    />
                  </InboxPopoverBodyItem>
                );
              })}
            </InboxPopoverCollapsibleSection>
          )}
        </Popover.Panel>
      </Popover>
    </div>
  );
}

export function InboxPopoverHeader({ title }: { title: string }) {
  return (
    <div className="bg-gray-100 text-black text-sm leading-5 font-medium p-2">
      {title}
    </div>
  );
}

export function InboxPopoverBodyItem({ children }: { children: ReactNode }) {
  return (
    <div className="py-2 px-4 text-sm leading-5 font-normal">{children}</div>
  );
}

export function InboxPopoverCollapsibleSection({
  header,
  children,
}: {
  header: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <div
        className="border-y border-y-gray-200 text-black text-sm leading-5 font-medium py-2 px-4 flex justify-between cursor-pointer "
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <div>{header}</div>
        <FontAwesomeIcon
          icon={collapsed ? faChevronDown : faChevronUp}
          fontSize={16}
        />
      </div>
      {!collapsed ? children : null}
    </>
  );
}
