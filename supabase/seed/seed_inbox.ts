import { serverDb, serverSupabase } from "api/modules/server_supabase";
import {
  Conversation,
  ConversationToUserAssociation,
  Deal,
  Message,
  MessageReadReceipt,
  UserProfile,
} from "types/tables";
import { handleError } from "./seed_utils";

interface SeedMessage {
  postingUser: UserProfile["Row"];
  isRead: boolean;
  postedAt: string | null;
  nudgedAt: string | null;
  content: string;
}

interface SeedConversation {
  createdAt: string;
  updatedAt: string;
  users: UserProfile["Row"][];
  title: string | null;
  isRead: boolean;
  messages: SeedMessage[];
  isMarkedDone: boolean;
}

interface SeedPrivateNote {
  forUser: UserProfile["Row"];
  onDeal: Deal["Row"];
  note: string;
}

async function addOrUpdateConversations(conversations: SeedConversation[]) {
  // iterate over conversations
  let convoCount = 1;
  for (const conversation of conversations) {
    console.log(`Adding convo ${convoCount}`);
    const convoData: Conversation["Insert"] = {
      created_at: conversation.createdAt,
      updated_at: conversation.updatedAt,
      title: conversation.title,
      is_marked_done: conversation.isMarkedDone,
    };

    const checkExistingConvo = await serverDb
      .conversations()
      .select("*")
      .eq("created_at", convoData.created_at!)
      .eq("updated_at", convoData.updated_at!)
      .eq("is_marked_done", convoData.is_marked_done!);
    handleError(checkExistingConvo);

    let convoRes;
    if (!checkExistingConvo.data?.length) {
      convoRes = await serverDb.conversations().insert(convoData).select();
      handleError(convoRes);
    } else {
      convoRes = checkExistingConvo;
      console.log(`Conversation ${convoCount} already exists`);
    }

    console.log(
      `Adding/Updating data for convo ${convoCount} of ${conversations.length}`
    );
    const currentConvo = convoRes.data![0];
    for (const user of conversation.users) {
      const associationData: ConversationToUserAssociation["Insert"] = {
        created_at: conversation.createdAt,
        updated_at: conversation.updatedAt,
        user_id: user.user_id,
        conversation_id: currentConvo.id,
      };

      const checkExistingAssociation = await serverDb
        .conversation_to_user_associations()
        .select("*")
        .eq("user_id", associationData.user_id!)
        .eq("conversation_id", associationData.conversation_id!);
      handleError(checkExistingAssociation);

      if (!checkExistingAssociation.data?.length) {
        const associationRes = await serverSupabase
          .from<ConversationToUserAssociation["Insert"]>(
            "conversation_to_user_associations"
          )
          .insert(associationData);
        handleError(associationRes);
      } else {
        console.log(`Conversation association ${convoCount} already exists`);
      }
    }

    for (const message of conversation.messages) {
      const messageData: Message["Insert"] = {
        created_at: message.postedAt,
        updated_at: message.postedAt,
        content: message.content,
        nudged_time: message.nudgedAt,
        user_id: message.postingUser.user_id,
        conversation_id: currentConvo.id!,
      };

      const checkExisitingMessage = await serverDb
        .messages()
        .select("*")
        .eq("conversation_id", currentConvo.id!)
        .eq("content", message.content)
        .eq("user_id", message.postingUser.user_id)
        .eq("updated_at", message.postedAt);

      let messageRes = null;
      if (!checkExisitingMessage.data?.length) {
        messageRes = await serverDb.messages().insert(messageData).select();
        handleError(messageRes);
      } else {
        messageRes = checkExisitingMessage;
        console.log(`Message Already exists`);
      }

      const insertedMessage = messageRes.data![0];
      if (conversation.isRead) {
        const checkReadReceipt = await serverDb
          .message_read_receipts()
          .select("*")
          .eq("message_id", insertedMessage.id!)
          .eq("user_id", insertedMessage.user_id!);
        handleError(checkReadReceipt);

        if (!checkReadReceipt.data?.length) {
          const readReceiptData: MessageReadReceipt["Insert"] = {
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: insertedMessage.user_id,
            message_id: insertedMessage.id!,
          };
          const res = await serverSupabase
            .from<MessageReadReceipt["Insert"]>("message_read_receipts")
            .insert(readReceiptData);
          handleError(res);
        }
      }
    }
    convoCount++;
  }
  console.log(`==> Done adding conversations!`);
}

