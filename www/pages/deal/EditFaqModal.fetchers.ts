import { DealFaq } from "types/views";
import { db } from "www/shared/modules/supabase";

// Types>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
type DealFaqsResponse = Awaited<ReturnType<typeof db["deal_faqs"]>>;
type ExistingFAQ = {
  question: string;
  answer: string;
  order_index: number;
  deal_id: number;
  id: number;
};
type NewFaqs = {
  question: string;
  answer: string;
  order_index: number;
  deal_id: number;
};
export type faqsType = {
  question: string;
  answer: string;
}[];

// Muations>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// addfaqs: This is use in adding deal faqs to a deal with zero faqs
export const addFaqs = async ({
  faqs,
  dealId,
}: {
  faqs: faqsType;
  dealId: number;
}) => {
  //   console.log("this get called", formData);
  let res = await db.deal_faqs().insert([
    ...faqs.map((faq, index) => ({
      ...faq,
      deal_id: dealId,
      order_index: index,
    })),
  ]);

  return res;
};

// updatefaqs: This is use to update deal faqs, for deals that have faqs already.
export const updateFaqs = async ({
  currentFaqs,
  previousFaqs,
  dealId,
}: {
  dealId: number;
  currentFaqs: faqsType;
  previousFaqs: DealFaq[];
}) => {
  let oldFaqs: ExistingFAQ[] = [];
  let newFaqs: NewFaqs[] = [];

  currentFaqs?.forEach((faq, index) => {
    if (
      previousFaqs?.some(
        (dealFaq) =>
          dealFaq.question === faq.question || dealFaq.answer === faq.answer
      )
    ) {
      oldFaqs.push({
        question: faq.question,
        answer: faq.answer,
        order_index: index,
        deal_id: dealId,
        id: previousFaqs?.find(
          (dealFaq) =>
            dealFaq.question === faq.question || dealFaq.answer === faq.answer
        )?.id as number,
      });
    } else {
      newFaqs.push({
        question: faq.question,
        answer: faq.answer,
        order_index: index,
        deal_id: dealId,
      });
    }
  });
  const faqsToDelete = previousFaqs
    ?.filter(
      (dealFaq) =>
        !currentFaqs.some(
          (oldFaq) =>
            oldFaq.question === dealFaq.question ||
            oldFaq.answer === dealFaq.answer
        )
    )
    .map((faq) => faq.id);

  // Crud operations
  const insertDealFaqs = async (faqs: NewFaqs[]) =>
    await db.deal_faqs().insert([...faqs]);

  const updateDealFaqs = async (faqs: ExistingFAQ[]) =>
    await db.deal_faqs().upsert([...faqs]);

  const deleteDealFaqs = async (ids: number[]) =>
    await db
      .deal_faqs()
      .delete()
      .in("id", [...ids]);

  let [insertDealFaqsResponse, updateDealFaqsResponse, deleteDealFaqsResponse] =
    await Promise.all([
      newFaqs
        ? insertDealFaqs(newFaqs)
        : Promise.resolve<DealFaqsResponse | undefined>(undefined),
      oldFaqs
        ? updateDealFaqs(oldFaqs)
        : Promise.resolve<DealFaqsResponse | undefined>(undefined),
      faqsToDelete
        ? deleteDealFaqs(faqsToDelete)
        : Promise.resolve<DealFaqsResponse | undefined>(undefined),
    ]);

  // Crud operations errors deal_faqs response
  if (insertDealFaqsResponse?.error) {
    console.log(
      "error adding a new deal faqs to table",
      insertDealFaqsResponse.error
    );
    return insertDealFaqsResponse;
  }
  if (updateDealFaqsResponse?.error) {
    console.log(
      "error updating deal faqs on table",
      updateDealFaqsResponse?.error
    );
    return updateDealFaqsResponse;
  }
  if (deleteDealFaqsResponse?.error) {
    console.log(
      "error deleting deal faqs from table",
      deleteDealFaqsResponse?.error
    );
    return deleteDealFaqsResponse;
  }

  return (insertDealFaqsResponse ||
    updateDealFaqsResponse ||
    deleteDealFaqsResponse) as DealFaqsResponse;
};
