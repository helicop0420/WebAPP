CREATE OR REPLACE FUNCTION public.generate_deal_access_for_sponsor_team()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
begin
  insert into public.deal_accesses(user_id, deal_id) 
    select 
      team_member.user_id, new.deal_id as deal_id
    from organization_to_user_associations otua
    join organization_to_user_associations team_member on team_member.org_id = otua.org_id
    where otua.user_id = new.sponsor_id 
  on conflict do nothing;
  return new;
end;
$BODY$;

ALTER FUNCTION public.generate_deal_access_for_sponsor_team()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.generate_deal_access_for_sponsor_team() TO authenticated;

GRANT EXECUTE ON FUNCTION public.generate_deal_access_for_sponsor_team() TO postgres;

GRANT EXECUTE ON FUNCTION public.generate_deal_access_for_sponsor_team() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.generate_deal_access_for_sponsor_team() TO anon;

GRANT EXECUTE ON FUNCTION public.generate_deal_access_for_sponsor_team() TO service_role;

CREATE OR REPLACE FUNCTION public.generate_deal_access()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
begin
  IF EXISTS (SELECT 1 FROM public.deal_accesses WHERE user_id=new.to_user_id and deal_id=new.deal_id) THEN
    return new;
  ELSE
    insert into public.deal_accesses (user_id, deal_id)
    values (new.to_user_id, new.deal_id);
    return new;  
  END IF;
end;
$BODY$;

ALTER FUNCTION public.generate_deal_access()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.generate_deal_access() TO authenticated;

GRANT EXECUTE ON FUNCTION public.generate_deal_access() TO postgres;

GRANT EXECUTE ON FUNCTION public.generate_deal_access() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.generate_deal_access() TO anon;

GRANT EXECUTE ON FUNCTION public.generate_deal_access() TO service_role;

CREATE TRIGGER deal_accesses_generate
    BEFORE INSERT
    ON public.deal_shares
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_deal_access();

CREATE TRIGGER deal_accesses_generate_from_deal_to_sponsor_associations
    BEFORE INSERT
    ON public.deal_to_sponsor_associations
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_deal_access_for_sponsor_team();

CREATE OR REPLACE VIEW public.deal_share_view
 AS
 SELECT user_profile.user_id,
    deal.title AS deal_title,
    deal.id AS deal_id,
    deal.handle AS deal_handle,
    deal_access.unique_share_link,
    ( SELECT json_agg(suggested_share_users.*) AS suggested_share_users
           FROM ( SELECT friends_list_view.to_user_id,
                    friends_list_view.handle,
                    friends_list_view.first_name,
                    friends_list_view.last_name,
                    friends_list_view.profile_pic_url,
                    friends_list_view.subtitle
                   FROM friends_list_view
                     LEFT JOIN deal_shares deal_share ON deal_share.deal_id = deal.id AND deal_share.from_user_id = user_profile.user_id AND deal_share.to_user_id = friends_list_view.to_user_id
                     LEFT JOIN deal_to_sponsor_associations dtsa ON dtsa.deal_id = deal.id AND dtsa.sponsor_id = friends_list_view.to_user_id
                  WHERE friends_list_view.from_user_id = user_profile.user_id AND deal_share.id IS NULL AND dtsa.id IS NULL
                 LIMIT 20) suggested_share_users) AS suggested_share_users,
    ( SELECT json_agg(shared_with.*) AS shared_with
           FROM ( SELECT deal_share.created_at AS shared_at,
                    shared_user.user_id,
                    shared_user.handle,
                    shared_user.first_name,
                    shared_user.last_name,
                    shared_user.profile_pic_url,
                    shared_user.subtitle,
                    deal_view.created_at AS deal_viewed_at,
                    di.created_at AS expressed_interest_at
                   FROM deal_shares deal_share
                     JOIN user_profiles shared_user ON shared_user.user_id = deal_share.to_user_id
                     LEFT JOIN deal_views deal_view ON deal_view.deal_id = deal.id AND deal_view.user_id = shared_user.user_id
                     LEFT JOIN deal_interest di ON di.deal_id = deal.id AND di.user_id = shared_user.user_id
                  WHERE deal_share.deal_id = deal.id AND deal_share.from_user_id = user_profile.user_id) shared_with) AS shared_with,
    ( SELECT json_agg(invites_outstanding.*) AS invites_outstanding
           FROM ( SELECT invite.to_email
                   FROM invites invite
                  WHERE invite.on_deal_id = deal.id AND invite.from_user_id = user_profile.user_id AND invite.is_accepted = false) invites_outstanding) AS invites_outstanding
   FROM user_profiles user_profile
     JOIN deal_accesses deal_access ON deal_access.user_id = user_profile.user_id
     LEFT JOIN deals deal ON deal.id = deal_access.deal_id;