export async function createPrivateNotes(notes: SeedPrivateNote[]) {
  for (const note of notes) {
    const checkExistingNote = await serverDb
      .private_notes()
      .select("*")
      .eq("user_id", note.forUser.user_id)
      .eq("deal_id", note.onDeal.id);
    handleError(checkExistingNote);

    if (!checkExistingNote.data?.length) {
      const res = await serverSupabase.from("private_notes").insert({
        user_id: note.forUser.user_id,
        deal_id: note.onDeal.id,
        note: note.note,
      });
      handleError(res);
    } else {
      console.log(`Note for ${note.forUser.user_id} already exists`);
    }
  }
  console.log(`==> Done adding private notes!`);
}

export async function populateInboxMessages({
  primaryUser,
  nisha,
  shaun,
  emily,
}: {
  primaryUser: UserProfile["Row"];
  nisha: UserProfile["Row"];
  shaun: UserProfile["Row"];
  emily: UserProfile["Row"];
}) {
  const conversations: SeedConversation[] = [
    {
      users: [primaryUser, emily],
      title: null,
      isRead: true,
      isMarkedDone: true,
      createdAt: new Date("March 1 2022").toISOString(),
      updatedAt: new Date("March 1 2022").toISOString(),
      messages: [
        {
          postingUser: nisha,
          isRead: false,
          postedAt: new Date("March 1 2022").toISOString(), // can provide hardcoded dates
          nudgedAt: null,
          content:
            "Hello, I am interested to learn more about your property in downtown Austin! I was wondering what risks are associated with this investment as we are headed toward a recession?",
        },
        {
          postingUser: primaryUser,
          isRead: false,
          postedAt: new Date("March 2 2022").toISOString(), // can provide hardcoded dates
          nudgedAt: null,
          content:
            "Appreciate the question! We’ve done a thorough analysis of this area and are confident that the deal is resilient to macroeconomic conditions. Job growth is healthy and the rent-to-price ratio of comparables aren’t inflated like other areas poised for a bubble-burst.",
        },
      ],
    },
    {
      users: [primaryUser, nisha],
      title: null,
      isRead: true,
      isMarkedDone: false,
      createdAt: new Date("February 1 2022").toISOString(),
      updatedAt: new Date("February 1 2022").toISOString(),
      messages: [
        {
          postingUser: emily,
          isRead: false,
          postedAt: new Date("February 1 2022").toISOString(), // can provide hardcoded dates
          nudgedAt: null,
          content:
            "Your property in Elgin looks great! What is the total lot size of the property?",
        },
        {
          postingUser: primaryUser,
          isRead: false,
          postedAt: new Date("February 14 2022").toISOString(), // can provide hardcoded dates
          nudgedAt: null,
          content:
            "Thanks for the question Emily! The total lot size is roughly 78 acres.",
        },
      ],
    },
    {
      users: [primaryUser, shaun],
      title: null,
      isRead: true,
      isMarkedDone: false,
      createdAt: new Date("February 15 2022").toISOString(),
      updatedAt: new Date("February 15 2022").toISOString(),
      messages: [
        {
          postingUser: shaun,
          isRead: false,
          postedAt: new Date("February 15 2022").toISOString(), // can provide hardcoded dates
          nudgedAt: null,
          content:
            "I was referred to you by our mutual connection John. Would be interested to learning more about investment opportunities in Austin?",
        },
        {
          postingUser: primaryUser,
          isRead: false,
          postedAt: new Date("February 15 2022").toISOString(), // can provide hardcoded dates
          nudgedAt: null,
          content: "Sure, let's connect!",
        },
      ],
    },
    {
      users: [shaun, emily, nisha, primaryUser],
      title: "Texas Opportunities - BDL Conference",
      isRead: false,
      isMarkedDone: false,
      createdAt: new Date("January 1 2022").toISOString(),
      updatedAt: new Date("January 1 2022").toISOString(),
      messages: [
        {
          postingUser: primaryUser,
          isRead: false,
          postedAt: new Date("January 1 2022").toISOString(),
          nudgedAt: null,
          content: "This property is about 76 acres.",
        },
        {
          postingUser: emily,
          isRead: false,
          postedAt: new Date("January 1 2022").toISOString(),
          nudgedAt: null,
          content:
            "Wow, these mockups look incredible. Excellent job to the team over at Ashton Gray for putting together these materials and this opportunity for us.",
        },
        {
          postingUser: shaun,
          isRead: false,
          postedAt: new Date("January 2 2022").toISOString(),
          nudgedAt: null,
          content:
            "This will likely be our last opportunity for the year as we are focused on our existing developments. Thanks for your interest.",
        },
        {
          postingUser: nisha,
          isRead: false,
          postedAt: new Date("January 3 2022").toISOString(),
          nudgedAt: null,
          content:
            "The property is about 76 acres. We’re happy to share the pitch deck if you are interested.",
        },
      ],
    },
  ];
  addOrUpdateConversations(conversations);
}
