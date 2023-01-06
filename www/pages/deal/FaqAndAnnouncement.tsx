import { Tab } from "@headlessui/react";
import React from "react";
import { DealComment, DealFaq } from "types/views";
import Announcements from "www/pages/deal/Announcements";
import FAQ from "www/pages/deal/FAQ";
import Discussion from "www/pages/deal/Discussion";
import classNames from "www/shared/utils/classNames";
interface FaqAndAnnouncementProps {
  dealComments: DealComment[] | null;
  isDealOwner: boolean;
  dealId: number;
  dealFaqs: DealFaq[] | null;
}

export default function FaqAndAnnouncement({
  dealComments,
  dealId,
  isDealOwner,
  dealFaqs,
}: FaqAndAnnouncementProps) {
  const getDealComments = () => {
    let announcements: DealComment[] = [];
    let faqs: DealComment[] = [];
    let announcementReplies: DealComment[] = [];
    let faqsReplies: DealComment[] = [];

    dealComments &&
      dealComments.map((comment) => {
        if (comment.type === "ANNOUNCEMENT") {
          if (comment.replying_to_comment_id) {
            announcementReplies.push(comment);
          } else {
            announcements.push(comment);
          }
        } else {
          // faqs.push(comment);

          if (comment.replying_to_comment_id) {
            faqsReplies.push(comment);
          } else {
            faqs.push(comment);
          }
        }
      });
    return { announcements, faqs, announcementReplies, faqsReplies };
  };
  const theDealComments = getDealComments();

  return (
    <>
      {/* Frame 41 */}
      <Tab.Group defaultIndex={1}>
        <div className="border-b border-gray-200 mx-10">
          <div className="sm:flex sm:items-baseline">
            <Tab.List>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm hover:cursor-pointer mr-9 focus:outline-none focus:ring focus:ring-white"
                  )
                }
              >
                Announcements
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm hover:cursor-pointer mr-9 focus:outline-none focus:ring focus:ring-white"
                  )
                }
              >
                Discussion
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm hover:cursor-pointer focus:outline-none focus:ring focus:ring-white"
                  )
                }
              >
                FAQ
              </Tab>
            </Tab.List>
          </div>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <Announcements
              comments={theDealComments.announcements}
              replies={theDealComments.announcementReplies}
              isDealOwner={isDealOwner}
              dealId={dealId}
            />
          </Tab.Panel>
          <Tab.Panel>
            <Discussion
              comments={theDealComments.faqs}
              replies={theDealComments.faqsReplies}
              isDealOwner={isDealOwner}
              dealId={dealId}
            />
          </Tab.Panel>
          <Tab.Panel>
            <FAQ
              dealFaqs={dealFaqs}
              isDealOwner={isDealOwner}
              dealId={dealId}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
