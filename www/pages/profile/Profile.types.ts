export interface Profile {
  username: string;
  fullname: string;
  photo: string;
  verified: boolean;
  tagline: string;
  about: string;
  tags: ("Sponsor" | "Investor")[];
  joined_on: number;
  nominated_by?: Profile;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedIn?: string;
  };
  career: {
    company: {
      logo: string;
      name: string;
    };
    position: string;
  };
}

export interface Project {
  status: "Active" | "Closed";
  title: string;
  description: string;
  interested: number;
  thumbnail: string;
}

export interface Endorsement {
  name: string;
  timestamp: string;
  detail: string;
  image_src: string;
  additional_investments: {
    investor_type: string;
    investment_details: string;
  };
}
