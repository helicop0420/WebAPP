import { Database } from "../supabase/generated/types";
import { ConversationChange } from "./tables";

// Views (need to be manually extended)
export type FriendsListView =
  Database["public"]["Views"]["friends_list_view"]["Row"];
export type AutoCompleteUsersView =
  Database["public"]["Views"]["autocomplete_users_view"]["Row"];
export type MutualConnectionsView =
  Database["public"]["Views"]["mutual_connections_view"]["Row"];
export type SponsorDealsView = Omit<
  Database["public"]["Views"]["sponsor_deals_view"]["Row"],
  "deals"
> & {
  deals: null | Deals[];
};

export type InboxPageView = Omit<
  Database["public"]["Views"]["inbox_page_view"]["Row"],
  "all_conversations"
> & {
  all_conversations: null | ConversationPreview[];
};

export type InboxPageViewV2 = Omit<
  Database["public"]["Views"]["inbox_page_view_v2"]["Row"],
  "users_in_conv"
> & {
  users_in_conv: null | UsersInConversation[];
};

export type InboxConversationChange = ConversationChange["Row"] & {
  removed_user_first_name: string;
  removed_user_last_name: string;
  removed_user_handle: string;
};

export type InboxConversationView = Omit<
  Database["public"]["Views"]["inbox_conversation_view"]["Row"],
  "users_in_conv" | "all_messages" | "all_conversation_changes"
> & {
  users_in_conv: null | UsersInConversation[];
  all_messages: null | ConversationMessage[];
  all_conversation_changes: null | InboxConversationChange[];
};
export type ProfilePageView = Omit<
  Database["public"]["Views"]["profile_page_view"]["Row"],
  "mutual_connections" | "deals" | "endorsements"
> & {
  mutual_connections: null | MutualConnections[];
  deals: null | Deals[];
  endorsements: null | Endorsement[];
};
export type DealPageView = Omit<
  Database["public"]["Views"]["deal_page_view"]["Row"],
  | "connections_deal_interest"
  | "deal_comments"
  | "deal_images"
  | "deal_sponsors"
  | "handle"
  | "deal_faqs"
> & {
  connections_deal_interest: null | ConnectionDealInterest[];
  deal_comments: null | DealComment[];
  deal_images: null | DealImage[];
  deal_sponsors: null | Sponsor[];
  deal_sponsor_teams: null;
  handle: string;
  deal_faqs: null | DealFaq[];
  referrer: null | DealReferrer[];
};

export type DealDashboardView = Omit<
  Database["public"]["Views"]["deal_dashboard_view"]["Row"],
  "deals"
> & {
  deals: null | DealDashboardRowDeal[];
};

export type DealAnalyticsView = Omit<
  Database["public"]["Views"]["deal_analytics_view"]["Row"],
  "data"
> & {
  data: null | DealAnalyticsData[];
};

export type NotificationsView = Omit<
  Database["public"]["Views"]["notifications_view"]["Row"],
  "notifications"
> & {
  notifications: null | Notification[];
};

export type OrganizationPageView = Omit<
  Database["public"]["Views"]["organization_page_view"]["Row"],
  "deals" | "team_members" | "team_members_you_may_know"
> & {
  deals: OrgDeals[] | null;
  team_members: OrgMembers[] | null;
  team_members_you_may_know: TeamMembersYouMayKnow[] | null;
};
// Inbox Page View json types
export interface UsersInConversation {
  current_org_name: null | string;
  current_org_position: null | string;
  first_name: null | string;
  handle: null | string;
  last_name: null | string;
  profile_pic_url: null | string;
  user_id: string;
}

// Inbox Conversation View json types
export interface ConversationMessage {
  all_read_receipts: null | ReadReceipt[];
  content: string;
  created_at: string;
  deal_about: null | string;
  deal_handle: null | string;
  deal_image: null | string;
  deal_title: null | string;
  id: number;
  nudged_time: null | string;
  on_deal_id: null | number;
  sender_user_first_name: null | string;
  sender_user_handle: null | string;
  sender_user_last_name: null | string;
  sender_user_profile_pic_url: null | string;
  user_id: string;
  attachment_filename: string;
  attachment_size_in_bytes: number;
  attachment_type: string;
  attachment_url: string;
}

export interface ConversationPreview {
  conversation_id: number;
  is_marked_done: boolean;
  latest_message_content: null | string;
  number_of_unread_messages: number;
  latest_message_sent_at: string;
  latest_message_user_id: string;
  title: null | string;
  users_in_conv: null | UsersInConversation[];
  attachment_ids_in_convo: number[] | null;
  deal_interest_level_breakdown: {
    user_id: string;
    deal_id: number;
    expressed_interest: boolean;
    deal_view_count: number;
    attachments_received: { id: number; filename: string }[];
    interest_level: string;
  } | null;
}

export interface ReadReceipt {
  read_at: string;
  read_by_user_id: string;
}

// User Profile View Json types
export interface Endorsement {
  created_at: string;
  endorsing_user_first_name: string | null;
  endorsing_user_handle: string | null;
  endorsing_user_last_name: string | null;
  endorsing_user_profile_pic_url: string | null;
  endorsing_user_user_id: string;
  relationship: string;
  on_deal: string;
  text: string;
}

export interface Deals {
  about: string | null;
  deal_image: string | null;
  handle: string;
  id: number;
  interest_count: number | null;
  is_active: boolean;
  leader_user_id: string;
  title: string | null;
  created_at: string;
}

