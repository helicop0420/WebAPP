ALTER TABLE IF EXISTS public.deal_comment_likes
    ADD CONSTRAINT deal_comment_likes_user_id_deal_comment_id_key UNIQUE (user_id, deal_comment_id);


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
                    deal.title AS attached_deal_title
                   FROM notifications notification
                     JOIN user_profiles from_user ON notification.from_user_id = from_user.user_id
                     LEFT JOIN organizations org ON org.id = notification.attached_org_id
                     LEFT JOIN deals deal ON deal.id = notification.attached_deal_id
                  WHERE notification.receiving_user_id = user_profile.user_id) all_notifs) AS notifications
   FROM user_profiles user_profile;

ALTER TABLE public.notifications_view
    OWNER TO postgres;

GRANT ALL ON TABLE public.notifications_view TO authenticated;
GRANT ALL ON TABLE public.notifications_view TO postgres;
GRANT ALL ON TABLE public.notifications_view TO anon;
GRANT ALL ON TABLE public.notifications_view TO service_role;

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
                    deal.created_at
                   FROM deals deal
                     JOIN deal_to_sponsor_associations ON deal_to_sponsor_associations.deal_id = deal.id
                     JOIN user_profiles sponsor_user_profile ON sponsor_user_profile.user_id = deal_to_sponsor_associations.sponsor_id
                  WHERE deal_to_sponsor_associations.sponsor_id = user_profile.user_id OR sponsor_user_profile.current_org_id IS NOT NULL AND sponsor_user_profile.current_org_id = user_profile.current_org_id) deals) AS deals
   FROM user_profiles user_profile;

