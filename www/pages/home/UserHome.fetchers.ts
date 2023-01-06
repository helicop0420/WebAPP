import { db } from "www/shared/modules/supabase";

export const addWaitlistEntry = async (email: string) => {
  return await db.waitlist_emails().insert([{ email }]);
};
