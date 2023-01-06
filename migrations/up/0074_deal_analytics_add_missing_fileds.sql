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
                    ( SELECT json_agg(all_attachment_stats.*) AS all_attachment_stats
                           FROM ( SELECT deal_filename.filename,
                                    (EXISTS ( SELECT 1
   FROM messages message_w_attachment
     JOIN deal_attachments ON message_w_attachment.deal_attachment_id = deal_attachments.id
     JOIN conversation_to_user_associations ctua ON ctua.conversation_id = message_w_attachment.conversation_id
  WHERE ctua.user_id = user_profile.user_id AND deal_attachments.deal_filename_id = deal_filename.id)) AS has_received,
                                    ( SELECT sum(das.view_count) AS sum
   FROM deal_attachment_stats das
     JOIN deal_attachments ON deal_attachments.id = das.deal_attachment_id
  WHERE deal_attachments.deal_filename_id = deal_filename.id AND das.user_id = user_profile.user_id) AS view_count
                                   FROM deal_filenames deal_filename
                                  WHERE deal_filename.deal_id = deal.id) all_attachment_stats) AS all_attachment_stats,
                    ( SELECT json_agg(referred_users.*) AS referred_users
                           FROM ( SELECT referred_user.user_id,
                                    referred_user.first_name,
                                    referred_user.last_name,
                                    referred_user.profile_pic_url,
                                    referred_user.subtitle,
                                    referred_user.handle
                                   FROM deal_shares deal_share
                                     JOIN user_profiles referred_user ON referred_user.user_id = deal_share.to_user_id
                                  WHERE deal_share.deal_id = deal.id AND deal_share.from_user_id = user_profile.user_id) referred_users) AS referred_users,
                    ( SELECT json_agg(referred_by_users.*) AS referred_by_users
                           FROM ( SELECT referred_by_user.user_id,
                                    referred_by_user.first_name,
                                    referred_by_user.last_name,
                                    referred_by_user.profile_pic_url,
                                    referred_by_user.handle,
                                    referred_by_user.subtitle,
                                    deal_share.created_at AS referred_at
                                   FROM deal_shares deal_share
                                     JOIN user_profiles referred_by_user ON referred_by_user.user_id = deal_share.from_user_id
                                  WHERE deal_share.deal_id = deal.id AND deal_share.to_user_id = user_profile.user_id) referred_by_users) AS referred_by_users,
                    private_note.note AS team_notes,
                    private_note.id AS private_note_id,
                    private_note.updated_at AS private_note_last_edited_at,
                    private_note_last_edited_user.user_id AS private_note_last_edited_user_id,
                    private_note_last_edited_user.first_name AS private_note_last_edited_user_first_name,
                    private_note_last_edited_user.last_name AS private_note_last_edited_user_last_name,
                    private_note_last_edited_user.profile_pic_url AS private_note_last_edited_user_profile_pic_url,
                    private_note_last_edited_user.handle AS private_note_last_edited_user_handle
                   FROM user_profiles user_profile
                     LEFT JOIN private_notes private_note ON private_note.deal_id = deal.id AND private_note.user_id = user_profile.user_id
                     LEFT JOIN user_profiles private_note_last_edited_user ON private_note.last_edit_by_user_id = private_note_last_edited_user.user_id
                     LEFT JOIN deal_interest_level_view ON deal.id = deal_interest_level_view.deal_id AND user_profile.user_id = deal_interest_level_view.user_id
                     JOIN deal_accesses ON deal_accesses.user_id = user_profile.user_id
                     LEFT JOIN deal_to_sponsor_associations ON deal_to_sponsor_associations.deal_id = deal.id AND deal_to_sponsor_associations.sponsor_id = user_profile.user_id
                  WHERE deal_accesses.deal_id = deal.id AND deal_to_sponsor_associations.id IS NULL) data) AS data
   FROM deals deal;

