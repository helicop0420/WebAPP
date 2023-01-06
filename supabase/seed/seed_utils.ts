import { PostgrestResponse } from "@supabase/supabase-js";

export function handleError(response: PostgrestResponse<any>) {
  if (response.error || response.status == 404) {
    console.log(response);
    throw new Error("Something went wrong.");
  }
}
