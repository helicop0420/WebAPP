import { serverDb } from "api/modules/server_supabase";
import { UserProfile } from "types/tables";
import { handleError } from "./seed_utils";

export async function createConnection(
  user_1: UserProfile["Row"],
  user_2: UserProfile["Row"]
) {
  const [from_user_id, to_user_id] =
    user_1.user_id < user_2.user_id
      ? [user_1.user_id, user_2.user_id]
      : [user_2.user_id, user_1.user_id];
  const res = await serverDb
    .connections()
    .select()
    .eq("from_user_id", from_user_id)
    .eq("to_user_id", to_user_id);
  handleError(res);
  if (res.data!.length === 0) {
    console.log(
      `Creating connection between ${from_user_id} and ${to_user_id}`
    );
    const res = await serverDb.connections().insert({
      from_user_id: from_user_id,
      to_user_id: to_user_id,
    });
    handleError(res);
  } else {
    console.log(
      `Connection between ${from_user_id} and ${to_user_id} already exists`
    );
  }
}
