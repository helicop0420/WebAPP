CREATE TYPE public.deal_interest_level AS ENUM
    ('NotInterested', 'SlightlyInterested', 'ModeratelyInterested', 'VeryInterested', 'NA');

ALTER TYPE public.deal_interest_level
    OWNER TO postgres;

CREATE OR REPLACE VIEW public.deal_interest_level_view
 AS
 SELECT deal_user_engagement.user_id,
    deal_user_engagement.deal_id,
    deal_user_engagement.expressed_interest,
    deal_user_engagement.deal_view_count,
    deal_user_engagement.attachments_received,
        CASE
            WHEN deal_user_engagement.deal_view_count > 5 AND json_array_length(deal_user_engagement.attachments_received) > 0 THEN 'VeryInterested'::deal_interest_level
            WHEN deal_user_engagement.deal_view_count > 1 OR json_array_length(deal_user_engagement.attachments_received) > 0 THEN 'ModeratelyInterested'::deal_interest_level
            ELSE 'SlightlyInterested'::deal_interest_level
        END AS interest_level
   FROM ( SELECT user_profile.user_id,
            deal.id AS deal_id,
            (EXISTS ( SELECT deal_interest.id
                   FROM deal_interest
                  WHERE deal_interest.deal_id = deal.id AND deal_interest.user_id = user_profile.user_id)) AS expressed_interest,
            ( SELECT count(*) AS count
                   FROM deal_views
                  WHERE deal_views.deal_id = deal.id AND deal_views.user_id = user_profile.user_id) AS deal_view_count,
            ( SELECT json_agg(attachment_ids_in_convo.*) AS attachment_ids_in_convo
                   FROM ( SELECT deal_attachments.id,
                            deal_filenames.filename
                           FROM deal_attachments
                             JOIN messages ON messages.deal_attachment_id = deal_attachments.id
                             JOIN deal_filenames ON deal_filenames.id = deal_attachments.deal_filename_id
                             JOIN conversation_to_user_associations ON conversation_to_user_associations.conversation_id = messages.conversation_id
                          WHERE conversation_to_user_associations.user_id = user_profile.user_id AND deal_filenames.deal_id = deal.id) attachment_ids_in_convo) AS attachments_received
           FROM user_profiles user_profile
             CROSS JOIN deals deal) deal_user_engagement;

ALTER TABLE public.deal_interest_level_view
    OWNER TO postgres;

GRANT ALL ON TABLE public.deal_interest_level_view TO authenticated;
GRANT ALL ON TABLE public.deal_interest_level_view TO postgres;
GRANT ALL ON TABLE public.deal_interest_level_view TO anon;
GRANT ALL ON TABLE public.deal_interest_level_view TO service_role;

