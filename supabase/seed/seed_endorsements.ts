import { serverDb } from "api/modules/server_supabase";
import { UserProfile } from "types/tables";
import { handleError } from "./seed_utils";

export async function createEndorsement({
  authorUser,
  toUser,
  text,
}: {
  authorUser: UserProfile["Row"];
  toUser: UserProfile["Row"];
  text: string;
}) {
  const res = await serverDb
    .endorsements()
    .select("*")
    .eq("author_user_id", authorUser.user_id)
    .eq("to_user_id", toUser.user_id);

  handleError(res);

  if (res.data?.length === 0) {
    const res = await serverDb.endorsements().insert({
      author_user_id: authorUser.user_id,
      to_user_id: toUser.user_id,
      on_deal: "150-Acre Land Development Opportunity in Elgin, TX",
      text: text,
      relationship: "investor",
    });
    handleError(res);
    console.log(
      `Created endorsement from ${authorUser.first_name} to ${toUser.first_name}`
    );
  } else {
    console.log(
      `Endorsement from ${authorUser.first_name} to ${toUser.first_name} already exists`
    );
  }
}
