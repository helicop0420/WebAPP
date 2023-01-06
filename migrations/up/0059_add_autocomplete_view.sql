CREATE OR REPLACE VIEW public.autocomplete_users_view
 AS
 SELECT friends_list_view.from_user_id,
    friends_list_view.to_user_id,
    friends_list_view.profile_pic_url,
    friends_list_view.first_name,
    friends_list_view.last_name,
    friends_list_view.handle,
    friends_list_view.is_in_work_family,
    friends_list_view.subtitle
   FROM friends_list_view
UNION
 SELECT user_profiles.user_id AS from_user_id,
    user_profiles.user_id AS to_user_id,
    user_profiles.profile_pic_url,
    user_profiles.first_name,
    user_profiles.last_name,
    user_profiles.handle,
    NULL::boolean AS is_in_work_family,
    user_profiles.subtitle
   FROM user_profiles;

ALTER TABLE public.autocomplete_users_view
    OWNER TO postgres;

GRANT ALL ON TABLE public.autocomplete_users_view TO authenticated;
GRANT ALL ON TABLE public.autocomplete_users_view TO postgres;
GRANT ALL ON TABLE public.autocomplete_users_view TO anon;
GRANT ALL ON TABLE public.autocomplete_users_view TO service_role;

