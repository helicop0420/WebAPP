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
           FROM ( SELECT user_profile.user_id,
                    user_profile.first_name,
                    user_profile.last_name,
                    user_profile.profile_pic_url,
                    user_profile.handle,
                    user_profile.subtitle
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
                    deal_to_sponsor_associations.order_index
                   FROM deal_to_sponsor_associations
                     JOIN sponsor_deals_view ON sponsor_deals_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN mutual_connections_view ON mutual_connections_view.user_id = deal_to_sponsor_associations.sponsor_id
                     JOIN user_profiles sponsor ON deal_to_sponsor_associations.sponsor_id = sponsor.user_id
                     LEFT JOIN organizations sponsor_org ON sponsor_org.id = sponsor.current_org_id
                  WHERE deal_to_sponsor_associations.deal_id = deal.id
                  ORDER BY deal_to_sponsor_associations.order_index) sponsors) AS deal_sponsors
   FROM deals deal;
GRANT ALL ON TABLE public.deal_page_view TO authenticated;
GRANT ALL ON TABLE public.deal_page_view TO postgres;
GRANT ALL ON TABLE public.deal_page_view TO anon;
GRANT ALL ON TABLE public.deal_page_view TO service_role;