ALTER TABLE public.deal_share_view
    OWNER TO postgres;

GRANT ALL ON TABLE public.deal_share_view TO authenticated;
GRANT ALL ON TABLE public.deal_share_view TO postgres;
GRANT ALL ON TABLE public.deal_share_view TO anon;
GRANT ALL ON TABLE public.deal_share_view TO service_role;

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
     LEFT JOIN deal_accesses deal_access ON deal_access.user_id = user_profile.user_id
     LEFT JOIN deals deal ON deal_access.deal_id = deal.id
     LEFT JOIN deal_interest_level_view ON deal.id = deal_interest_level_view.deal_id AND user_profile.user_id = deal_interest_level_view.user_id
  WHERE conv_users.user_id = user_profile.user_id
  ORDER BY user_profile.user_id, latest_message.created_at DESC;

CREATE OR REPLACE VIEW public.notifications_view
    AS
     SELECT user_profile.user_id,
    ( SELECT json_agg(all_notifs.*) AS all_notifs
           FROM ( SELECT notification.id,
                    notification.created_at,
                    notification.updated_at,
                    notification.receiving_user_id,
                    notification.from_user_id,
                    notification.is_seen,
                    notification.debug_info,
                    notification.attached_deal_id,
                    notification.attached_org_id,
                    notification.notification_type,
                    from_user.first_name,
                    from_user.last_name,
                    from_user.handle,
                    from_user.profile_pic_url,
                    org.name AS attached_org_name,
                    org.profile_pic_url AS attached_org_profile_pic_url,
                    deal.handle AS attached_deal_handle,
                    deal.title AS attached_deal_title,
                    deal_access.unique_share_link
                   FROM notifications notification
                     JOIN user_profiles from_user ON notification.from_user_id = from_user.user_id
                     LEFT JOIN organizations org ON org.id = notification.attached_org_id
                     LEFT JOIN deals deal ON deal.id = notification.attached_deal_id
                     LEFT JOIN deal_accesses deal_access ON deal_access.deal_id = deal.id AND deal_access.user_id = user_profile.user_id
                  WHERE notification.receiving_user_id = user_profile.user_id) all_notifs) AS notifications
   FROM user_profiles user_profile;

