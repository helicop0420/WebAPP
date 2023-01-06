import { serverDb, serverSupabase } from "api/modules/server_supabase";
import { UserProfile } from "types/tables";
import { handleError } from "./seed_utils";

const [testUserEmailId, testUserEmailDomain] = String(
  process.env.TEST_USER_EMAIL
).split("@");

export const primaryUser: UserProfile["Insert"] = {
  first_name: String(process.env.TEST_USER_FULLNAME).split(" ")[0],
  last_name: String(process.env.TEST_USER_FULLNAME).split(" ")[1],
  email: process.env.TEST_USER_EMAIL,
  is_verified: false,
  profile_pic_url:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  cover_photo_url:
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2592&q=80",
  user_id: "", // set dynamically below
  handle: "me",
  about:
    "I'm excited about getting involved in real estate. My strengths are in logical thinking, computer science, and leadership. I’m particularly excited about contributing to the success of the team and playing a key role in taking innovative products to market.",
  subtitle: "Investor",
};

export const nisha: UserProfile["Insert"] = {
  first_name: "Nisha",
  last_name: "Ghosh",
  email: `${testUserEmailId}+nisha@${testUserEmailDomain}`,
  is_verified: false,
  profile_pic_url:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  cover_photo_url:
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2592&q=80",
  user_id: "", // set dynamically below
  handle: "nisha",
  about:
    "I'm excited about getting involved in real estate. My strengths are in logical thinking, computer science, and leadership. I’m particularly excited about contributing to the success of the team and playing a key role in taking innovative products to market.",
  subtitle: "Relationship Manager",
};

export const emily: UserProfile["Insert"] = {
  first_name: "Emily",
  last_name: "Selman",
  email: `${testUserEmailId}+emily@${testUserEmailDomain}`,
  is_verified: false,
  profile_pic_url:
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  cover_photo_url:
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2592&q=80",
  user_id: "", // set dynamically below
  handle: "emily",
  about:
    "I'm excited about getting involved in real estate. My strengths are in logical thinking, computer science, and leadership. I’m particularly excited about contributing to the success of the team and playing a key role in taking innovative products to market.",
  subtitle: "Investor",
};

export const shaun: UserProfile["Insert"] = {
  first_name: "Shaun",
  last_name: "Vembutty",
  email: `${testUserEmailId}+shaun@${testUserEmailDomain}`,
  is_verified: false,
  profile_pic_url:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  cover_photo_url:
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2592&q=80",
  user_id: "", // set dynamically below
  handle: "shaun",
  about:
    "I'm excited about getting involved in real estate. My strengths are in logical thinking, computer science, and leadership. I’m particularly excited about contributing to the success of the team and playing a key role in taking innovative products to market.",
  subtitle: "President of SVAG Investments",
};

async function refetchUserProfile(
  userProfile: UserProfile["Insert"]
): Promise<UserProfile["Row"]> {
  const res = await serverDb
    .user_profiles()
    .select("*")
    .eq("user_id", userProfile.user_id)
    .limit(1)
    .single();

  if (res.error || !res.data) {
    throw new Error();
  }

  return res.data;
}

export async function createUserProfiles(): Promise<{
  primaryUser: UserProfile["Row"];
  nisha: UserProfile["Row"];
  emily: UserProfile["Row"];
  shaun: UserProfile["Row"];
}> {
  const profiles: UserProfile["Insert"][] = [primaryUser, nisha, emily, shaun];
  for (const prof of profiles) {
    // query to see if user already created
    const authRes = await serverDb
      .user_profiles()
      .select("*")
      .eq("email", prof.email!);
    handleError(authRes);

    if (authRes.data!.length === 0) {
      const { user, error } = await serverSupabase.auth.api.createUser({
        email: prof.email! as string,
        password: process.env.TEST_USER_PASSWORD,
      });
      if (error) {
        console.log(error);
        throw new Error("Something went wrong.");
      }
      console.log(`Created ${prof.email} user!`);
      prof.user_id = user!.id;
    } else {
      prof.user_id = authRes.data![0].user_id;
      console.log(
        `${prof.email} user already exists (${prof.first_name}), updating that`
      );
    }

    const res = await serverDb.user_profiles().update(prof);
    handleError(res);
  }

  console.log("==> Done inserting users!");
  return {
    primaryUser: await refetchUserProfile(primaryUser),
    nisha: await refetchUserProfile(nisha),
    emily: await refetchUserProfile(emily),
    shaun: await refetchUserProfile(shaun),
  };
}
