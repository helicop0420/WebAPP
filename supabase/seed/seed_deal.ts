import { serverDb } from "api/modules/server_supabase";
import { Database } from "supabase/generated/types";
import { UserProfile, Deal, DealImage } from "types/tables";
import { handleError } from "./seed_utils";

export interface SeedDataComment {
  user: UserProfile["Row"];
  comment: string;
  type: Database["public"]["Enums"]["deal_comment_type"];
  likes: UserProfile["Row"][];
  replies: SeedDataComment[];
}

export interface SeedDealView {
  user: UserProfile["Row"];
  viewed_at: Date;
}

async function fetchDeal(deal: Deal["Insert"]): Promise<Deal["Row"] | null> {
  const res = await serverDb
    .deals()
    .select("*")
    .eq("title", deal.title as string);

  handleError(res);

  if (res.data?.length === 0 || res.data === null) {
    return null;
  } else {
    return res.data[0];
  }
}

async function createComment({
  comment,
  insertedDeal,
  replyingToCommentId = null,
}: {
  comment: SeedDataComment;
  insertedDeal: Deal["Row"] | null;
  replyingToCommentId: number | null;
}) {
  let dealCommentId: number | null = null;
  const res = await serverDb
    .deal_comments()
    .select("*")
    .eq("comment", comment.comment);
  handleError(res);
  if (res.data?.length === 0) {
    const insertRes = await serverDb.deal_comments().insert({
      deal_id: insertedDeal!.id,
      user_id: comment.user.user_id,
      comment: comment.comment,
      type: comment.type,
      replying_to_comment_id: replyingToCommentId,
    });
    handleError(insertRes);
    console.log(`Inserted deal comment ${comment.comment}`);
    dealCommentId = insertRes.data![0].id;
  } else {
    console.log(`Deal comment ${comment.comment} already exists`);
    dealCommentId = res.data![0].id;
  }

  for (const likingUser of comment.likes) {
    const res = await serverDb
      .deal_comment_likes()
      .select("*")
      .eq("user_id", likingUser.user_id)
      .eq("deal_comment_id", dealCommentId);
    handleError(res);
    if (res.data?.length === 0) {
      const likeRes = await serverDb.deal_comment_likes().insert({
        deal_comment_id: dealCommentId!,
        user_id: likingUser.user_id,
      });
      handleError(likeRes);
      console.log(`Inserted deal comment like ${likingUser.first_name}`);
    } else {
      console.log(`Deal comment like ${likingUser.first_name} already exists`);
    }
  }

  for (const reply of comment.replies) {
    await createComment({
      comment: reply,
      insertedDeal,
      replyingToCommentId: dealCommentId,
    });
  }
}

