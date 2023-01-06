-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE OR REPLACE VIEW public.sponsor_deals_view
 AS
 SELECT user_profile.user_id,
    ( SELECT json_agg(projects.*) AS json_agg
           FROM ( SELECT deal.id,
                    deal.title,
                    deal.about,
                    deal.is_active,
                    ( SELECT deal_image.image_url
                           FROM deal_images deal_image
                          WHERE deal.id = deal_image.deal_id
                          ORDER BY deal_image.order_index, deal_image.created_at
                         LIMIT 1) AS deal_image,
                    deal.interest_count
                   FROM deal_to_sponsor_associations dtsa
                     JOIN deals deal ON dtsa.deal_id = deal.id
                  WHERE dtsa.sponsor_id = user_profile.user_id) projects) AS deals
   FROM user_profiles user_profile;

ALTER TABLE public.sponsor_deals_view
    OWNER TO supabase_admin;

DROP VIEW IF EXISTS public.deal_page_view;
DROP VIEW IF EXISTS public.profile_page_view;
DROP VIEW IF EXISTS public.sponsor_projects_view;

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
    ( SELECT json_agg(sponsors.*) AS json_agg
           FROM ( SELECT sponsor.first_name,
                    sponsor.last_name,
                    sponsor.handle,
                    sponsor.subtitle,
                    sponsor.profile_pic_url,
                    sponsor_deals_view.deals,
                    mutual_connections_view.mutual_connections
                   FROM deal_to_sponsor_associations
                     JOIN sponsor_deals_view ON sponsor_deals_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN mutual_connections_view ON mutual_connections_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN user_profiles sponsor ON deal_to_sponsor_associations.sponsor_id = sponsor.user_id
                  WHERE deal_to_sponsor_associations.deal_id = deal.id) sponsors) AS deal_sponsors
   FROM deals deal;
ALTER TABLE public.deal_page_view
    OWNER TO supabase_admin;

CREATE OR REPLACE VIEW public.profile_page_view
    AS
     SELECT user_profile.user_id,
    user_profile.handle,
    user_profile.profile_pic_url,
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
                    endorsement.text
                   FROM endorsements endorsement
                     JOIN user_profiles endorsing_user ON endorsement.author_user_id = endorsing_user.user_id
                  WHERE endorsement.to_user_id = user_profile.user_id) endorsements) AS endorsements
   FROM user_profiles user_profile
     JOIN organizations org ON user_profile.current_org_id = org.id
     JOIN user_profiles nominated_by_user_profile ON user_profile.nominated_by_user_id = nominated_by_user_profile.user_id
     JOIN sponsor_deals_view ON sponsor_deals_view.user_id = user_profile.user_id
     JOIN mutual_connections_view ON mutual_connections_view.user_id = user_profile.user_id;
