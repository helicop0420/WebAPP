CREATE OR REPLACE VIEW public.sponsor_projects_view
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

DROP VIEW public.profile_page_view;
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
    user_profile.connections_count,
    mutual_connections_view.mutual_connections,
    user_profile.work_family_connections_count,
    user_profile.linkedin_url,
    user_profile.facebook_url,
    user_profile.instagram_url,
    user_profile.twitter_url,
    sponsor_projects_view.deals,
    ( SELECT json_agg(endorsements.*) AS json_agg
           FROM ( SELECT endorsing_user.profile_pic_url AS endorsing_user_profile_pic_url,
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
     JOIN sponsor_projects_view ON sponsor_projects_view.user_id = user_profile.user_id
     JOIN mutual_connections_view ON mutual_connections_view.user_id = user_profile.user_id;
ALTER TABLE public.profile_page_view
    OWNER TO supabase_admin;

