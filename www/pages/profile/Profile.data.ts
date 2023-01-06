import { Endorsement, Profile, Project } from "./Profile.types";

// TODO: Remove this function once data fetch is implemented
export default function testProfileData(): {
  profile: Profile;
  connections: {
    total: number;
    sample: Profile[];
  };
  projects: Project[];
  endorsements: Endorsement[];
  mutual_connections: {
    total: number;
    sample: Profile[];
  };
} {
  const profile: Profile = {
    username: "tester",
    fullname: "Shaun Vembutty",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    tagline:
      "Founding President at Ashton Gray Development and SVAG Investments",
    tags: ["Sponsor", "Investor"],
    about:
      "Achievement-driven, Communications and Marketing expert with over 20 years of outstanding experience in all phases of corporate communications. Built content sharing partnership with major media networks. Extensive knowledge of writing and editing for technical and non-technical, digital, and social media. Adept with high-pressure situations. Holds a master’s degree in Communication and Journalism and a master’s degree in Political Science. Enthusiastic community worker with leadership experience.",
    verified: true,
    joined_on: Date.now(),
    social: {
      facebook: "tester",
      instagram: "tester",
      linkedIn: "tester",
      twitter: "tester",
    },
    career: {
      company: {
        name: "Ashton Gray Development",
        logo: "/test_company.png",
      },
      position: "President",
    },
  };

  profile.nominated_by = { ...profile };

  const active_projects: Project[] = [
    {
      title: "78-Acre Commercial & Residential Development in Elgin, TX",
      description:
        "An opportunity to invest in the acquisition and entitlement (“Phase 1”) of approximately 76 acres of land located at 18401 US 290, Elgin, Texas, only 25 minutes from downtown Austin.",
      interested: 20,
      status: "Active",
      thumbnail: "/static/images/profile_page/project_pic_1.png",
    },
  ];

  const closed_projects: Project[] = [
    {
      title: "339-Acre Single Family Lots Development in Leander, TX",
      description:
        "An opportunity to invest in the vertical development of 173 single family lots in the Oakwood Hills district in Leander, TX.",
      interested: 43,
      status: "Closed",
      thumbnail: "/static/images/profile_page/project_pic_2.png",
    },
    {
      title: "10-Acre Senior Living Community in Richmond, TX",
      description:
        "Taj Residences: Located on 10 acres in Aliana, a senior living community in Richmond, TX, which includes 68 single family homes and a clubhouse.",
      interested: 39,
      status: "Closed",
      thumbnail: "/static/images/profile_page/project_pic_3.png",
    },
  ];

  const endorsements: Endorsement[] = [
    {
      name: "Ajay Sohmshetty",
      timestamp: "March 16, 2022",
      image_src:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      detail:
        "Shaun and his team at Ashton Gray are some of the best to work with. They’re absolute professionals who not only go above and beyond in the dilligence process to only put forth the best investment opportunites, but they are also a pleasure to discuss with and always helpful.",
      additional_investments: {
        investor_type: "investor",
        investment_details: "10-Acre Senior Living Community in Richmond, TX",
      },
    },
    {
      name: "Emily Selman",
      timestamp: "July 16, 2021",
      image_src:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      detail:
        "Shaun is the best I’ve ever worked with. He’s efficient, communicative, and he and his team do an excellent job with doing their due dilligence on deals. If you are able to get allocation for any of his deals, go for it!",
      additional_investments: {
        investor_type: "co-sponsor",
        investment_details:
          "339-Acre Single Family Lots Development in Leander, TX",
      },
    },
  ];
  return {
    profile,
    endorsements,
    connections: {
      total: 593,
      sample: Array(10).fill(profile),
    },
    mutual_connections: {
      total: 31,
      sample: Array(10).fill(profile),
    },
    projects: [...active_projects, ...closed_projects],
  };
}
