import { Database } from "../supabase/generated/types";

// Structure inspired by: ziadmtl.dev/blog/using-supabase-with-typescript
// Convenience shortcuts to typedefs for tables
// To repro: grab all tables & views from generated_types, change to PascalCase from snake_case.

// Tables
export type Organization = Database["public"]["Tables"]["organizations"];
export type Migration = Database["public"]["Tables"]["migrations"];
export type Endorsement = Database["public"]["Tables"]["endorsements"];
export type DealCommentLike =
  Database["public"]["Tables"]["deal_comment_likes"];
export type DealImage = Database["public"]["Tables"]["deal_images"];
export type DealFAQ = Database["public"]["Tables"]["deal_faqs"];
export type DealInterest = Database["public"]["Tables"]["deal_interest"];
export type DealView = Database["public"]["Tables"]["deal_views"];
export type DealToSponsorAssociation =
  Database["public"]["Tables"]["deal_to_sponsor_associations"];
export type DealFilenames = Database["public"]["Tables"]["deal_filenames"];
export type DealAttachments = Database["public"]["Tables"]["deal_attachments"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"];
export type DealComment = Database["public"]["Tables"]["deal_comments"];
export type DealShare = Database["public"]["Tables"]["deal_shares"];
export type Deal = Database["public"]["Tables"]["deals"];
export type Connection = Database["public"]["Tables"]["connections"];
export type Conversation = Database["public"]["Tables"]["conversations"];
export type ConversationToUserAssociation =
  Database["public"]["Tables"]["conversation_to_user_associations"];
export type ConversationChange =
  Database["public"]["Tables"]["conversation_changes"];
export type Message = Database["public"]["Tables"]["messages"];
export type MessageReadReceipt =
  Database["public"]["Tables"]["message_read_receipts"];
export type PrivateNote = Database["public"]["Tables"]["private_notes"];
export type Relationship = Database["public"]["Tables"]["relationships"];
export type Notification = Database["public"]["Tables"]["notifications"];
export type Invite = Database["public"]["Tables"]["invites"];
export type Waitlist = Database["public"]["Tables"]["waitlist_emails"];

// Enums
export type NotificationType = Database["public"]["Enums"]["notification_type"];
export type DealCommentType = Database["public"]["Enums"]["deal_comment_type"];
