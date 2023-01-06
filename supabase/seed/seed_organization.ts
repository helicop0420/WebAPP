import { serverSupabase } from "api/modules/server_supabase";
import { Organization } from "types/tables";
import { handleError } from "./seed_utils";

async function fetchOrg(
  org: Organization["Insert"]
): Promise<Organization["Row"] | null> {
  const res = await serverSupabase
    .from<Organization["Row"]>("organizations")
    .select("*")
    .eq("name", org["name"] as string);

  handleError(res);

  if (res.data?.length === 0 || res.data === null) {
    return null;
  } else {
    return res.data[0];
  }
}

const ashtonGrayOrg: Organization["Insert"] = {
  name: "Ashton Gray Developments",
  about:
    "Ashton Gray Development is a vertically-integrated real estate investment and development company headquartered in Houston, TX. We have built an infallible reputation for integrity and high quality of construction across a diverse class of real estate projects that include land development, retail centers, masterplanned subdivisions, multi-family, hospitality, senior living communities, and more.\n\nOur extensive development and construction expertise allow us to both consider a broader range of new construction projects and to leverage greater project control – creating a competitive advantage that yields higher returns for our investors and sets us apart from other private equity and investment firms.",
  linkedin_url: "https://www.linkedin.com/company/ashton-gray-development/",
  handle: "ashtongraydev",
  twitter_url: "https://twitter.com/ashtongrayindia",
  headquarters: "101 Parklane Boulevard, Suite 102Sugar Land, TX 77478",
  email: "info@ashtongraydev.com",
  headline: "Real Estate Development Team",
  profile_pic_url:
    "https://media.licdn.com/dms/image/C510BAQEsCnaUwzmrvA/company-logo_200_200/0/1519960223065?e=1680739200&v=beta&t=OE0bbYOTPZsmAdxlBhl1A_eOF_uJ0DFqU5j14zESVIY",
  website_url: "https://www.ashtongraydev.com/",
  instagram_url: "https://www.instagram.com/ashtongraydev/",
  leadership_bio:
    "Full-service development. Market-smart mentality. The Ashton Gray Real Estate Development team may cover many different areas and specialties, but we all share a singular focus: the tenacity to make the most of your investment.",
};

export async function fetchOrAddAshtonGrayOrganization(): Promise<
  Organization["Row"]
> {
  let dbOrg = await fetchOrg(ashtonGrayOrg);

  if (dbOrg == null) {
    const res = await serverSupabase
      .from<Organization["Insert"]>("organizations")
      .insert(ashtonGrayOrg);
    handleError(res);
    console.log("Organization inserted successfully.");
    dbOrg = await fetchOrg(ashtonGrayOrg);
  }

  if (dbOrg !== null) {
    return dbOrg;
  } else {
    throw new Error("Something went wrong");
  }
}
