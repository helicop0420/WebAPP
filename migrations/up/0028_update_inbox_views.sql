DROP VIEW public.inbox_conversation_view;
CREATE OR REPLACE VIEW public.inbox_conversation_view
    AS
     SELECT conversation_to_user_associations.user_id AS for_user_id,
    conv.id AS conversation_id,
    conv.is_marked_done,
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
                     JOIN organizations org ON other_user.current_org_id = org.id
                  WHERE ctua.conversation_id = conv.id AND conversation_to_user_associations.user_id <> other_user.user_id) chat_users) AS users_in_conv,
    ( SELECT json_agg(all_messages.*) AS all_messages
           FROM ( SELECT message.id,
                    message.user_id,
                    sender_user.first_name AS sender_user_first_name,
                    sender_user.last_name AS sender_user_last_name,
                    sender_user.handle AS sender_user_handle,
                    sender_user.profile_pic_url AS sender_user_profile_pic_url,
                    message.content,
                    message.created_at,
                    message.nudged_time,
                    message.on_deal_id,
                    deal.title AS deal_title,
                    deal.handle AS deal_handle,
                    deal.about AS deal_about,
                    ( SELECT deal_image.image_url
                           FROM deal_images deal_image
                          WHERE deal_image.deal_id = message.on_deal_id
                          ORDER BY deal_image.order_index
                         LIMIT 1) AS deal_image,
                    ( SELECT json_agg(all_read_receipts.*) AS json_agg
                           FROM ( SELECT mrr.created_at AS read_at,
                                    mrr.user_id AS read_by_user_id
                                   FROM message_read_receipts mrr
                                  WHERE mrr.message_id = message.id) all_read_receipts) AS all_read_receipts
                   FROM messages message
                     JOIN user_profiles sender_user ON sender_user.user_id = message.user_id
                     LEFT JOIN deals deal ON deal.id = message.on_deal_id
                  WHERE message.conversation_id = conv.id) all_messages) AS all_messages
   FROM conversations conv
     JOIN conversation_to_user_associations ON conversation_to_user_associations.conversation_id = conv.id
  ORDER BY conv.id;
ALTER TABLE public.inbox_conversation_view
    OWNER TO postgres;
GRANT ALL ON TABLE public.inbox_conversation_view TO anon;
GRANT ALL ON TABLE public.inbox_conversation_view TO postgres;
GRANT ALL ON TABLE public.inbox_conversation_view TO supabase_admin;
GRANT ALL ON TABLE public.inbox_conversation_view TO authenticated;
GRANT ALL ON TABLE public.inbox_conversation_view TO service_role;

REVOKE ALL ON TABLE public.inbox_conversation_view FROM anon;
REVOKE ALL ON TABLE public.inbox_conversation_view FROM postgres;
REVOKE ALL ON TABLE public.inbox_conversation_view FROM supabase_admin;
REVOKE ALL ON TABLE public.inbox_conversation_view FROM authenticated;
REVOKE ALL ON TABLE public.inbox_conversation_view FROM service_role;
GRANT ALL ON TABLE public.inbox_conversation_view TO authenticated;

GRANT ALL ON TABLE public.inbox_conversation_view TO postgres;

GRANT ALL ON TABLE public.inbox_conversation_view TO anon;

GRANT ALL ON TABLE public.inbox_conversation_view TO service_role;

-- Changing the columns in a view requires dropping and re-creating the view.
-- This may fail if other objects are dependent upon this view,
-- or may cause procedural functions to fail if they are not modified to
-- take account of the changes.
DROP VIEW public.inbox_page_view;
CREATE OR REPLACE VIEW public.inbox_page_view
    AS
     SELECT user_profile.user_id,
    ( SELECT json_agg(all_conversations.*) AS json_agg
           FROM ( SELECT conv.id AS conversation_id,
                    conv.is_marked_done,
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
                                     JOIN organizations org ON other_user.current_org_id = org.id
                                  WHERE ctua.conversation_id = conv.id AND user_profile.user_id <> other_user.user_id) chat_users) AS users_in_conv,
                    latest_message.user_id AS latest_message_user_id,
                    latest_message.content AS latest_message_content,
                    latest_message.created_at AS latest_message_sent_at,
                    latest_message.read_at_time IS NOT NULL AS latest_message_is_read
                   FROM conversations conv
                     JOIN conversation_to_user_associations conv_users ON conv_users.conversation_id = conv.id
                     LEFT JOIN ( SELECT message.id,
                            message.content,
                            message.conversation_id,
                            message.created_at,
                            message.user_id,
                            latest_message_user.handle AS user_handle,
                            latest_message_user.profile_pic_url AS user_profile_pic_url,
                            read_receipt.created_at AS read_at_time
                           FROM ( SELECT DISTINCT ON (message_1.conversation_id) message_1.id,
                                    message_1.created_at,
                                    message_1.updated_at,
                                    message_1.conversation_id,
                                    message_1.content,
                                    message_1.user_id,
                                    message_1.on_deal_id,
                                    message_1.nudged_time
                                   FROM messages message_1
                                  ORDER BY message_1.conversation_id, message_1.created_at DESC) message
                             JOIN user_profiles latest_message_user ON message.user_id = latest_message_user.user_id
                             LEFT JOIN message_read_receipts read_receipt ON message.id = read_receipt.message_id AND read_receipt.user_id = message.user_id) latest_message ON conv.id = latest_message.conversation_id
                  WHERE conv_users.user_id = user_profile.user_id
                  ORDER BY conv.id) all_conversations) AS all_conversations
   FROM user_profiles user_profile;
ALTER TABLE public.inbox_page_view
    OWNER TO postgres;
GRANT ALL ON TABLE public.inbox_page_view TO anon;
GRANT ALL ON TABLE public.inbox_page_view TO postgres;
GRANT ALL ON TABLE public.inbox_page_view TO supabase_admin;
GRANT ALL ON TABLE public.inbox_page_view TO authenticated;
GRANT ALL ON TABLE public.inbox_page_view TO service_role;

REVOKE ALL ON TABLE public.inbox_page_view FROM anon;
REVOKE ALL ON TABLE public.inbox_page_view FROM postgres;
REVOKE ALL ON TABLE public.inbox_page_view FROM supabase_admin;
REVOKE ALL ON TABLE public.inbox_page_view FROM authenticated;
REVOKE ALL ON TABLE public.inbox_page_view FROM service_role;
GRANT ALL ON TABLE public.inbox_page_view TO authenticated;

GRANT ALL ON TABLE public.inbox_page_view TO postgres;

GRANT ALL ON TABLE public.inbox_page_view TO anon;

GRANT ALL ON TABLE public.inbox_page_view TO service_role;