CREATE OR REPLACE VIEW public.deal_page_view
    AS
     SELECT deal.id,
    deal.title,
    deal.highlight_1_name,
    deal.highlight_1_value,
    deal.highlight_2_name,
    deal.highlight_2_value,
    deal.highlight_3_name,
    deal.highlight_3_value,
    deal.highlight_4_name,
    deal.highlight_4_value,
    deal.handle,
    deal.about,
    deal.is_active,
    deal.launch_date,
    ( SELECT json_agg(cur_deal_images.*) AS json_agg
           FROM ( SELECT deal_image.id,
                    deal_image.created_at,
                    deal_image.updated_at,
                    deal_image.deal_id,
                    deal_image.image_url,
                    deal_image.order_index
                   FROM deal_images deal_image
                  WHERE deal_image.deal_id = deal.id) cur_deal_images) AS deal_images,
    ( SELECT count(*) AS count
           FROM deal_views
          WHERE deal_views.deal_id = deal.id) AS deal_views,
    deal.interest_count,
    ( SELECT json_agg(cur_deal_interests.*) AS json_agg
           FROM ( SELECT interested_user.user_id,
                    interested_user.first_name,
                    interested_user.last_name,
                    interested_user.profile_pic_url,
                    interested_user.handle,
                    interested_user.subtitle
                   FROM deal_interest
                     JOIN user_profiles interested_user ON interested_user.user_id = deal_interest.user_id
                  WHERE deal_interest.deal_id = deal.id) cur_deal_interests) AS connections_deal_interest,
    ( SELECT json_agg(all_comments.*) AS json_agg
           FROM ( SELECT comment.id,
                    comment.created_at,
                    comment.updated_at,
                    comment.user_id,
                    commenting_user.handle,
                    commenting_user.first_name,
                    commenting_user.last_name,
                    commenting_user.profile_pic_url,
                    comment.comment,
                    comment.replying_to_comment_id,
                    comment.type,
                    comment.likes_count,
                    comment.is_private,
                    ( SELECT json_agg(comment_likes.*) AS json_agg
                           FROM ( SELECT comment_like.user_id,
                                    liking_user.first_name,
                                    liking_user.last_name,
                                    liking_user.profile_pic_url,
                                    liking_user.handle,
                                    liking_user.subtitle
                                   FROM deal_comment_likes comment_like
                                     JOIN user_profiles liking_user ON comment_like.user_id = liking_user.user_id
                                  WHERE comment_like.deal_comment_id = comment.id) comment_likes) AS likes
                   FROM deal_comments comment
                     JOIN user_profiles commenting_user ON commenting_user.user_id = comment.user_id
                  WHERE comment.deal_id = deal.id) all_comments) AS deal_comments,
    ( SELECT json_agg(deal_faqs.*) AS deal_faqs
           FROM ( SELECT faq.id,
                    faq.created_at,
                    faq.updated_at,
                    faq.question,
                    faq.answer
                   FROM deal_faqs faq
                  WHERE faq.deal_id = deal.id) deal_faqs) AS deal_faqs,
    ( SELECT json_agg(sponsors.*) AS json_agg
           FROM ( SELECT sponsor.user_id,
                    sponsor.first_name,
                    sponsor.last_name,
                    sponsor.handle,
                    sponsor.subtitle,
                    sponsor.profile_pic_url,
                    sponsor.current_org_position,
                    sponsor_org.name AS current_org_name,
                    sponsor_deals_view.deals,
                    mutual_connections_view.mutual_connections,
                    deal_to_sponsor_associations.order_index,
                    deal_to_sponsor_associations.id AS deal_to_sponsor_association_id,
                    ( SELECT json_agg(org_members.*) AS org_members
                           FROM ( SELECT org_member.user_id,
                                    org_member.first_name,
                                    org_member.last_name,
                                    org_member.profile_pic_url,
                                    org_member.handle,
                                    org_member.current_org_position
                                   FROM user_profiles org_member
                                  WHERE org_member.current_org_id = sponsor.current_org_id AND org_member.user_id <> sponsor.user_id) org_members) AS org_members
                   FROM deal_to_sponsor_associations
                     JOIN sponsor_deals_view ON sponsor_deals_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN mutual_connections_view ON mutual_connections_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN user_profiles sponsor ON deal_to_sponsor_associations.sponsor_id = sponsor.user_id
                     LEFT JOIN organizations sponsor_org ON sponsor_org.id = sponsor.current_org_id
                  WHERE deal_to_sponsor_associations.deal_id = deal.id
                  ORDER BY deal_to_sponsor_associations.order_index) sponsors) AS deal_sponsors,
    ( SELECT json_agg(referrer.*) AS referrer
           FROM ( SELECT referrer_1.first_name,
                    referrer_1.last_name,
                    referrer_1.profile_pic_url,
                    referrer_1.handle
                   FROM user_profiles referrer_1
                     JOIN deal_shares deal_share ON deal_share.to_user_id = auth.uid() AND deal_share.deal_id = deal.id) referrer) AS referrer
   FROM deals deal;

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
                                    (EXISTS ( SELECT message_w_attachment.id,
    message_w_attachment.created_at,
    message_w_attachment.updated_at,
    message_w_attachment.conversation_id,
    message_w_attachment.content,
    message_w_attachment.user_id,
    message_w_attachment.on_deal_id,
    message_w_attachment.nudged_time,
    message_w_attachment.deal_attachment_id,
    deal_attachments.id,
    deal_attachments.created_at,
    deal_attachments.updated_at,
    deal_attachments.deal_filename_id,
    deal_attachments.storage_url,
    deal_attachments.attachment_type,
    deal_attachments.size_in_bytes,
    deal_attachments.total_num_pages,
    ctua.id,
    ctua.created_at,
    ctua.updated_at,
    ctua.user_id,
    ctua.conversation_id
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
                                    deal_share.created_at AS referred_at
                                   FROM deal_shares deal_share
                                     JOIN user_profiles referred_by_user ON referred_by_user.user_id = deal_share.from_user_id
                                  WHERE deal_share.deal_id = deal.id AND deal_share.to_user_id = user_profile.user_id) referred_by_users) AS referred_by_users,
                    private_note.note AS team_notes,
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

