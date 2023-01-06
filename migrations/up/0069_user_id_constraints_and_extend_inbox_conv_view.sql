ALTER TABLE IF EXISTS public.deal_comments DROP CONSTRAINT IF EXISTS deal_comments_user_id_fkey;

ALTER TABLE IF EXISTS public.deal_comments
    ADD CONSTRAINT deal_comments_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.deal_to_sponsor_associations DROP CONSTRAINT IF EXISTS deal_to_sponsor_associations_sponsor_id_fkey;

ALTER TABLE IF EXISTS public.deal_to_sponsor_associations
    ADD CONSTRAINT deal_to_sponsor_associations_sponsor_id_fk FOREIGN KEY (sponsor_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.private_notes DROP CONSTRAINT IF EXISTS private_notes_last_edit_by_user_id_fkey;

ALTER TABLE IF EXISTS public.private_notes DROP CONSTRAINT IF EXISTS private_notes_user_id_fkey;

ALTER TABLE IF EXISTS public.private_notes
    ADD CONSTRAINT private_notes_last_edit_by_user_id_fk FOREIGN KEY (last_edit_by_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.private_notes
    ADD CONSTRAINT private_notes_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.notifications DROP CONSTRAINT IF EXISTS notifications_from_user_id_fkey;

ALTER TABLE IF EXISTS public.notifications DROP CONSTRAINT IF EXISTS notifications_receiving_user_id_fkey;

ALTER TABLE IF EXISTS public.notifications
    ADD CONSTRAINT notifications_from_user_id_fk FOREIGN KEY (from_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.notifications
    ADD CONSTRAINT notifications_receiving_user_id_fk FOREIGN KEY (receiving_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_nominated_by_user_id_fkey;

ALTER TABLE IF EXISTS public.user_profiles
    ADD CONSTRAINT user_profiles_nominated_by_user_id_fk FOREIGN KEY (nominated_by_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.endorsements DROP CONSTRAINT IF EXISTS endorsements_author_user_id_fkey;

ALTER TABLE IF EXISTS public.endorsements DROP CONSTRAINT IF EXISTS endorsements_to_user_id_fkey;

ALTER TABLE IF EXISTS public.endorsements
    ADD CONSTRAINT endorsements_author_user_id_fk FOREIGN KEY (author_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.endorsements
    ADD CONSTRAINT endorsements_to_user_id_fk FOREIGN KEY (to_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.deal_comment_likes DROP CONSTRAINT IF EXISTS deal_comment_likes_user_id_fkey;

ALTER TABLE IF EXISTS public.deal_comment_likes
    ADD CONSTRAINT deal_comment_likes_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.deal_views DROP CONSTRAINT IF EXISTS deal_views_user_id_fkey;

ALTER TABLE IF EXISTS public.deal_views
    ADD CONSTRAINT deal_views_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.connections DROP CONSTRAINT IF EXISTS connections_from_user_id_fkey;

ALTER TABLE IF EXISTS public.connections DROP CONSTRAINT IF EXISTS connections_to_user_id_fkey;

ALTER TABLE IF EXISTS public.connections
    ADD CONSTRAINT connections_from_user_id_fk FOREIGN KEY (from_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.connections
    ADD CONSTRAINT connections_to_user_id_fk FOREIGN KEY (to_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.conversation_to_user_associations DROP CONSTRAINT IF EXISTS conversation_to_user_associations_user_id_fkey;

ALTER TABLE IF EXISTS public.conversation_to_user_associations
    ADD CONSTRAINT conversation_to_user_associations_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.conversation_changes DROP CONSTRAINT IF EXISTS conversation_changes_added_user_id_fkey;

ALTER TABLE IF EXISTS public.conversation_changes DROP CONSTRAINT IF EXISTS conversation_changes_removed_user_id_fkey;

ALTER TABLE IF EXISTS public.conversation_changes
    ADD CONSTRAINT conversation_changes_added_user_id_fk FOREIGN KEY (added_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.conversation_changes
    ADD CONSTRAINT conversation_changes_removed_user_id_fk FOREIGN KEY (removed_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.relationships DROP CONSTRAINT IF EXISTS relationships_author_user_id_fkey;

ALTER TABLE IF EXISTS public.relationships DROP CONSTRAINT IF EXISTS relationships_on_user_id_fkey;

ALTER TABLE IF EXISTS public.relationships
    ADD CONSTRAINT relationships_author_user_id_fk FOREIGN KEY (author_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.relationships
    ADD CONSTRAINT relationships_on_user_id_fk FOREIGN KEY (on_user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_user_id_fkey;

ALTER TABLE IF EXISTS public.messages
    ADD CONSTRAINT messages_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.deal_interest DROP CONSTRAINT IF EXISTS deal_interest_user_id_fkey;

ALTER TABLE IF EXISTS public.deal_interest
    ADD CONSTRAINT deal_interest_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.message_read_receipts DROP CONSTRAINT IF EXISTS message_read_receipts_user_id_fkey;

ALTER TABLE IF EXISTS public.message_read_receipts
    ADD CONSTRAINT message_read_receipts_user_id_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

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
                    deal_attachments.total_num_pages AS attachment_total_num_pages,
                    deal_filenames.filename AS attachment_filename,
                    ( SELECT json_agg(attachment_stats.*) AS attachment_stats
                           FROM ( SELECT deal_attachment_stats.user_id,
                                    stats_for_user.first_name,
                                    stats_for_user.last_name,
                                    stats_for_user.handle,
                                    stats_for_user.profile_pic_url,
                                    deal_attachment_stats.updated_at AS last_seen_at,
                                    deal_attachment_stats.progress,
                                    deal_attachment_stats.view_count
                                   FROM deal_attachment_stats
                                     JOIN user_profiles stats_for_user ON deal_attachment_stats.user_id = stats_for_user.user_id
                                  WHERE deal_attachment_stats.deal_attachment_id = deal_attachments.id AND deal_attachment_stats.user_id <> conversation_to_user_associations.user_id) attachment_stats) AS attachment_stats,
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
                    conversation_changes.removed_user_id,
                    removed_user.first_name AS removed_user_first_name,
                    removed_user.last_name AS removed_user_last_name,
                    removed_user.handle AS removed_user_handle
                   FROM conversation_changes
                     LEFT JOIN user_profiles removed_user ON conversation_changes.removed_user_id = removed_user.user_id
                  WHERE conversation_changes.conversation_id = conv.id) all_conversation_changes) AS all_conversation_changes,
    ( SELECT json_agg(all_deal_interest_levels.*) AS all_deal_interest_levels
           FROM ( SELECT deal_interest_level_view.user_id,
                    deal_interest_level_view.deal_id,
                    deal_interest_level_view.expressed_interest,
                    deal_interest_level_view.deal_view_count,
                    deal_interest_level_view.attachments_received,
                    deal_interest_level_view.interest_level
                   FROM deal_interest_level_view
                  WHERE deal_interest_level_view.user_id = conversation_to_user_associations.user_id) all_deal_interest_levels) AS all_deal_interest_levels,
    ( SELECT json_agg(all_attachments_in_convo.*) AS all_attachments_in_convo
           FROM ( SELECT msg.id AS message_id,
                    df.filename,
                    df.deal_id
                   FROM messages msg
                     JOIN deal_attachments da ON msg.deal_attachment_id = da.id
                     JOIN deal_filenames df ON da.deal_filename_id = df.id
                  WHERE msg.conversation_id = conv.id) all_attachments_in_convo) AS all_attachments_in_convo
   FROM conversations conv
     JOIN conversation_to_user_associations ON conversation_to_user_associations.conversation_id = conv.id
  ORDER BY conv.id;

DROP TABLE IF EXISTS public.deal_filename_user_engagement_stats CASCADE;