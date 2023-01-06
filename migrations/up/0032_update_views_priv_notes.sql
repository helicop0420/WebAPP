DROP VIEW public.profile_page_view;
CREATE OR REPLACE VIEW public.profile_page_view
    AS
     SELECT user_profile.user_id,
    user_profile.handle,
    user_profile.profile_pic_url,
    user_profile.cover_photo_url,
    user_profile.first_name,
    user_profile.last_name,
    user_profile.is_verified,
    user_profile.subtitle,
    user_profile.is_sponsor,
    user_profile.is_investor,
    user_profile.current_org_id,
    user_profile.current_org_position,
    org.profile_pic_url AS current_org_profile_pic_url,
    org.name AS current_org_name,
    user_profile.created_at,
    user_profile.nominated_by_user_id,
    nominated_by_user_profile.profile_pic_url AS nominated_by_user_profile_pic_url,
    nominated_by_user_profile.first_name AS nominated_by_user_first_name,
    nominated_by_user_profile.last_name AS nominated_by_user_last_name,
    nominated_by_user_profile.handle AS nominated_by_user_handle,
    user_profile.about,
    user_profile.connections_count,
    mutual_connections_view.mutual_connections,
    user_profile.work_family_connections_count,
    user_profile.linkedin_url,
    user_profile.facebook_url,
    user_profile.instagram_url,
    user_profile.twitter_url,
    sponsor_deals_view.deals,
    ( SELECT json_agg(endorsements.*) AS json_agg
           FROM ( SELECT endorsing_user.handle AS endorsing_user_handle,
                    endorsing_user.user_id AS endorsing_user_user_id,
                    endorsing_user.profile_pic_url AS endorsing_user_profile_pic_url,
                    endorsing_user.first_name AS endorsing_user_first_name,
                    endorsing_user.last_name AS endorsing_user_last_name,
                    endorsement.created_at,
                    endorsement.subtitle,
                    endorsement.text,
                    deal.title AS subtitle_deal_title
                   FROM endorsements endorsement
                     JOIN user_profiles endorsing_user ON endorsement.author_user_id = endorsing_user.user_id
                     LEFT JOIN deals deal ON endorsement.deal_id = deal.id
                  WHERE endorsement.to_user_id = user_profile.user_id) endorsements) AS endorsements
   FROM user_profiles user_profile
     JOIN organizations org ON user_profile.current_org_id = org.id
     JOIN user_profiles nominated_by_user_profile ON user_profile.nominated_by_user_id = nominated_by_user_profile.user_id
     JOIN sponsor_deals_view ON sponsor_deals_view.user_id = user_profile.user_id
     JOIN mutual_connections_view ON mutual_connections_view.user_id = user_profile.user_id;
GRANT ALL ON TABLE public.profile_page_view TO authenticated;
GRANT ALL ON TABLE public.profile_page_view TO postgres;
GRANT ALL ON TABLE public.profile_page_view TO anon;
GRANT ALL ON TABLE public.profile_page_view TO service_role;

DROP VIEW public.deal_page_view;
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
           FROM ( SELECT user_profile.user_id,
                    user_profile.first_name,
                    user_profile.last_name,
                    user_profile.profile_pic_url,
                    user_profile.handle
                   FROM deal_interest
                     JOIN user_profiles user_profile ON user_profile.user_id = deal_interest.user_id
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
                    ( SELECT json_agg(comment_likes.*) AS json_agg
                           FROM ( SELECT comment_like.user_id,
                                    liking_user.first_name,
                                    liking_user.last_name,
                                    liking_user.profile_pic_url,
                                    liking_user.handle
                                   FROM deal_comment_likes comment_like
                                     JOIN user_profiles liking_user ON comment_like.user_id = liking_user.user_id
                                  WHERE comment_like.deal_comment_id = comment.id) comment_likes) AS likes
                   FROM deal_comments comment
                     JOIN user_profiles commenting_user ON commenting_user.user_id = comment.user_id
                  WHERE comment.deal_id = deal.id) all_comments) AS deal_comments,
    ( SELECT json_agg(deal_sponsor_teams.*) AS json_agg
           FROM ( SELECT sponsor_team.id,
                    sponsor_team.leader_user_id,
                    sponsor_team.order_index,
                    ( SELECT json_agg(sponsors.*) AS json_agg
                           FROM ( SELECT sponsor.first_name,
                                    sponsor.last_name,
                                    sponsor.handle,
                                    sponsor.subtitle,
                                    sponsor.profile_pic_url,
                                    sponsor.current_org_position,
                                    sponsor_org.name AS current_org_name,
                                    sponsor_deals_view.deals,
                                    mutual_connections_view.mutual_connections,
                                    sponsor.work_family_connections_count,
                                    sponsor_team_to_user_association.order_index
                                   FROM sponsor_team_to_user_associations sponsor_team_to_user_association
                                     JOIN sponsor_deals_view ON sponsor_deals_view.user_id = sponsor_team_to_user_association.user_id
                                     JOIN mutual_connections_view ON mutual_connections_view.user_id = sponsor_team_to_user_association.user_id
                                     JOIN user_profiles sponsor ON sponsor_team_to_user_association.user_id = sponsor.user_id
                                     LEFT JOIN organizations sponsor_org ON sponsor_org.id = sponsor.current_org_id
                                  WHERE sponsor_team_to_user_association.sponsor_team_id = sponsor_team_to_user_association.sponsor_team_id
                                  ORDER BY sponsor_team_to_user_association.order_index) sponsors) AS sponsors
                   FROM sponsor_teams sponsor_team
                  WHERE sponsor_team.deal_id = deal.id
                  ORDER BY sponsor_team.order_index) deal_sponsor_teams) AS deal_sponsor_teams
   FROM deals deal;
