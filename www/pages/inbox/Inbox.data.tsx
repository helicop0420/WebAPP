import { ChatLog, Message } from "./Inbox.types";

export const chat_log: ChatLog[] = [
  {
    conversation_id: 1,
    first_name: "Daniel", //will be replaced by user_id
    last_name: "Radcliffe",
    participants: ["user_id_1", "user_id_2"],
    image_src:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60.png", //will also be reaplced by participant profile pics
    date: Date.now(),
    occupation: "Seasoned Investor", //this and company will be replaced by participant info
    company: "Hogwards",
    status: "interest_expressed",
    unread_messages: 0,
    is_read: false,
    last_sent_sender: "You",
    last_sent_message:
      "Thanks for getting back to me! Would love to chat about the opportunity. Please send m...",
    conversation_name: "",
    is_done: false,
    tagged_deal: "",
  },
  {
    conversation_id: 2,
    first_name: "Benjamin", //will be replaced by user_id
    last_name: "Russel",
    participants: ["user_id_1", "user_id_2"],
    image_src:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60.png",
    date: "Jul 11 2022",
    occupation: "Chief Strategy Officer",
    company: "Blackstone",
    status: "closing",
    unread_messages: 0,
    is_read: true,
    last_sent_sender: "Benjamin",
    last_sent_message:
      "Hello I am interested to learn more about your property in downtown Austin! I wa...",
    conversation_name: "",
    is_done: false,
    tagged_deal: "",
  },
  {
    conversation_id: 3,
    first_name: "Shaun", //will be replaced by user_id
    last_name: "Vembutty",
    participants: ["user_id_1", "user_id_2"],
    image_src:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80.png",
    date: "Jun 6 2022",
    occupation: "President",
    company: "Ashton Gray Development",
    status: "invited",
    unread_messages: 2,
    is_read: false,
    last_sent_sender: "Shaun",
    last_sent_message:
      "I was referred to you by our mutual connection John. Would be interested to lea...",
    conversation_name: "",
    is_done: false,
    tagged_deal: "",
  },
  {
    conversation_id: 4,
    first_name: "Kristin", //will be replaced by user_id
    last_name: "Watson",
    participants: ["user_id_1", "user_id_2"],
    image_src:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    date: "Feb 22 2022",
    occupation: "Investor",
    company: "",
    status: "closing",
    unread_messages: 0,
    is_read: false,
    last_sent_sender: "You",
    last_sent_message:
      "I was referred to you by our mutual connection John. Would be interested to lea...",
    conversation_name: "",
    is_done: false,
    tagged_deal: "",
  },
];

export const profile = {
  username: "tester",
  first_name: "Benjamin",
  last_name: "Russel",
  photo:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80.png",
  verified: true,
  career: {
    company: "BlackStone",
    position: "Chief Strategy Officer",
  },
};

export const profile1 = {
  username: "tester",
  first_name: "Shaun",
  last_name: "Vembutty",
  photo:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80.png",
  verified: true,
  career: {
    company: "BlackStone",
    position: "Chief Strategy Officer",
  },
};

export const messages: Message[] = [
  {
    conversation_id: 1,
    user_id: "Benjamin Russell",
    content:
      "Hello, I am interested to learn more about your property in downtown Austin! I was wondering what risks are associated with this investment as we are headed toward a recession?",
    timestamp: Date.now(),
    is_read: true,
    attachment_id: {
      title: "78-Acre Commercial and Residential Development in Elgin, TX",
      about:
        "Ashton Gray Development is excited to present the opportunity to invest in the acquisition and entitlement (“Phase 1”) of approxima...",
      image: "/static/images/deal_page/deal_pic_1.png",
      attachment_url: "/deal",
      attachment_type: "",
      clicks_count: "",
    },
  },
  {
    conversation_id: 2,
    user_id: "Benjamin Russell",
    content:
      "Hello, I am interested to learn more about your property in downtown Austin! I was wondering what risks are associated with this investment as we are headed toward a recession?",
    timestamp: "July 26 2022",
    is_read: true,
    attachment_id: {
      title: "78-Acre Commercial and Residential Development in Elgin, TX",
      about:
        "Ashton Gray Development is excited to present the opportunity to invest in the acquisition and entitlement (“Phase 1”) of approxima...",
      image: "/static/images/deal_page/deal_pic_1.png",
      attachment_url: "/deal",
      attachment_type: "",
      clicks_count: "",
    },
  },
  {
    conversation_id: 3,
    user_id: "Benjamin Russell",
    content:
      "Hello, I am interested to learn more about your property in downtown Austin! I was wondering what risks are associated with this investment as we are headed toward a recession?",
    timestamp: "July 26 2022",
    is_read: true,
    attachment_id: {
      title: "78-Acre Commercial and Residential Development in Elgin, TX",
      about:
        "Ashton Gray Development is excited to present the opportunity to invest in the acquisition and entitlement (“Phase 1”) of approxima...",
      image: "/static/images/deal_page/deal_pic_1.png",
      attachment_url: "/deal",
      attachment_type: "",
      clicks_count: "",
    },
  },
  {
    conversation_id: 4,
    user_id: "Benjamin Russell",
    content:
      "Hello, I am interested to learn more about your property in downtown Austin! I was wondering what risks are associated with this investment as we are headed toward a recession?",
    timestamp: "July 20 2022",
    is_read: true,
    attachment_id: {
      title: "78-Acre Commercial and Residential Development in Elgin, TX",
      about:
        "Ashton Gray Development is excited to present the opportunity to invest in the acquisition and entitlement (“Phase 1”) of approxima...",
      image: "/static/images/deal_page/deal_pic_1.png",
      attachment_url: "/deal",
      attachment_type: "",
      clicks_count: "",
    },
  },
];
