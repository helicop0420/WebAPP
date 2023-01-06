export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      deal_comment_likes: {
        Row: {
          id: number;
          user_id: string;
          deal_comment_id: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          deal_comment_id: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          deal_comment_id?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      deal_images: {
        Row: {
          id: number;
          deal_id: number;
          image_url: string;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          image_url: string;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          image_url?: string;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      deal_interest: {
        Row: {
          id: number;
          deal_id: number;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: never;
          name: string;
          created_at: string;
        };
        Update: {
          id?: never;
          name?: string;
          created_at?: string;
        };
      };
      connections: {
        Row: {
          id: number;
          from_user_id: string;
          to_user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          from_user_id: string;
          to_user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          from_user_id?: string;
          to_user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      conversations: {
        Row: {
          id: number;
          title: string | null;
          created_at: string | null;
          updated_at: string | null;
          is_marked_done: boolean;
        };
        Insert: {
          id?: number;
          title?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_marked_done?: boolean;
        };
        Update: {
          id?: number;
          title?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_marked_done?: boolean;
        };
      };
      conversation_to_user_associations: {
        Row: {
          id: number;
          user_id: string | null;
          conversation_id: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          conversation_id?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          conversation_id?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      relationships: {
        Row: {
          id: number;
          author_user_id: string;
          on_user_id: string;
          private_notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          author_user_id: string;
          on_user_id: string;
          private_notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          author_user_id?: string;
          on_user_id?: string;
          private_notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      message_read_receipts: {
        Row: {
          id: number;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
          message_id: number;
        };
        Insert: {
          id?: number;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
          message_id: number;
        };
        Update: {
          id?: number;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          message_id?: number;
        };
      };
      deal_views: {
        Row: {
          id: number;
          deal_id: number;
          user_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          user_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          user_id?: string;
          created_at?: string | null;
        };
      };
      deal_comments: {
        Row: {
          id: number;
          user_id: string;
          comment: string;
          replying_to_comment_id: number | null;
          created_at: string | null;
          updated_at: string | null;
          deal_id: number;
          type: Database["public"]["Enums"]["deal_comment_type"] | null;
          likes_count: number | null;
          is_private: boolean;
        };
        Insert: {
          id?: number;
          user_id: string;
          comment: string;
          replying_to_comment_id?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          deal_id: number;
          type?: Database["public"]["Enums"]["deal_comment_type"] | null;
          likes_count?: number | null;
          is_private?: boolean;
        };
        Update: {
          id?: number;
          user_id?: string;
          comment?: string;
          replying_to_comment_id?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          deal_id?: number;
          type?: Database["public"]["Enums"]["deal_comment_type"] | null;
          likes_count?: number | null;
          is_private?: boolean;
        };
      };
      private_notes: {
        Row: {
          id: number;
          deal_id: number;
          user_id: string;
          note: string;
          created_at: string | null;
          updated_at: string | null;
          last_edit_by_user_id: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          user_id: string;
          note: string;
          created_at?: string | null;
          updated_at?: string | null;
          last_edit_by_user_id?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          user_id?: string;
          note?: string;
          created_at?: string | null;
          updated_at?: string | null;
          last_edit_by_user_id?: string | null;
        };
      };
      messages: {
        Row: {
          id: number;
          conversation_id: number;
          content: string;
          user_id: string;
          on_deal_id: number | null;
          nudged_time: string | null;
          created_at: string | null;
          updated_at: string | null;
          deal_attachment_id: number | null;
        };
        Insert: {
          id?: number;
          conversation_id: number;
          content: string;
          user_id: string;
          on_deal_id?: number | null;
          nudged_time?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deal_attachment_id?: number | null;
        };
        Update: {
          id?: number;
          conversation_id?: number;
          content?: string;
          user_id?: string;
          on_deal_id?: number | null;
          nudged_time?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          deal_attachment_id?: number | null;
        };
      };
      deal_filenames: {
        Row: {
          id: number;
          deal_id: number;
          filename: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          filename: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          filename?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: number;
          receiving_user_id: string;
          from_user_id: string;
          debug_info: string | null;
          attached_deal_id: number | null;
          attached_org_id: number | null;
          notification_type: Database["public"]["Enums"]["notification_type"];
          created_at: string | null;
          updated_at: string | null;
          is_seen: boolean;
        };
        Insert: {
          id?: number;
          receiving_user_id: string;
          from_user_id: string;
          debug_info?: string | null;
          attached_deal_id?: number | null;
          attached_org_id?: number | null;
          notification_type: Database["public"]["Enums"]["notification_type"];
          created_at?: string | null;
          updated_at?: string | null;
          is_seen?: boolean;
        };
        Update: {
          id?: number;
          receiving_user_id?: string;
          from_user_id?: string;
          debug_info?: string | null;
          attached_deal_id?: number | null;
          attached_org_id?: number | null;
          notification_type?: Database["public"]["Enums"]["notification_type"];
          created_at?: string | null;
          updated_at?: string | null;
          is_seen?: boolean;
        };
      };
      conversation_changes: {
        Row: {
          id: number;
          conversation_id: number;
          renamed_to: string | null;
          added_user_id: string | null;
          removed_user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          conversation_id: number;
          renamed_to?: string | null;
          added_user_id?: string | null;
          removed_user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          conversation_id?: number;
          renamed_to?: string | null;
          added_user_id?: string | null;
          removed_user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      deal_to_sponsor_associations: {
        Row: {
          id: number;
          deal_id: number;
          sponsor_id: string;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          sponsor_id: string;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          sponsor_id?: string;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      deal_faqs: {
        Row: {
          id: number;
          question: string;
          answer: string;
          deal_id: number;
          created_at: string | null;
          updated_at: string | null;
          order_index: number | null;
        };
        Insert: {
          id?: number;
          question: string;
          answer: string;
          deal_id: number;
          created_at?: string | null;
          updated_at?: string | null;
          order_index?: number | null;
        };
        Update: {
          id?: number;
          question?: string;
          answer?: string;
          deal_id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          order_index?: number | null;
        };
      };
      endorsements: {
        Row: {
          id: number;
          author_user_id: string;
          to_user_id: string;
          text: string;
          created_at: string | null;
          updated_at: string | null;
          on_deal: string | null;
          relationship: string | null;
        };
        Insert: {
          id?: number;
          author_user_id: string;
          to_user_id: string;
          text: string;
          created_at?: string | null;
          updated_at?: string | null;
          on_deal?: string | null;
          relationship?: string | null;
        };
        Update: {
          id?: number;
          author_user_id?: string;
          to_user_id?: string;
          text?: string;
          created_at?: string | null;
          updated_at?: string | null;
          on_deal?: string | null;
          relationship?: string | null;
        };
      };
      deal_attachment_stats: {
        Row: {
          id: number;
          deal_attachment_id: number;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
          view_count: number;
          progress: number;
        };
        Insert: {
          id?: number;
          deal_attachment_id: number;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
          view_count?: number;
          progress?: number;
        };
        Update: {
          id?: number;
          deal_attachment_id?: number;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          view_count?: number;
          progress?: number;
        };
      };
      deal_attachments: {
        Row: {
          id: number;
          deal_filename_id: number;
          storage_url: string;
          attachment_type: string;
          created_at: string | null;
          updated_at: string | null;
          size_in_bytes: number;
          total_num_pages: number | null;
        };
        Insert: {
          id?: number;
          deal_filename_id: number;
          storage_url: string;
          attachment_type: string;
          created_at?: string | null;
          updated_at?: string | null;
          size_in_bytes: number;
          total_num_pages?: number | null;
        };
        Update: {
          id?: number;
          deal_filename_id?: number;
          storage_url?: string;
          attachment_type?: string;
          created_at?: string | null;
          updated_at?: string | null;
          size_in_bytes?: number;
          total_num_pages?: number | null;
        };
      };
      organization_to_user_associations: {
        Row: {
          id: number;
          org_id: number;
          user_id: string;
          order_index: number | null;
          job_title: string | null;
          created_at: string | null;
          updated_at: string | null;
          is_leadership: boolean;
          is_current: boolean;
        };
        Insert: {
          id?: number;
          org_id: number;
          user_id: string;
          order_index?: number | null;
          job_title?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_leadership?: boolean;
          is_current?: boolean;
        };
        Update: {
          id?: number;
          org_id?: number;
          user_id?: string;
          order_index?: number | null;
          job_title?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_leadership?: boolean;
          is_current?: boolean;
        };
      };
      user_profiles: {
        Row: {
          user_id: string;
          profile_pic_url: string | null;
          subtitle: string | null;
          nominated_by_user_id: string | null;
          about: string | null;
          facebook_url: string | null;
          twitter_url: string | null;
          instagram_url: string | null;
          linkedin_url: string | null;
          created_at: string | null;
          is_sponsor: boolean;
          is_investor: boolean;
          updated_at: string | null;
          is_verified: boolean;
          current_org_id: number | null;
          current_org_position: string | null;
          first_name: string | null;
          last_name: string | null;
          handle: string | null;
          cover_photo_url: string | null;
          connections_count: number | null;
          email: unknown | null;
        };
        Insert: {
          user_id: string;
          profile_pic_url?: string | null;
          subtitle?: string | null;
          nominated_by_user_id?: string | null;
          about?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string | null;
          is_sponsor?: boolean;
          is_investor?: boolean;
          updated_at?: string | null;
          is_verified?: boolean;
          current_org_id?: number | null;
          current_org_position?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          handle?: string | null;
          cover_photo_url?: string | null;
          connections_count?: number | null;
          email?: unknown | null;
        };
        Update: {
          user_id?: string;
          profile_pic_url?: string | null;
          subtitle?: string | null;
          nominated_by_user_id?: string | null;
          about?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string | null;
          is_sponsor?: boolean;
          is_investor?: boolean;
          updated_at?: string | null;
          is_verified?: boolean;
          current_org_id?: number | null;
          current_org_position?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          handle?: string | null;
          cover_photo_url?: string | null;
          connections_count?: number | null;
          email?: unknown | null;
        };
      };
      deal_accesses: {
        Row: {
          id: number;
          deal_id: number;
          user_id: string;
          unique_share_link: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          user_id: string;
          unique_share_link: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          user_id?: string;
          unique_share_link?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      deal_shares: {
        Row: {
          id: number;
          deal_id: number;
          from_user_id: string;
          to_user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          deal_id: number;
          from_user_id: string;
          to_user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          deal_id?: number;
          from_user_id?: string;
          to_user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      invites: {
        Row: {
          id: number;
          on_deal_id: number | null;
          from_user_id: string;
          to_email: unknown;
          unique_share_link: string;
          on_user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
          is_accepted: boolean;
        };
        Insert: {
          id?: number;
          on_deal_id?: number | null;
          from_user_id: string;
          to_email: unknown;
          unique_share_link: string;
          on_user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_accepted?: boolean;
        };
        Update: {
          id?: number;
          on_deal_id?: number | null;
          from_user_id?: string;
          to_email?: unknown;
          unique_share_link?: string;
          on_user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_accepted?: boolean;
        };
      };
      connection_requests: {
        Row: {
          id: number;
          from_user_id: string;
          to_user_id: string;
          created_at: string | null;
          updated_at: string | null;
          is_seen: boolean;
        };
        Insert: {
          id?: number;
          from_user_id: string;
          to_user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
          is_seen?: boolean;
        };
        Update: {
          id?: number;
          from_user_id?: string;
          to_user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          is_seen?: boolean;
        };
      };
      waitlist_emails: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          email: unknown;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          email: unknown;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          email?: unknown;
        };
      };
      deals: {
        Row: {
          id: number;
          title: string | null;
          highlight_1_name: string | null;
          highlight_1_value: string | null;
          highlight_2_name: string | null;
          highlight_2_value: string | null;
          about: string | null;
          created_at: string | null;
          updated_at: string | null;
          is_active: boolean;
          interest_count: number | null;
          handle: string;
          launch_date: string | null;
          calendly_url: string | null;
          highlight_equity_raise: string | null;
          highlight_equity_raise_value: string | null;
          highlight_term: string | null;
          highlight_term_value: string | null;
          webinar_url: string | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          highlight_1_name?: string | null;
          highlight_1_value?: string | null;
          highlight_2_name?: string | null;
          highlight_2_value?: string | null;
          about?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_active?: boolean;
          interest_count?: number | null;
          handle: string;
          launch_date?: string | null;
          calendly_url?: string | null;
          highlight_equity_raise?: string | null;
          highlight_equity_raise_value?: string | null;
          highlight_term?: string | null;
          highlight_term_value?: string | null;
          webinar_url?: string | null;
        };
        Update: {
          id?: number;
          title?: string | null;
          highlight_1_name?: string | null;
          highlight_1_value?: string | null;
          highlight_2_name?: string | null;
          highlight_2_value?: string | null;
          about?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_active?: boolean;
          interest_count?: number | null;
          handle?: string;
          launch_date?: string | null;
          calendly_url?: string | null;
          highlight_equity_raise?: string | null;
          highlight_equity_raise_value?: string | null;
          highlight_term?: string | null;
          highlight_term_value?: string | null;
          webinar_url?: string | null;
        };
      };
      organizations: {
        Row: {
          id: number;
          profile_pic_url: string | null;
          name: string | null;
          about: string | null;
          linkedin_url: string | null;
          created_at: string | null;
          updated_at: string | null;
          cover_photo_url: string | null;
          headline: string | null;
          headquarters: string | null;
          email: string | null;
          website_url: string | null;
          instagram_url: string | null;
          twitter_url: string | null;
          handle: string;
          leadership_bio: string | null;
        };
        Insert: {
          id?: number;
          profile_pic_url?: string | null;
          name?: string | null;
          about?: string | null;
          linkedin_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          cover_photo_url?: string | null;
          headline?: string | null;
          headquarters?: string | null;
          email?: string | null;
          website_url?: string | null;
          instagram_url?: string | null;
          twitter_url?: string | null;
          handle: string;
          leadership_bio?: string | null;
        };
        Update: {
          id?: number;
          profile_pic_url?: string | null;
          name?: string | null;
          about?: string | null;
          linkedin_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          cover_photo_url?: string | null;
          headline?: string | null;
          headquarters?: string | null;
          email?: string | null;
          website_url?: string | null;
          instagram_url?: string | null;
          twitter_url?: string | null;
          handle?: string;
          leadership_bio?: string | null;
        };
      };
    };
    Views: {
      inbox_page_view: {
        Row: {
          user_id: string | null;
          all_conversations: Json | null;
        };
        Insert: {
          user_id?: string | null;
          all_conversations?: never;
        };
        Update: {
          user_id?: string | null;
          all_conversations?: never;
        };
      };
      deal_interest_level_view: {
        Row: {
          user_id: string | null;
          deal_id: number | null;
          expressed_interest: boolean | null;
          deal_view_count: number | null;
          attachments_received: Json | null;
          interest_level:
            | Database["public"]["Enums"]["deal_interest_level"]
            | null;
        };
      };
      friends_list_view: {
        Row: {
          from_user_id: string | null;
          to_user_id: string | null;
          profile_pic_url: string | null;
          first_name: string | null;
          last_name: string | null;
          handle: string | null;
          subtitle: string | null;
        };
      };
      autocomplete_users_view: {
        Row: {
          from_user_id: string | null;
          to_user_id: string | null;
          profile_pic_url: string | null;
          first_name: string | null;
          last_name: string | null;
          handle: string | null;
          subtitle: string | null;
        };
      };
      mutual_connections_view: {
        Row: {
          user_id: string | null;
          mutual_connections: Json | null;
        };
        Insert: {
          user_id?: string | null;
          mutual_connections?: never;
        };
        Update: {
          user_id?: string | null;
          mutual_connections?: never;
        };
      };
      inbox_conversation_view: {
        Row: {
          for_user_id: string | null;
          conversation_id: number | null;
          is_marked_done: boolean | null;
          title: string | null;
          users_in_conv: Json | null;
          all_messages: Json | null;
          all_conversation_changes: Json | null;
          all_deal_interest_levels: Json | null;
          all_attachments_in_convo: Json | null;
        };
      };
      search_users_view: {
        Row: {
          user_id: string | null;
          first_name: string | null;
          last_name: string | null;
          handle: string | null;
          profile_pic_url: string | null;
          subtitle: string | null;
          is_connected: boolean | null;
          num_mutuals: number | null;
          mutual_connections: Json | null;
        };
      };
      inbox_page_view_v2: {
        Row: {
          user_id: string | null;
          conversation_id: number | null;
          deal_id: number | null;
          is_marked_done: boolean | null;
          interest_level:
            | Database["public"]["Enums"]["deal_interest_level"]
            | null;
          deal_interest_level_breakdown: Json | null;
          expressed_interest: boolean | null;
          attachment_ids_in_convo: number[] | null;
          title: string | null;
          users_in_conv: Json | null;
          latest_message_user_id: string | null;
          latest_message_content: string | null;
          latest_message_sent_at: string | null;
          read_at_time: string | null;
          number_of_unread_messages: number | null;
        };
      };
      sponsor_deals_view: {
        Row: {
          user_id: string | null;
          deals: Json | null;
        };
        Insert: {
          user_id?: string | null;
          deals?: never;
        };
        Update: {
          user_id?: string | null;
          deals?: never;
        };
      };
      user_invite_limit_view: {
        Row: {
          user_id: string | null;
          invite_limit: number | null;
        };
        Insert: {
          user_id?: string | null;
          invite_limit?: never;
        };
        Update: {
          user_id?: string | null;
          invite_limit?: never;
        };
      };
      deal_dashboard_view: {
        Row: {
          user_id: string | null;
          deals: Json | null;
        };
        Insert: {
          user_id?: string | null;
          deals?: never;
        };
        Update: {
          user_id?: string | null;
          deals?: never;
        };
      };
      deal_share_view: {
        Row: {
          user_id: string | null;
          deal_title: string | null;
          deal_id: number | null;
          deal_handle: string | null;
          unique_share_link: string | null;
          suggested_share_users: Json | null;
          shared_with: Json | null;
          invites_outstanding: Json | null;
          invites_left: number | null;
        };
      };
      deal_analytics_view: {
        Row: {
          id: number | null;
          data: Json | null;
        };
        Insert: {
          id?: number | null;
          data?: never;
        };
        Update: {
          id?: number | null;
          data?: never;
        };
      };
      profile_page_view: {
        Row: {
          user_id: string | null;
          handle: string | null;
          profile_pic_url: string | null;
          cover_photo_url: string | null;
          first_name: string | null;
          last_name: string | null;
          is_verified: boolean | null;
          subtitle: string | null;
          is_sponsor: boolean | null;
          is_investor: boolean | null;
          current_org_id: number | null;
          current_org_position: string | null;
          current_org_profile_pic_url: string | null;
          current_org_name: string | null;
          created_at: string | null;
          nominated_by_user_id: string | null;
          nominated_by_user_profile_pic_url: string | null;
          nominated_by_user_first_name: string | null;
          nominated_by_user_last_name: string | null;
          nominated_by_user_handle: string | null;
          about: string | null;
          connections_count: number | null;
          mutual_connections: Json | null;
          linkedin_url: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          twitter_url: string | null;
          deals: Json | null;
          endorsements: Json | null;
          people_you_may_know: Json | null;
        };
      };
      notifications_view: {
        Row: {
          user_id: string | null;
          notifications: Json | null;
          connection_requests: Json | null;
        };
        Insert: {
          user_id?: string | null;
          notifications?: never;
          connection_requests?: never;
        };
        Update: {
          user_id?: string | null;
          notifications?: never;
          connection_requests?: never;
        };
      };
      organization_page_view: {
        Row: {
          id: number | null;
          handle: string | null;
          cover_photo_url: string | null;
          profile_pic_url: string | null;
          name: string | null;
          headline: string | null;
          headquarters: string | null;
          email: string | null;
          about: string | null;
          website_url: string | null;
          linkedin_url: string | null;
          instagram_url: string | null;
          twitter_url: string | null;
          leadership_bio: string | null;
          team_members: Json | null;
          deals: Json | null;
          team_members_you_may_know: Json | null;
        };
        Insert: {
          id?: number | null;
          handle?: string | null;
          cover_photo_url?: string | null;
          profile_pic_url?: string | null;
          name?: string | null;
          headline?: string | null;
          headquarters?: string | null;
          email?: string | null;
          about?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          twitter_url?: string | null;
          leadership_bio?: string | null;
          team_members?: never;
          deals?: never;
          team_members_you_may_know?: never;
        };
        Update: {
          id?: number | null;
          handle?: string | null;
          cover_photo_url?: string | null;
          profile_pic_url?: string | null;
          name?: string | null;
          headline?: string | null;
          headquarters?: string | null;
          email?: string | null;
          about?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          twitter_url?: string | null;
          leadership_bio?: string | null;
          team_members?: never;
          deals?: never;
          team_members_you_may_know?: never;
        };
      };
      deal_page_view: {
        Row: {
          id: number | null;
          title: string | null;
          highlight_1_name: string | null;
          highlight_1_value: string | null;
          highlight_2_name: string | null;
          highlight_2_value: string | null;
          highlight_term: string | null;
          highlight_term_value: string | null;
          highlight_equity_raise: string | null;
          highlight_equity_raise_value: string | null;
          handle: string | null;
          about: string | null;
          is_active: boolean | null;
          launch_date: string | null;
          webinar_url: string | null;
          calendly_url: string | null;
          deal_images: Json | null;
          deal_views: number | null;
          interest_count: number | null;
          connections_deal_interest: Json | null;
          deal_comments: Json | null;
          deal_faqs: Json | null;
          deal_sponsors: Json | null;
          referrer: Json | null;
          invites_left: number | null;
        };
      };
    };
    Functions: {
      citextin: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      citextout: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      citextrecv: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      citextsend: {
        Args: Record<string, unknown>;
        Returns: string;
      };
      citext:
        | {
            Args: Record<string, unknown>;
            Returns: unknown;
          }
        | {
            Args: Record<string, unknown>;
            Returns: unknown;
          }
        | {
            Args: Record<string, unknown>;
            Returns: unknown;
          };
      citext_eq: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_ne: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_lt: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_le: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_gt: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_ge: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_cmp: {
        Args: Record<string, unknown>;
        Returns: number;
      };
      citext_hash: {
        Args: Record<string, unknown>;
        Returns: number;
      };
      citext_smaller: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      citext_larger: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      min: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      max: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      texticlike:
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          }
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          };
      texticnlike:
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          }
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          };
      texticregexeq:
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          }
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          };
      texticregexne:
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          }
        | {
            Args: Record<string, unknown>;
            Returns: boolean;
          };
      regexp_match:
        | {
            Args: Record<string, unknown>;
            Returns: string[];
          }
        | {
            Args: Record<string, unknown>;
            Returns: string[];
          };
      regexp_matches:
        | {
            Args: Record<string, unknown>;
            Returns: string[];
          }
        | {
            Args: Record<string, unknown>;
            Returns: string[];
          };
      regexp_replace:
        | {
            Args: Record<string, unknown>;
            Returns: string;
          }
        | {
            Args: Record<string, unknown>;
            Returns: string;
          };
      regexp_split_to_array:
        | {
            Args: Record<string, unknown>;
            Returns: string[];
          }
        | {
            Args: Record<string, unknown>;
            Returns: string[];
          };
      regexp_split_to_table:
        | {
            Args: Record<string, unknown>;
            Returns: string;
          }
        | {
            Args: Record<string, unknown>;
            Returns: string;
          };
      strpos: {
        Args: Record<string, unknown>;
        Returns: number;
      };
      replace: {
        Args: Record<string, unknown>;
        Returns: string;
      };
      split_part: {
        Args: Record<string, unknown>;
        Returns: string;
      };
      translate: {
        Args: Record<string, unknown>;
        Returns: string;
      };
      citext_pattern_lt: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_pattern_le: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_pattern_gt: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_pattern_ge: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
      citext_pattern_cmp: {
        Args: Record<string, unknown>;
        Returns: number;
      };
      citext_hash_extended: {
        Args: Record<string, unknown>;
        Returns: number;
      };
    };
    Enums: {
      deal_comment_type: "ANNOUNCEMENT" | "FAQ";
      notification_type:
        | "LikedYourPost"
        | "PostedAComment"
        | "ExpressedInterestInYourDeal"
        | "HasAcceptedYourConnectionRequest"
        | "WroteYouAnEndorsement"
        | "AddedYouAsATeamMember"
        | "ReferredYouToANewDeal";
      deal_interest_level:
        | "NotInterested"
        | "SlightlyInterested"
        | "ModeratelyInterested"
        | "VeryInterested"
        | "NA";
    };
  };
}

