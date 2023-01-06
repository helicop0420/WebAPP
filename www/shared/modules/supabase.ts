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
  Waitlist,
} from "types/tables";
import {
  FriendsListView,
  MutualConnectionsView,
  SponsorDealsView,
  DealPageView,
  ProfilePageView,
  InboxPageView,
  InboxConversationView,
  DealDashboardView,
  DealAnalyticsView,
  InboxPageViewV2,
  NotificationsView,
  OrganizationPageView,
} from "types/views";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_KEY
) {
  throw new Error(
    "Need to set supabase creds" + process.env.NEXT_PUBLIC_SUPABASE_KEY
  );
}

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);

// Convenience shortcuts for tables, including type information
// ex: db.organizations().select("*").eq("id", 1)
export const db = {
  // Tables
  organizations: () =>
    clientSupabase.from<Organization["Row"]>("organizations"),
  migrations: () => clientSupabase.from<Migration["Row"]>("migrations"),
  endorsements: () => clientSupabase.from<Endorsement["Row"]>("endorsements"),
  deal_comment_likes: () =>
    clientSupabase.from<DealCommentLike["Row"]>("deal_comment_likes"),
  deal_images: () => clientSupabase.from<DealImage["Row"]>("deal_images"),
  deal_faqs: () => clientSupabase.from<DealFAQ["Row"]>("deal_faqs"),
  deal_interest: () =>
    clientSupabase.from<DealInterest["Row"]>("deal_interest"),
  deal_views: () => clientSupabase.from<DealView["Row"]>("deal_views"),
  user_profiles: () => clientSupabase.from<UserProfile["Row"]>("user_profiles"),
  deal_comments: () => clientSupabase.from<DealComment["Row"]>("deal_comments"),
  deal_shares: () => clientSupabase.from<DealShare["Row"]>("deal_shares"),
  deal_to_sponsor_associations: () =>
    clientSupabase.from<DealToSponsorAssociation["Row"]>(
      "deal_to_sponsor_associations"
    ),
  deal_filenames: () =>
    clientSupabase.from<DealFilenames["Row"]>("deal_filenames"),
  deal_attachments: () =>
    clientSupabase.from<DealAttachments["Row"]>("deal_attachments"),
  deals: () => clientSupabase.from<Deal["Row"]>("deals"),
  connections: () => clientSupabase.from<Connection["Row"]>("connections"),
  conversations: () =>
    clientSupabase.from<Conversation["Row"]>("conversations"),
  conversation_to_user_associations: () =>
    clientSupabase.from<ConversationToUserAssociation["Row"]>(
      "conversation_to_user_associations"
    ),
  conversation_changes: () =>
    clientSupabase.from<ConversationChange["Row"]>("conversation_changes"),
  messages: () => clientSupabase.from<Message["Row"]>("messages"),
  message_read_receipts: () =>
    clientSupabase.from<MessageReadReceipt["Row"]>("message_read_receipts"),
  private_notes: () => clientSupabase.from<PrivateNote["Row"]>("private_notes"),
  relationships: () =>
    clientSupabase.from<Relationship["Row"]>("relationships"),
  notifications: () =>
    clientSupabase.from<Notification["Row"]>("notifications"),
  invites: () => clientSupabase.from<Invite["Row"]>("invites"),
  waitlist_emails: () =>
    clientSupabase.from<Waitlist["Row"]>("waitlist_emails"),

  // Views
  friends_list_view: () =>
    clientSupabase.from<FriendsListView>("friends_list_view"),
  autocomplete_users_view: () =>
    clientSupabase.from<FriendsListView>("autocomplete_users_view"),
  mutual_connections_view: () =>
    clientSupabase.from<MutualConnectionsView>("mutual_connections_view"),
  sponsor_deals_view: () =>
    clientSupabase.from<SponsorDealsView>("sponsor_deals_view"),
  deal_page_view: () => clientSupabase.from<DealPageView>("deal_page_view"),
  profile_page_view: () =>
    clientSupabase.from<ProfilePageView>("profile_page_view"),
  inbox_page_view: () => clientSupabase.from<InboxPageView>("inbox_page_view"),
  inbox_page_view_v2: () =>
    clientSupabase.from<InboxPageViewV2>("inbox_page_view_v2"),
  inbox_conversation_view: () =>
    clientSupabase.from<InboxConversationView>("inbox_conversation_view"),
  deal_dashboard_view: () =>
    clientSupabase.from<DealDashboardView>("deal_dashboard_view"),
  deal_analytics_view: () =>
    clientSupabase.from<DealAnalyticsView>("deal_analytics_view"),
  deal_notifications_view: () =>
    clientSupabase.from<NotificationsView>("notifications_view"),
  organization_page_view: () =>
    clientSupabase.from<OrganizationPageView>("organization_page_view"),
};