-- Changing the columns in a view requires dropping and re-creating the view.
-- This may fail if other objects are dependent upon this view,
-- or may cause procedural functions to fail if they are not modified to
-- take account of the changes.
DROP VIEW public.inbox_page_view_v2;
CREATE OR REPLACE VIEW public.inbox_page_view_v2
    AS
     SELECT user_profile.user_id,
    conv.id AS conversation_id,
    deal.id AS deal_id,
    conv.is_marked_done,
    deal_interest_level_view.interest_level,
    row_to_json(deal_interest_level_view.*) AS deal_interest_level_breakdown,
    (EXISTS ( SELECT deal_interest.id
           FROM deal_interest
          WHERE deal_interest.deal_id = deal.id AND deal_interest.user_id = user_profile.user_id)) AS expressed_interest,
    ( SELECT json_agg(attachment_ids_in_convo.*) AS attachment_ids_in_convo
           FROM ( SELECT deal_attachments.id
                   FROM messages message
                     JOIN deal_attachments ON deal_attachments.id = message.deal_attachment_id
                  WHERE message.conversation_id = conv.id) attachment_ids_in_convo) AS attachment_ids_in_convo,
    conv.title,
    ( SELECT json_agg(chat_users.*) AS json_agg
           FROM ( SELECT other_user.user_id,
                    other_user.profile_pic_url,
                    other_user.handle,
                    org.name AS current_org_name,
                    other_user.current_org_position,
                    other_user.first_name,
                    other_user.last_name
                   FROM conversation_to_user_associations ctua
                     JOIN user_profiles other_user ON ctua.user_id = other_user.user_id
                     LEFT JOIN organizations org ON other_user.current_org_id = org.id
                  WHERE ctua.conversation_id = conv.id AND user_profile.user_id <> other_user.user_id) chat_users) AS users_in_conv,
    latest_message.user_id AS latest_message_user_id,
    latest_message.content AS latest_message_content,
    latest_message.created_at AS latest_message_sent_at,
    latest_message_read_receipt.created_at AS read_at_time,
    ( SELECT count(*) AS count
           FROM messages unread_message
          WHERE unread_message.conversation_id = conv.id AND NOT (unread_message.id IN ( SELECT read_message.id
                   FROM messages read_message
                     JOIN message_read_receipts ON message_read_receipts.message_id = read_message.id
                  WHERE message_read_receipts.user_id = user_profile.user_id))) AS number_of_unread_messages
   FROM conversations conv
     JOIN conversation_to_user_associations conv_users ON conv_users.conversation_id = conv.id
     JOIN user_profiles user_profile ON conv_users.user_id = user_profile.user_id
     LEFT JOIN ( SELECT DISTINCT ON (latest_message_1.conversation_id) latest_message_1.id,
            latest_message_1.created_at,
            latest_message_1.updated_at,
            latest_message_1.conversation_id,
            latest_message_1.content,
            latest_message_1.user_id,
            latest_message_1.on_deal_id,
            latest_message_1.nudged_time
           FROM messages latest_message_1
          ORDER BY latest_message_1.conversation_id, latest_message_1.created_at DESC) latest_message ON conv.id = latest_message.conversation_id
     LEFT JOIN message_read_receipts latest_message_read_receipt ON latest_message.id = latest_message_read_receipt.message_id
     CROSS JOIN deals deal
     LEFT JOIN deal_interest_level_view ON deal.id = deal_interest_level_view.deal_id AND user_profile.user_id = deal_interest_level_view.user_id
  WHERE conv_users.user_id = user_profile.user_id
  ORDER BY user_profile.user_id, latest_message.created_at DESC;
GRANT ALL ON TABLE public.inbox_page_view_v2 TO authenticated;
GRANT ALL ON TABLE public.inbox_page_view_v2 TO postgres;
GRANT ALL ON TABLE public.inbox_page_view_v2 TO anon;
GRANT ALL ON TABLE public.inbox_page_view_v2 TO service_role;

DROP VIEW public.deal_analytics_view;
CREATE OR REPLACE VIEW public.deal_analytics_view
    AS
     SELECT deal.id,
    ( SELECT json_agg(data.*) AS data
           FROM ( SELECT user_profile.user_id,
                    user_profile.first_name,
                    user_profile.last_name,
                    user_profile.profile_pic_url,
                    user_profile.handle,
                    deal_interest_level_view.interest_level,
                    row_to_json(deal_interest_level_view.*) AS deal_interest_level_breakdown,
                    (EXISTS ( SELECT deal_interest.id
                           FROM deal_interest
                          WHERE deal_interest.user_id = user_profile.user_id AND deal_interest.deal_id = deal.id)) AS expressed_interest,
                    ( SELECT count(*) AS count
                           FROM deal_views
                          WHERE deal_views.deal_id = deal.id AND deal_views.user_id = user_profile.user_id) AS view_count,
                    user_profile.user_id AS referred_by_user_id,
                    user_profile.first_name AS referred_by_first_name,
                    user_profile.last_name AS referred_by_last_name,
                    user_profile.profile_pic_url AS referred_by_profile_pic_url,
                    user_profile.handle AS referred_by_handle,
                    private_note.note AS team_notes,
                    private_note_last_edited_user.user_id AS private_note_last_edited_user_id,
                    private_note_last_edited_user.first_name AS private_note_last_edited_user_first_name,
                    private_note_last_edited_user.last_name AS private_note_last_edited_user_last_name,
                    private_note_last_edited_user.profile_pic_url AS private_note_last_edited_user_profile_pic_url,
                    private_note_last_edited_user.handle AS private_note_last_edited_user_handle
                   FROM user_profiles user_profile
                     LEFT JOIN private_notes private_note ON private_note.deal_id = deal.id AND private_note.user_id = user_profile.user_id
                     LEFT JOIN user_profiles private_note_last_edited_user ON private_note.last_edit_by_user_id = private_note_last_edited_user.user_id
                     LEFT JOIN deal_interest_level_view ON deal.id = deal_interest_level_view.deal_id AND user_profile.user_id = deal_interest_level_view.user_id) data) AS data
   FROM deals deal;