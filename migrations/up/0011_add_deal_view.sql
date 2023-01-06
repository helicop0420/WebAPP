-- Need to drop these views first, because they already exist and the 2nd order view depends on the first order view.
DROP VIEW public.profile_page_view;
DROP VIEW public.friends_list_view;


-- 
-- 1st order views
-- 
CREATE OR REPLACE VIEW public.friends_list_view
    AS
     SELECT person.from_user_id,
    person.to_user_id,
    friend.profile_pic_url,
    friend.first_name,
    friend.last_name,
    friend.handle,
    person.is_in_work_family
   FROM ( SELECT connections.from_user_id,
            connections.to_user_id,
            connections.is_in_work_family
           FROM connections
        UNION
         SELECT connections.to_user_id,
            connections.from_user_id,
            connections.is_in_work_family
           FROM connections) person
     JOIN user_profiles friend ON person.to_user_id = friend.user_id;
ALTER TABLE public.friends_list_view
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.friends_list_view TO anon;
GRANT ALL ON TABLE public.friends_list_view TO postgres;
GRANT ALL ON TABLE public.friends_list_view TO supabase_admin;
GRANT ALL ON TABLE public.friends_list_view TO authenticated;
GRANT ALL ON TABLE public.friends_list_view TO service_role;

CREATE OR REPLACE VIEW public.mutual_connections_view
 AS
 SELECT user_profile.user_id,
    ( SELECT json_agg(mutual_connections.*) AS json_agg
           FROM ( SELECT your_friend.to_user_id AS user_id,
                    your_friend.handle,
                    your_friend.profile_pic_url,
                    your_friend.first_name,
                    your_friend.last_name,
                    their_friend.is_in_work_family AS is_in_their_work_family
                   FROM friends_list_view their_friend
                     JOIN friends_list_view your_friend ON their_friend.to_user_id = your_friend.to_user_id
                  WHERE their_friend.from_user_id = user_profile.user_id AND your_friend.from_user_id = auth.uid()) mutual_connections) AS mutual_connections
   FROM user_profiles user_profile;

ALTER TABLE public.mutual_connections_view
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.mutual_connections_view TO anon;
GRANT ALL ON TABLE public.mutual_connections_view TO postgres;
GRANT ALL ON TABLE public.mutual_connections_view TO supabase_admin;
GRANT ALL ON TABLE public.mutual_connections_view TO authenticated;
GRANT ALL ON TABLE public.mutual_connections_view TO service_role;


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
                    ( SELECT count(*) AS count
                           FROM deal_interest
                          WHERE deal_interest.deal_id = deal.id) AS deal_interest_count
                   FROM deal_to_sponsor_associations dtsa
                     JOIN deals deal ON dtsa.deal_id = deal.id
                  WHERE dtsa.sponsor_id = user_profile.user_id) projects) AS deals
   FROM user_profiles user_profile;

ALTER TABLE public.sponsor_projects_view
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.sponsor_projects_view TO anon;
GRANT ALL ON TABLE public.sponsor_projects_view TO postgres;
GRANT ALL ON TABLE public.sponsor_projects_view TO supabase_admin;
GRANT ALL ON TABLE public.sponsor_projects_view TO authenticated;
GRANT ALL ON TABLE public.sponsor_projects_view TO service_role;

-- 
-- 2nd order views
-- 
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
    ( SELECT count(*) AS count
           FROM deal_interest
          WHERE deal_interest.deal_id = deal.id) AS total_deal_interest,
    ( SELECT json_agg(cur_deal_interests.*) AS json_agg
           FROM ( SELECT deal_interest.id,
                    deal_interest.created_at,
                    deal_interest.updated_at,
                    deal_interest.deal_id,
                    deal_interest.user_id
                   FROM deal_interest
                  WHERE deal_interest.deal_id = deal.id) cur_deal_interests) AS connections_deal_interest,
    ( SELECT json_agg(all_comments.*) AS json_agg
           FROM ( SELECT deal_comments.id,
                    deal_comments.created_at,
                    deal_comments.updated_at,
                    deal_comments.user_id,
                    deal_comments.comment,
                    deal_comments.replying_to_comment_id,
                    deal_comments.deal_id,
                    deal_comments.type,
                    ( SELECT count(*) AS count
                           FROM deal_comment_likes
                          WHERE deal_comment_likes.deal_comment_id = deal_comments.id) AS num_likes,
                    ( SELECT json_agg(comment_likes.*) AS json_agg
                           FROM ( SELECT deal_comment_likes.id,
                                    deal_comment_likes.created_at,
                                    deal_comment_likes.updated_at,
                                    deal_comment_likes.user_id,
                                    deal_comment_likes.deal_comment_id
                                   FROM deal_comment_likes
                                  WHERE deal_comment_likes.deal_comment_id = deal_comments.id) comment_likes) AS likes
                   FROM deal_comments
                  WHERE deal_comments.deal_id = deal.id) all_comments) AS deal_comments,
    ( SELECT json_agg(sponsors.*) AS json_agg
           FROM ( SELECT sponsor.first_name,
                    sponsor.last_name,
                    sponsor.handle,
                    sponsor.subtitle,
                    sponsor.profile_pic_url,
                    sponsor_projects_view.deals,
                    mutual_connections_view.mutual_connections
                   FROM deal_to_sponsor_associations
                     JOIN sponsor_projects_view ON sponsor_projects_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN mutual_connections_view ON mutual_connections_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN user_profiles sponsor ON deal_to_sponsor_associations.sponsor_id = sponsor.user_id
                  WHERE deal_to_sponsor_associations.deal_id = deal.id) sponsors) AS deal_sponsors
   FROM deals deal;

ALTER TABLE public.deal_page_view
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.deal_page_view TO anon;
GRANT ALL ON TABLE public.deal_page_view TO postgres;
GRANT ALL ON TABLE public.deal_page_view TO supabase_admin;
GRANT ALL ON TABLE public.deal_page_view TO authenticated;
GRANT ALL ON TABLE public.deal_page_view TO service_role;

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
    ( SELECT count(*) AS count
           FROM friends_list_view friend
          WHERE friend.from_user_id = user_profile.user_id) AS number_of_connections,
    mutual_connections_view.mutual_connections,
    ( SELECT count(*) AS count
           FROM friends_list_view friend
          WHERE friend.from_user_id = user_profile.user_id AND friend.is_in_work_family = true) AS number_of_work_family_connections,
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

