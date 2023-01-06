import { handleError } from "./seed_utils";
import { serverDb } from "api/modules/server_supabase";
import { createDeal, SeedDataComment } from "./seed_deal";
import { fetchOrAddAshtonGrayOrganization } from "./seed_organization";
import { createUserProfiles } from "./seed_users";
import { createEndorsement } from "./seed_endorsements";

import { createPrivateNotes, populateInboxMessages } from "./seed_inbox";
import { createConnection } from "./seed_connection";
import {
  Deal,
  NotificationType,
  Organization,
  UserProfile,
} from "types/tables";
import { createNotification } from "./seed_notifications";

const seedDeal: Deal["Insert"] = {
  is_active: true,
  about:
    "Ashton Gray Development is excited to present the opportunity to invest in the acquisition and entitlement(“Phase 1”) of approximately 76 acres of land located at 18401 US 290, Elgin, Texas, only 25 minutes from downtown Austin.",
  created_at: "2022-09-30 00:00:00",
  highlight_1_name: "Target Average Annual Return",
  highlight_1_value: "25%",
  highlight_2_name: "Equity Multiple",
  highlight_2_value: "1.625x",
  highlight_equity_raise: "6M",
  highlight_term: "2.5y",
  title: "78-Acre Commercial and Residential Development in Elgin, TX",
  handle: "ashtongray-elgin",
};

const dealImages: string[] = [
  "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_1.png&w=1920&q=75",
  "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_2.png&w=1920&q=75",
  "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_3.png&w=1920&q=75",
  "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_4.png&w=1920&q=75",
];

const dealFaqs: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What's the IRR for this deal?",
    answer: "Just under 22% IRR.",
  },
  {
    question: "Can I invest in the follow up vertical development.",
    answer: "After the term, there will be an opportunity to further invest.",
  },
];