export async function createDeal({
  comments,
  expressedInterest,
  sponsors,
  viewedBy,
  deal,
  dealImages,
  dealFaqs,
  dealShares,
  dealInvites,
}: {
  comments: SeedDataComment[];
  expressedInterest: UserProfile["Row"][];
  sponsors: UserProfile["Row"][];
  viewedBy: SeedDealView[];
  deal: Deal["Insert"];
  dealImages: string[];
  dealFaqs: {
    question: string;
    answer: string;
  }[];
  dealShares: {
    from_user: UserProfile["Row"];
    to_user: UserProfile["Row"];
  }[];
  dealInvites: {
    from_user: UserProfile["Row"];
    email: string;
    is_accepted: boolean;
  }[];
}): Promise<{
  deal: Deal["Row"];
}> {
  let insertedDeal: Deal["Row"] | null = await fetchDeal(deal);

  if (!insertedDeal) {
    const res = await serverDb.deals().insert(deal);
    handleError(res);
    insertedDeal = await fetchDeal(deal);
  } else {
    console.log(`${deal.title} deal already exists (${insertedDeal.id})`);
  }

  console.log("==> Done with deal metadata\n");

  let jj = 0;
  for (const dealImageSrc of dealImages) {
    const dealImage: DealImage["Insert"] = {
      deal_id: insertedDeal!.id,
      image_url: dealImageSrc,
      order_index: jj,
    };
    const res = await serverDb
      .deal_images()
      .select("*")
      .eq("image_url", dealImageSrc)
      .eq("deal_id", insertedDeal!.id);
    handleError(res);
    if (res.data?.length === 0) {
      await serverDb.deal_images().insert(dealImage);
      console.log(`Inserted deal image ${dealImageSrc}`);
    } else {
      console.log(`Deal image ${dealImageSrc} already exists`);
    }
    jj++;
  }

  console.log("==> Done with deal images\n");

  for (const comment of comments) {
    await createComment({ comment, insertedDeal, replyingToCommentId: null });
  }

  console.log("Adding deal FAQs");
  for (const faq of dealFaqs) {
    const res = await serverDb
      .deal_faqs()
      .select("*")
      .eq("question", faq.question)
      .eq("deal_id", insertedDeal!.id);
    handleError(res);
    if (res.data?.length === 0) {
      await serverDb.deal_faqs().insert({
        deal_id: insertedDeal!.id,
        question: faq.question,
        answer: faq.answer,
      });
      console.log(`Inserted deal faq ${faq.question}`);
    } else {
      console.log(`Deal faq ${faq.question} already exists`);
    }
  }

  console.log("==> Done with deal comments\n");

  for (const user of expressedInterest) {
    const res = await serverDb
      .deal_interest()
      .select("*")
      .eq("user_id", user.user_id)
      .eq("deal_id", insertedDeal!.id);
    handleError(res);
    if (res.data?.length === 0) {
      const res = await serverDb.deal_interest().insert({
        deal_id: insertedDeal!.id,
        user_id: user.user_id,
      });
      handleError(res);
      console.log(`Inserted deal interest for user ${user.first_name}`);
    } else {
      console.log(`Deal interest for user ${user.first_name} already exists`);
    }
  }

  console.log("==> Done inserting deal interest!\n");

  // Remove all existing deal to sponsor associations
  const res = await serverDb
    .deal_to_sponsor_associations()
    .delete()
    .eq("deal_id", insertedDeal!.id);
  handleError(res);
  console.log(
    `Removed ${res.data?.length} existing deal to sponsor associations`
  );
  let ii = 0;
  for (const sponsor of sponsors) {
    const res = await serverDb.deal_to_sponsor_associations().insert({
      deal_id: insertedDeal!.id,
      sponsor_id: sponsor.user_id,
      order_index: ii,
    });
    handleError(res);
    console.log(
      `Inserted deal to sponsor association for user ${sponsor.first_name}`
    );
    ii++;
  }

  console.log("==> Done inserting deal sponsors!\n");

  for (const view of viewedBy) {
    // check to see if view already exists, if not, insert it
    const res = await serverDb
      .deal_views()
      .select("*")
      .eq("user_id", view.user.user_id)
      .eq("deal_id", insertedDeal!.id)
      .eq("created_at", view.viewed_at.toISOString());
    handleError(res);
    if (res.data?.length === 0) {
      const res = await serverDb.deal_views().insert({
        user_id: view.user.user_id,
        deal_id: insertedDeal!.id,
        created_at: view.viewed_at.toISOString(),
      });
      handleError(res);
      console.log(`Inserted deal view for user ${view.user.first_name}`);
    } else {
      console.log(`Deal view for user ${view.user.first_name} already exists`);
    }
  }

  // remove all existing deal shares for the deal, and recreate them
  const rmres = await serverDb
    .deal_shares()
    .delete()
    .eq("deal_id", insertedDeal!.id);
  handleError(rmres);
  console.log(`Removed ${res.data?.length} existing deal shares`);

  // add deal shares
  for (const dealShare of dealShares) {
    const res = await serverDb.deal_shares().insert({
      from_user_id: dealShare.from_user.user_id,
      to_user_id: dealShare.to_user.user_id,
      deal_id: insertedDeal!.id,
    });
    handleError(res);
    console.log(
      `Inserted deal share from user ${dealShare.from_user.first_name} to user ${dealShare.to_user.first_name}`
    );
  }

  // add deal invites
  for (const dealInvite of dealInvites) {
    const res = await serverDb
      .invites()
      .select("*")
      .eq("from_user_id", dealInvite.from_user.user_id)
      .eq("to_email", dealInvite.email)
      .eq("on_deal_id", insertedDeal!.id);
    handleError(res);
    if (res.data?.length === 0) {
      const res = await serverDb.invites().insert({
        from_user_id: dealInvite.from_user.user_id,
        to_email: dealInvite.email,
        on_deal_id: insertedDeal!.id,
        is_accepted: dealInvite.is_accepted,
      });
      handleError(res);
      console.log(
        `Inserted deal invite from user ${dealInvite.from_user.first_name} to email ${dealInvite.email}`
      );
    } else {
      console.log(
        `Deal invite from user ${dealInvite.from_user.first_name} to email ${dealInvite.email} already exists`
      );
    }
  }

  return { deal: (await fetchDeal(deal))! };
}
