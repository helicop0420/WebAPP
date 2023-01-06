import { createClient } from "@supabase/supabase-js";
import {
  Connection,
  Conversation,
  ConversationChange,
  ConversationToUserAssociation,
  Deal,
  DealAttachments,
  DealComment,
  DealCommentLike,
  DealFAQ,
  DealFilenames,
  DealImage,
  DealInterest,
  DealShare,
  DealToSponsorAssociation,
  DealView,
  Endorsement,
  Invite,
  Message,
  MessageReadReceipt,
  Migration,
  Notification,
  Organization,
  PrivateNote,
  Relationship,
  UserProfile,
} from "types/tables";
import {
  FriendsListView,
  MutualConnectionsView,
  SponsorDealsView,
  DealPageView,
  ProfilePageView,
  InboxConversationView,
  InboxPageView,
} from "types/views";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_SERVER_SUPABASE_KEY
) {
  console.log(process.env);
  throw new Error(
    "NEXT_SERVER_SUPABASE_KEY and NEXT_PUBLIC_SUPABASE_URL are required for the API"
  );
}

// Enforces strict server supabase import
export const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_SERVER_SUPABASE_KEY
);

// Convenience shortcuts for tables, including type information
// ex: serverDb.organizations().select("*").eq("id", 1)
export const serverDb = {
  // Tables
  organizations: () =>
    serverSupabase.from<Organization["Row"]>("organizations"),
  migrations: () => serverSupabase.from<Migration["Row"]>("migrations"),
  endorsements: () => serverSupabase.from<Endorsement["Row"]>("endorsements"),
  deal_comment_likes: () =>
    serverSupabase.from<DealCommentLike["Row"]>("deal_comment_likes"),
  deal_images: () => serverSupabase.from<DealImage["Row"]>("deal_images"),
  deal_faqs: () => serverSupabase.from<DealFAQ["Row"]>("deal_faqs"),
  deal_interest: () =>
    serverSupabase.from<DealInterest["Row"]>("deal_interest"),
  deal_views: () => serverSupabase.from<DealView["Row"]>("deal_views"),
  user_profiles: () => serverSupabase.from<UserProfile["Row"]>("user_profiles"),
  deal_comments: () => serverSupabase.from<DealComment["Row"]>("deal_comments"),
  deal_shares: () => serverSupabase.from<DealShare["Row"]>("deal_shares"),
  deal_filenames: () =>
    serverSupabase.from<DealFilenames["Row"]>("deal_filenames"),
  deal_attachments: () =>
    serverSupabase.from<DealAttachments["Row"]>("deal_attachments"),
  deal_to_sponsor_associations: () =>
    serverSupabase.from<DealToSponsorAssociation["Row"]>(
      "deal_to_sponsor_associations"
    ),
  deals: () => serverSupabase.from<Deal["Row"]>("deals"),
  connections: () => serverSupabase.from<Connection["Row"]>("connections"),
  conversations: () =>
    serverSupabase.from<Conversation["Row"]>("conversations"),
  conversation_to_user_associations: () =>
    serverSupabase.from<ConversationToUserAssociation["Row"]>(
      "conversation_to_user_associations"
    ),
  conversation_changes: () =>
    serverSupabase.from<ConversationChange["Row"]>("conversation_changes"),
  messages: () => serverSupabase.from<Message["Row"]>("messages"),
  message_read_receipts: () =>
    serverSupabase.from<MessageReadReceipt["Row"]>("message_read_receipts"),
  private_notes: () => serverSupabase.from<PrivateNote["Row"]>("private_notes"),
  relationships: () =>
    serverSupabase.from<Relationship["Row"]>("relationships"),
  notifications: () =>
    serverSupabase.from<Notification["Row"]>("notifications"),
  invites: () => serverSupabase.from<Invite["Row"]>("invites"),

  // Views
  friends_list_view: () =>
    serverSupabase.from<FriendsListView>("friends_list_view"),
  mutual_connections_view: () =>
    serverSupabase.from<MutualConnectionsView>("mutual_connections_view"),
  sponsor_deals_view: () =>
    serverSupabase.from<SponsorDealsView>("sponsor_deals_view"),
  deal_page_view: () => serverSupabase.from<DealPageView>("deal_page_view"),
  profile_page_view: () =>
    serverSupabase.from<ProfilePageView>("profile_page_view"),
  inbox_page_view: () => serverSupabase.from<InboxPageView>("inbox_page_view"),
  inbox_conversation_view: () =>
    serverSupabase.from<InboxConversationView>("inbox_conversation_view"),
};
