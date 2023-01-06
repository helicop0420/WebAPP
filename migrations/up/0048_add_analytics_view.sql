ALTER TABLE IF EXISTS public.private_notes
    ADD COLUMN last_edit_by_user_id uuid;

ALTER TABLE IF EXISTS public.private_notes
    ADD CONSTRAINT private_notes_last_edit_by_user_id_fkey FOREIGN KEY (last_edit_by_user_id)
    REFERENCES auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

CREATE OR REPLACE VIEW public.deal_analytics_view
 AS
 SELECT deal.id,
    ( SELECT json_agg(data.*) AS data
           FROM ( SELECT user_profile.user_id,
                    user_profile.first_name,
                    user_profile.last_name,
                    user_profile.profile_pic_url,
                    user_profile.handle,
                    'VERY_INTERESTED'::text AS interest_level,
                    (EXISTS ( SELECT deal_interest.id
                           FROM deal_interest
                          WHERE deal_interest.user_id = user_profile.user_id AND deal_interest.deal_id = deal.id)) AS expressed_interest,
                    ( SELECT count(*) AS count
                           FROM deal_views
                          WHERE deal_views.deal_id = deal.id AND deal_views.user_id = user_profile.user_id) AS view_count,
                    user_profile.user_id AS referred_by_user_id,
                    user_profile.first_name AS referred_by_first_name,
                    user_profile.last_name AS referred_by_last_name,
                    user_profile.profile_pic_url AS referred_by_profile_pic_url,
                    user_profile.handle AS referred_by_handle,
                    private_note.note AS team_notes,
                    private_note_last_edited_user.user_id AS private_note_last_edited_user_id,
                    private_note_last_edited_user.first_name AS private_note_last_edited_user_first_name,
                    private_note_last_edited_user.last_name AS private_note_last_edited_user_last_name,
                    private_note_last_edited_user.profile_pic_url AS private_note_last_edited_user_profile_pic_url,
                    private_note_last_edited_user.handle AS private_note_last_edited_user_handle
                   FROM user_profiles user_profile
                     LEFT JOIN private_notes private_note ON private_note.deal_id = deal.id AND private_note.user_id = user_profile.user_id
                     LEFT JOIN user_profiles private_note_last_edited_user ON private_note.last_edit_by_user_id = private_note_last_edited_user.user_id) data) AS data
   FROM deals deal;

ALTER TABLE public.deal_analytics_view
    OWNER TO postgres;

GRANT ALL ON TABLE public.deal_analytics_view TO authenticated;
GRANT ALL ON TABLE public.deal_analytics_view TO postgres;
GRANT ALL ON TABLE public.deal_analytics_view TO anon;
GRANT ALL ON TABLE public.deal_analytics_view TO service_role;

