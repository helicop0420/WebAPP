CREATE OR REPLACE VIEW public.inbox_page_view
    AS
     SELECT user_profile.user_id,
    ( SELECT json_agg(all_conversations.*) AS json_agg
           FROM ( SELECT conv.id AS conversation_id,
                    conv.is_marked_done,
                    conv.title,
                    ( SELECT json_agg(chat_users.*) AS json_agg
                           FROM ( SELECT other_user.user_id,
                                    other_user.profile_pic_url,
                                    other_user.handle,
                                    org.name AS current_org_name,
                                    other_user.current_org_position,
                                    other_user.first_name,
                                    other_user.last_name
                                   FROM conversation_to_user_associations ctua
                                     JOIN user_profiles other_user ON ctua.user_id = other_user.user_id
                                     LEFT JOIN organizations org ON other_user.current_org_id = org.id
                                  WHERE ctua.conversation_id = conv.id AND user_profile.user_id <> other_user.user_id) chat_users) AS users_in_conv,
                    latest_message.user_id AS latest_message_user_id,
                    latest_message.content AS latest_message_content,
                    latest_message.created_at AS latest_message_sent_at,
                    ( SELECT count(*) AS count
                           FROM messages unread_message
                          WHERE unread_message.conversation_id = conv.id AND NOT (unread_message.id IN ( SELECT read_message.id
                                   FROM messages read_message
                                     JOIN message_read_receipts ON message_read_receipts.message_id = read_message.id
                                  WHERE message_read_receipts.user_id = user_profile.user_id))) AS number_of_unread_messages
                   FROM conversations conv
                     JOIN conversation_to_user_associations conv_users ON conv_users.conversation_id = conv.id
                     LEFT JOIN ( SELECT message.id,
                            message.content,
                            message.conversation_id,
                            message.created_at,
                            message.user_id,
                            latest_message_user.handle AS user_handle,
                            latest_message_user.profile_pic_url AS user_profile_pic_url,
                            read_receipt.created_at AS read_at_time
                           FROM ( SELECT DISTINCT ON (message_1.conversation_id) message_1.id,
                                    message_1.created_at,
                                    message_1.updated_at,
                                    message_1.conversation_id,
                                    message_1.content,
                                    message_1.user_id,
                                    message_1.on_deal_id,
                                    message_1.nudged_time
                                   FROM messages message_1
                                  ORDER BY message_1.conversation_id, message_1.created_at DESC) message
                             JOIN user_profiles latest_message_user ON message.user_id = latest_message_user.user_id
                             LEFT JOIN message_read_receipts read_receipt ON message.id = read_receipt.message_id AND read_receipt.user_id = user_profile.user_id) latest_message ON conv.id = latest_message.conversation_id
                  WHERE conv_users.user_id = user_profile.user_id
                  ORDER BY latest_message.created_at) all_conversations) AS all_conversations
   FROM user_profiles user_profile;

CREATE OR REPLACE VIEW public.friends_list_view
    AS
     SELECT person.from_user_id,
    person.to_user_id,
    friend.profile_pic_url,
    friend.first_name,
    friend.last_name,
    friend.handle,
    person.is_in_work_family,
    friend.subtitle
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