CREATE OR REPLACE VIEW public.sponsor_deals_view
    AS
     SELECT user_profile.user_id,
    ( SELECT json_agg(deals.*) AS json_agg
           FROM ( SELECT deal.id,
                    deal.title,
                    deal.about,
                    deal.is_active,
                    deal.handle,
                    ( SELECT deal_image.image_url
                           FROM deal_images deal_image
                          WHERE deal.id = deal_image.deal_id
                          ORDER BY deal_image.order_index, deal_image.created_at
                         LIMIT 1) AS deal_image,
                    deal.interest_count,
                    ( SELECT dtsa.sponsor_id
                           FROM deal_to_sponsor_associations dtsa
                          WHERE dtsa.deal_id = deal.id
                          ORDER BY dtsa.order_index
                         LIMIT 1) AS leader_user_id,
                    deal.created_at,
                    deal_access.unique_share_link
                   FROM deals deal
                     JOIN deal_to_sponsor_associations ON deal_to_sponsor_associations.deal_id = deal.id
                     LEFT JOIN deal_accesses deal_access ON deal_access.deal_id = deal.id AND deal_access.user_id = user_profile.user_id
                     JOIN user_profiles sponsor_user_profile ON sponsor_user_profile.user_id = deal_to_sponsor_associations.sponsor_id
                  WHERE deal_to_sponsor_associations.sponsor_id = user_profile.user_id OR sponsor_user_profile.current_org_id IS NOT NULL AND sponsor_user_profile.current_org_id = user_profile.current_org_id) deals) AS deals
   FROM user_profiles user_profile;

CREATE OR REPLACE VIEW public.deal_dashboard_view
    AS
     SELECT user_profiles.user_id,
    ( SELECT json_agg(deals.*) AS json_agg
           FROM ( SELECT deal.id,
                    deal.handle,
                    deal.launch_date,
                    deal.title,
                    deal.is_active,
                    ( SELECT json_agg(sponsors.*) AS sponsors
                           FROM ( SELECT sponsor.user_id,
                                    sponsor.handle,
                                    sponsor.profile_pic_url,
                                    sponsor.subtitle,
                                    sponsor.first_name,
                                    sponsor.last_name
                                   FROM deal_to_sponsor_associations dtsa
                                     JOIN user_profiles sponsor ON dtsa.sponsor_id = sponsor.user_id
                                  WHERE dtsa.deal_id = deal.id) sponsors) AS sponsors,
                    deal_to_sponsor_associations.* IS NOT NULL AS is_sponsor,
                    deal_accesses.id AS another_id,
                    deal_accesses.unique_share_link AS deal_unique_share_link
                   FROM deals deal
                     LEFT JOIN deal_to_sponsor_associations ON deal_to_sponsor_associations.deal_id = deal.id AND deal_to_sponsor_associations.sponsor_id = user_profiles.user_id
                     JOIN deal_accesses ON deal.id = deal_accesses.deal_id AND deal_accesses.user_id = user_profiles.user_id) deals) AS deals
   FROM user_profiles;