export interface DealAttachment {
  id: number;
  deal_filename_id: number;
  storage_url: string;
  attachment_type: string;
  created_at: string | null;
  updated_at: string | null;
  size_in_bytes: number;
}

export interface MutualConnections {
  first_name: string | null;
  handle: string | null;
  last_name: string | null;
  profile_pic_url: string | null;
  user_id: string;
}

export interface ConnectionDealInterest {
  first_name: null | string;
  subtitle: null | string;
  handle: null | string;
  last_name: null | string;
  profile_pic_url: null | string;
  user_id: string;
}

export interface DealComment {
  comment: string;
  created_at: null | string;
  first_name: null | string;
  handle: null | string;
  id: number;
  last_name: null | string;
  likes: null | Likes[];
  likes_count: number | null;
  profile_pic_url: null | string;
  replying_to_comment_id: null | number;
  type: "ANNOUNCEMENT" | "FAQ";
  updated_at: string;
  user_id: string;
  is_private: boolean;
}

export interface DealImage {
  id: number;
  deal_id: number;
  image_url: string;
  order_index: number | null;
  created_at: string | null;
  updated_at: string | null;
}
export interface Likes {
  first_name: null | string;
  handle: null | string;
  subtitle: null | string;
  last_name: null | string;
  profile_pic_url: null | string;
  user_id: string;
}

export interface Sponsor {
  user_id: string;
  first_name: null | string;
  last_name: null | string;
  handle: null | string;
  subtitle: null | string;
  profile_pic_url: null | string;
  current_org_name: null | string;
  current_org_position: null | string;
  deals: null | Deals[];
  mutual_connections: null | MutualConnections[];
  order_index: number;
  org_members: null | OrgMember[];
  deal_to_sponsor_association_id: number;
}

export interface DealDashboardRowDeal {
  id: number;
  handle: string;
  launch_date: null | string;
  title: string;
  is_active: boolean;
  sponsors: DealDashboardRowSponsors[] | null;
  is_sponsor: boolean;
  deal_unique_share_link: string;
}

export interface DealDashboardRowSponsors {
  user_id: string;
  handle: string | null;
  profile_pic_url: string | null;
  subtitle: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface OrgMember {
  current_org_position: null | string;
  first_name: null | string;
  last_name: null | string;
  profile_pic_url: null | string;
  user_id: string;
  handle: null | string;
}

export interface DealAnalyticsData {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_pic_url: string | null;
  handle: string | null;
  interest_level: string;
  deal_interest_level_breakdown: {
    user_id: string;
    deal_id: number;
    expressed_interest: boolean;
    deal_view_count: number;
    attachments_received:
      | {
          id: number;
          filename: string;
        }[]
      | null;
    interest_level: string;
  };
  expressed_interest: boolean;
  view_count: number;
  all_attachment_stats: {
    filename: string;
    has_received: boolean;
    view_count: number;
  }[];
  referred_by_users: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    profile_pic_url: string | null;
    handle: string;
  }[];
  referred_users: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    profile_pic_url: string | null;
    handle: string;
  }[];
  team_notes: null | string;
  private_note_last_edited_user_id: null | string;
  private_note_last_edited_user_first_name: null | string;
  private_note_last_edited_user_last_name: null | string;
  private_note_last_edited_user_profile_pic_url: null | string;
  private_note_last_edited_user_handle: null | string;
}
export enum DealInterestLevel {
  SlightlyInterested = "SlightlyInterested",
  ModeratelyInterested = "ModeratelyInterested",
  VeryInterested = "VeryInterested",
  NotInterested = "NotInterested",
  NA = "NA",
}

export interface DealFaq {
  answer: string;
  created_at: string;
  id: number;
  question: string;
  updated_at: string;
}

export interface DealReferrer {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_pic_url: string | null;
  handle: string;
}

export interface Notification {
  attached_deal_handle: null | string;
  attached_deal_id: null | number;
  attached_deal_title: null | string;
  attached_org_id: number;
  attached_org_name: null | string;
  attached_org_profile_pic_url: null | string;
  created_at: string;
  debug_info: null | string;
  first_name: null | string;
  from_user_id: string;
  handle: null | string;
  id: number;
  is_seen: boolean;
  last_name: null | string;
  notification_type: Database["public"]["Enums"]["notification_type"];
  profile_pic_url: null | string;
  receiving_user_id: string;
  updated_at: string;
}

export interface TeamMembersYouMayKnow {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  handle: string | null;
  profile_pic_url: string | null;
  subtitle: string | null;
  is_connected: boolean | null;
  num_mutuals: number | null;
  mutual_connections: MutualConnections[] | null;
}

export interface OrgDeals {
  about: string | null;
  created_at: string | null;
  deal_image: string | null;
  handle: string | null;
  id: number | null;
  interest_count: number | null;
  is_active: boolean | null;
  leader_user_id: string | null;
  title: string | null;
  unique_share_link: string | null;
}

export interface OrgMembers {
  is_current: boolean | null;
  is_leadership: boolean | null;
  job_title: string | null;
  order_index: number | null;
  team_member_connections_count: number | null;
  team_member_first_name: string | null;
  team_member_handle: string | null;
  team_member_is_connected: boolean | null;
  team_member_last_name: string | null;
  team_member_linkedin_url: string | null;
  team_member_mutual_connections: MutualConnections[] | null;
  team_member_profile_pic_url: string | null;
  team_member_twitter_url: string | null;
  team_member_subtitle: string | null;
  team_member_user_id: string | null;
}
