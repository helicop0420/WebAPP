ALTER TABLE IF EXISTS public.deals
    ADD COLUMN launch_date date;

CREATE OR REPLACE VIEW public.deal_dashboard_view
 AS
 SELECT user_profiles.user_id,
    ( SELECT json_agg(deals.*) AS json_agg
           FROM ( SELECT deals_1.id,
                    deals_1.handle,
                    deals_1.launch_date,
                    deals_1.title,
                    deals_1.is_active,
                    ( SELECT json_agg(other_sponsors.*) AS json_agg
                           FROM ( SELECT sponsor.user_id,
                                    sponsor.handle,
                                    sponsor.profile_pic_url,
                                    sponsor.subtitle
                                   FROM sponsor_team_to_user_associations sttua
                                     JOIN user_profiles sponsor ON sttua.user_id = sponsor.user_id
                                  WHERE sttua.sponsor_team_id = sponsor_teams.id AND sponsor.user_id <> user_profiles.user_id) other_sponsors) AS other_sponsors
                   FROM sponsor_team_to_user_associations
                     JOIN sponsor_teams ON sponsor_team_to_user_associations.sponsor_team_id = sponsor_teams.id
                     JOIN deals deals_1 ON sponsor_teams.deal_id = deals_1.id
                  WHERE sponsor_team_to_user_associations.user_id = user_profiles.user_id) deals) AS deals
   FROM user_profiles;

ALTER TABLE public.deal_dashboard_view
    OWNER TO postgres;

GRANT ALL ON TABLE public.deal_dashboard_view TO authenticated;
GRANT ALL ON TABLE public.deal_dashboard_view TO postgres;
GRANT ALL ON TABLE public.deal_dashboard_view TO anon;
GRANT ALL ON TABLE public.deal_dashboard_view TO service_role;

