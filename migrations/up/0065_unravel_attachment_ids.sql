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
    ( SELECT array_agg(deal_attachments.id) AS array_agg
           FROM messages message
             JOIN deal_attachments ON deal_attachments.id = message.deal_attachment_id
          WHERE message.conversation_id = conv.id) AS attachment_ids_in_convo,
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

