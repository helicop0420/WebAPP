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
     LEFT JOIN organizations org ON user_profile.current_org_id = org.id
     LEFT JOIN user_profiles nominated_by_user_profile ON user_profile.nominated_by_user_id = nominated_by_user_profile.user_id
     LEFT JOIN sponsor_deals_view ON sponsor_deals_view.user_id = user_profile.user_id
     LEFT JOIN mutual_connections_view ON mutual_connections_view.user_id = user_profile.user_id;