CREATE OR REPLACE VIEW public.organization_page_view
    AS
     SELECT org.id,
    org.handle,
    org.cover_photo_url,
    org.profile_pic_url,
    org.name,
    org.headline,
    org.headquarters,
    org.email,
    org.about,
    org.website_url,
    org.linkedin_url,
    org.instagram_url,
    org.twitter_url,
    ( SELECT json_agg(team_members.*) AS team_members
           FROM ( SELECT otua.is_current,
                    otua.is_leadership,
                    otua.job_title,
                    otua.order_index,
                    team_member.user_id AS team_member_user_id,
                    team_member.handle AS team_member_handle,
                    team_member.profile_pic_url AS team_member_profile_pic_url,
                    team_member.first_name AS team_member_first_name,
                    team_member.last_name AS team_member_last_name,
                    team_member.subtitle AS team_member_subtitle,
                    team_member.twitter_url AS team_member_twitter_url,
                    team_member.linkedin_url AS team_member_linkedin_url,
                    team_member.connections_count AS team_member_connections_count,
                    mutual_connections_view.mutual_connections AS team_member_mutual_connections,
                    (EXISTS ( SELECT connections.id,
                            connections.created_at,
                            connections.updated_at,
                            connections.from_user_id,
                            connections.to_user_id
                           FROM connections
                          WHERE connections.from_user_id = auth.uid() AND connections.to_user_id = team_member.user_id OR connections.from_user_id = team_member.user_id AND connections.to_user_id = auth.uid())) AS team_member_is_connected
                   FROM organization_to_user_associations otua
                     JOIN user_profiles team_member ON team_member.user_id = otua.user_id
                     JOIN mutual_connections_view ON mutual_connections_view.user_id = team_member.user_id
                  WHERE otua.org_id = org.id) team_members) AS team_members,
    ( SELECT json_agg(deals.*) AS json_agg
           FROM ( SELECT deal.id,
                    deal.title,
                    deal.about,
                    deal.is_active,
                    deal.handle,
                    ( SELECT deal_image.image_url
                           FROM deal_images deal_image
                          WHERE deal.id = deal_image.deal_id
                          ORDER BY deal_image.order_index, deal_image.created_at
                         LIMIT 1) AS deal_image,
                    deal.interest_count,
                    ( SELECT dtsa.sponsor_id
                           FROM deal_to_sponsor_associations dtsa
                          WHERE dtsa.deal_id = deal.id
                          ORDER BY dtsa.order_index
                         LIMIT 1) AS leader_user_id,
                    deal.created_at,
                    deal_access.unique_share_link
                   FROM deals deal
                     JOIN deal_to_sponsor_associations ON deal_to_sponsor_associations.deal_id = deal.id
                     LEFT JOIN deal_accesses deal_access ON deal_access.deal_id = deal.id AND deal_access.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN organization_to_user_associations ON organization_to_user_associations.user_id = deal_to_sponsor_associations.sponsor_id
                  WHERE organization_to_user_associations.org_id = org.id) deals) AS deals,
    ( SELECT json_agg(team_members_you_may_know.*) AS team_members_you_may_know
           FROM ( SELECT team_member_you_may_know.user_id,
                    team_member_you_may_know.first_name,
                    team_member_you_may_know.last_name,
                    team_member_you_may_know.handle,
                    team_member_you_may_know.profile_pic_url,
                    team_member_you_may_know.subtitle,
                    team_member_you_may_know.is_connected,
                    team_member_you_may_know.num_mutuals,
                    team_member_you_may_know.mutual_connections
                   FROM search_users_view team_member_you_may_know
                     JOIN organization_to_user_associations ON organization_to_user_associations.user_id = team_member_you_may_know.user_id
                  WHERE organization_to_user_associations.org_id = org.id AND team_member_you_may_know.is_connected = false AND team_member_you_may_know.user_id <> auth.uid()
                  ORDER BY team_member_you_may_know.num_mutuals DESC) team_members_you_may_know) AS team_members_you_may_know
   FROM organizations org;

