ALTER TABLE IF EXISTS public.deal_filenames
    DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.deal_attachments
    DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.deal_attachments
    ADD COLUMN size_in_bytes bigint NOT NULL;

ALTER TABLE IF EXISTS public.notifications
    DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.deal_filename_user_engagement_stats
    DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.conversation_changes
    DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.deal_to_sponsor_associations
    DISABLE ROW LEVEL SECURITY;

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
                     LEFT JOIN organizations org ON other_user.current_org_id = org.id
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
                    deal_attachments.storage_url AS attachment_url,
                    deal_attachments.attachment_type,
                    deal_attachments.size_in_bytes AS attachment_size_in_bytes,
                    deal_filenames.filename AS attachment_filename,
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
                     LEFT JOIN deal_attachments ON message.deal_attachment_id = deal_attachments.id
                     LEFT JOIN deal_filenames ON deal_filenames.id = deal_attachments.deal_filename_id
                  WHERE message.conversation_id = conv.id) all_messages) AS all_messages,
    ( SELECT json_agg(all_conversation_changes.*) AS all_conversation_changes
           FROM ( SELECT conversation_changes.id,
                    conversation_changes.created_at,
                    conversation_changes.updated_at,
                    conversation_changes.conversation_id,
                    conversation_changes.renamed_to,
                    conversation_changes.added_user_id,
                    conversation_changes.removed_user_id
                   FROM conversation_changes
                  WHERE conversation_changes.conversation_id = conv.id) all_conversation_changes) AS all_conversation_changes
   FROM conversations conv
     JOIN conversation_to_user_associations ON conversation_to_user_associations.conversation_id = conv.id
  ORDER BY conv.id;

