import { useGlobalState } from "www/shared/modules/global_context";
import UserHome from "./UserHome";
// import PublicHome from "./PublicHome";

export default function Home() {
  const { supabaseUser } = useGlobalState();
  return <UserHome isUserLoggedIn={!!supabaseUser} />;
  // return <PublicHome />;
}
