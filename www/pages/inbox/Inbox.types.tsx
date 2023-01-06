import { ParsedUrlQuery } from "querystring";

export interface IndividualChatProps {
  profile: {
    username: string;
    first_name: string;
    last_name: string;
    photo: string;
    verified: boolean;
    career: {
      company: string;
      position: string;
    };
  };
  query?: ParsedUrlQuery;
}

export interface DateDividerProps {
  date: number | string;
}

export interface ChatLog {
  conversation_id: number;
  first_name: string; //will be replaced by user_id
  last_name: string;
  participants: string[];
  image_src: string;
  date: number | string;
  occupation: string;
  company: string;
  status: string;
  unread_messages: number;
  is_read: boolean;
  last_sent_sender: string;
  last_sent_message: string;
  conversation_name: string;
  is_done: boolean;
  tagged_deal: string;
}

export interface Message {
  conversation_id: number;
  user_id: string;
  content: string;
  timestamp: number | string;
  is_read: boolean;
  attachment_id: {
    title: string;
    about: string;
    image: string;
    attachment_url: string;
    attachment_type: string;
    clicks_count: string;
  };
}