async function main() {
  if (
    !process.env.TEST_USER_FULLNAME ||
    !process.env.TEST_USER_EMAIL ||
    !process.env.TEST_USER_PASSWORD
  ) {
    console.log(
      "Please set TEST_USER_* env vars before running script. For ex:"
    );
    console.log(
      "TEST_USER_FULLNAME = 'Ajay Sohmshetty', TEST_USER_EMAIL='ajay14@gmail.com', TEST_USER_PASSWORD='Aa1234'."
    );
    console.log(
      "These are used in generating the Users in your development remote db."
    );
    throw new Error();
  }
  const { primaryUser, nisha, shaun, emily } = await createUserProfiles();

  nisha.nominated_by_user_id = shaun.user_id;
  emily.nominated_by_user_id = nisha.user_id;
  shaun.nominated_by_user_id = primaryUser.user_id;
  primaryUser.nominated_by_user_id = primaryUser.user_id;

  let res = await serverDb
    .user_profiles()
    .upsert([nisha, shaun, emily, primaryUser]);
  handleError(res);

  const ashtonGrayOrg = await fetchOrAddAshtonGrayOrganization();

  // Add connections for Shaun, and the connection to primary user
  const workFamilyMembers = [nisha, emily];
  for (const member of workFamilyMembers) {
    await createConnection(shaun, member);
    await createConnection(primaryUser, member);
  }

  const dealComments: SeedDataComment[] = [
    {
      user: emily,
      comment: "How insulated is this region from a possible market downturn?",
      type: "FAQ",
      likes: [shaun, nisha],
      replies: [
        {
          user: shaun,
          comment:
            "Based on our analysis, the greater Houston, Texas real estate market appears to be strong and resilient to larger macroeconomic forces.",
          type: "FAQ",
          likes: [emily, primaryUser],
          replies: [],
        },
      ],
    },
    {
      user: shaun,
      comment:
        "We'll be closing soon -- please reach out if you'd like us to hold allocation for you.",
      type: "ANNOUNCEMENT",
      likes: [nisha],
      replies: [],
    },
  ];

  const dealViews = [
    { user: primaryUser, viewed_at: new Date("October 20 2022") },
    { user: primaryUser, viewed_at: new Date("October 21 2022") },
    { user: primaryUser, viewed_at: new Date("October 22 2022") },
    { user: primaryUser, viewed_at: new Date("October 23 2022") },
    { user: primaryUser, viewed_at: new Date("October 24 2022") },
    { user: primaryUser, viewed_at: new Date("October 25 2022") },
    { user: primaryUser, viewed_at: new Date("October 26 2022") },
    { user: primaryUser, viewed_at: new Date("October 27 2022") },
    { user: primaryUser, viewed_at: new Date("October 28 2022") },
    { user: emily, viewed_at: new Date("October 20 2022") },
    { user: emily, viewed_at: new Date("October 21 2022") },
    { user: emily, viewed_at: new Date("October 22 2022") },
    { user: emily, viewed_at: new Date("October 23 2022") },
    { user: emily, viewed_at: new Date("October 24 2022") },
    { user: emily, viewed_at: new Date("October 25 2022") },
    { user: emily, viewed_at: new Date("October 26 2022") },
    { user: emily, viewed_at: new Date("October 27 2022") },
    { user: emily, viewed_at: new Date("October 28 2022") },
  ];

  const dealShares: {
    from_user: UserProfile["Row"];
    to_user: UserProfile["Row"];
  }[] = [
    {
      from_user: primaryUser,
      to_user: emily,
    },
    {
      from_user: shaun,
      to_user: primaryUser,
    },
    {
      from_user: shaun,
      to_user: nisha,
    },
  ];

  const dealInvites = [
    {
      from_user: primaryUser,
      email: "ajay+shaun@elmbase.com",
      is_accepted: true,
    },
    {
      from_user: primaryUser,
      email: "ajay+friend@elmbase.com",
      is_accepted: false,
    },
  ];

  const { deal } = await createDeal({
    comments: dealComments,
    expressedInterest: [primaryUser, emily],
    sponsors: [shaun, nisha],
    viewedBy: dealViews,
    deal: seedDeal,
    dealImages: dealImages,
    dealFaqs: dealFaqs,
    dealShares: dealShares,
    dealInvites: dealInvites,
  });
  const text =
    "Shaun and his team at Ashton Gray are some of the best to work with. They’re absolute professionals who not only go above and beyond in the dilligence process to only put forth the best investment opportunites, but they are also a pleasure to discuss with and always helpful.";
  await createEndorsement({
    authorUser: primaryUser,
    toUser: shaun,
    text: text,
  });
  await populateInboxMessages({
    primaryUser: primaryUser,
    nisha: nisha,
    shaun: shaun,
    emily: emily,
  });
  await createPrivateNotes([
    {
      forUser: primaryUser,
      onDeal: deal,
      note: "Very interested! We should close him asap.",
    },
  ]);

  const inactiveDeal: Deal["Insert"] = {
    is_active: false,
    about:
      "Ashton Gray Development is excited to present the opportunity to invest in the acquisition and entitlement(“Phase 1”) of approximately 44 unit residential condo development.",
    created_at: "2022-01-30 00:00:00",
    highlight_1_name: "Target Average Annual Return",
    highlight_1_value: "35%",
    highlight_2_name: "Equity Multiple",
    highlight_2_value: "2.625x",
    highlight_equity_raise: "$10M",
    highlight_term: "4.5y",
    title: "44 unit residential condo development in Riverside, Tx",
    handle: "ashtongray-riverside",
  };

  const inactiveDealImages: string[] = [
    "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_6.jpeg&w=1920&q=75",
    "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_7.jpeg&w=1920&q=75",
    "https://elmbase.com/_next/image?url=%2Fstatic%2Fimages%2Fdeal_page%2Fdeal_pic_8.jpeg&w=1920&q=75",
  ];

  // Now create previous deal by Shaun
  await createDeal({
    comments: [],
    expressedInterest: [primaryUser, emily],
    sponsors: [shaun, nisha],
    viewedBy: [],
    deal: inactiveDeal,
    dealImages: inactiveDealImages,
    dealFaqs: [],
    dealShares: [],
    dealInvites: [],
  });

  // Populate notifications now
  const notifications: {
    receivingUser: UserProfile["Row"];
    fromUser: UserProfile["Row"];
    notificationType: NotificationType;
    isSeen: boolean;
    attached_deal: Deal["Row"] | null;
    attached_org: Organization["Row"] | null;
  }[] = [
    {
      receivingUser: primaryUser,
      fromUser: shaun,
      notificationType: "HasAcceptedYourConnectionRequest",
      isSeen: true,
      attached_deal: null,
      attached_org: null,
    },
    {
      receivingUser: primaryUser,
      fromUser: shaun,
      notificationType: "ReferredYouToANewDeal",
      isSeen: false,
      attached_deal: deal,
      attached_org: null,
    },
    {
      receivingUser: primaryUser,
      fromUser: shaun,
      notificationType: "PostedAComment",
      isSeen: false,
      attached_deal: deal,
      attached_org: null,
    },
    {
      receivingUser: primaryUser,
      fromUser: shaun,
      notificationType: "LikedYourPost",
      isSeen: false,
      attached_deal: deal,
      attached_org: null,
    },
    {
      receivingUser: shaun,
      fromUser: primaryUser,
      notificationType: "WroteYouAnEndorsement",
      isSeen: true,
      attached_deal: deal,
      attached_org: null,
    },
    {
      receivingUser: shaun,
      fromUser: primaryUser,
      notificationType: "ExpressedInterestInYourDeal",
      isSeen: false,
      attached_deal: deal,
      attached_org: null,
    },
    {
      receivingUser: shaun,
      fromUser: nisha,
      notificationType: "AddedYouAsATeamMember",
      isSeen: false,
      attached_deal: null,
      attached_org: ashtonGrayOrg,
    },
  ];

  for (const notification of notifications) {
    await createNotification(notification);
  }
}

main();
