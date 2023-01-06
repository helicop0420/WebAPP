import { StorageError } from "@supabase/storage-js";
import { clientSupabase, db } from "www/shared/modules/supabase";
let hostUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface ErrorResponse {
  data: null;
  error: StorageError;
}
interface SuccessResponse {
  data: {
    path: string;
  };
  error: null;
}
type StorageResponse = SuccessResponse | ErrorResponse;
interface FormInputType {
  first_name?: string | null;
  last_name?: string | null;
  handle?: string | null;
  subtitle?: string | null;
  about?: string | null;
  current_org_id?: number | null;
  current_org_position?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  profile_pic_url?: string | null;
  cover_photo_url?: string | null;
  is_sponsor?: string | null;
}

export const updateProfile = async ({
  formData,
  profilePhotoLink,
  coverPhotoLink,
  profileImage,
  coverImage,
  userId,
}: {
  formData: FormInputType;
  profilePhotoLink: string | null | undefined;
  coverPhotoLink: string | null | undefined;
  profileImage: File | null | undefined;
  coverImage: File | null | undefined;
  userId: string;
}) => {
  let profilePictureUrl = profilePhotoLink;
  let coverPhotoUrl = coverPhotoLink;
  let profileImagePath = `users/${userId}/profile_pic.png`;
  let coverImagePath = `users/${userId}/cover_photo.png`;
  const uploadProfilePics = async (profileImage: File) =>
    await clientSupabase.storage
      .from("public")
      .upload(`${profileImagePath}`, profileImage, {
        cacheControl: "1",
        upsert: true,
      });
  const uploadCoverImage = async (profileImage: File) =>
    await clientSupabase.storage
      .from("public")
      .upload(`${coverImagePath}`, profileImage, {
        cacheControl: "1",
        upsert: true,
      });
  let [profilePicsUploadResponse, CoverImageUploadResponse] = await Promise.all(
    [
      profileImage
        ? uploadProfilePics(profileImage)
        : Promise.resolve<StorageResponse | undefined>(undefined),
      coverImage
        ? uploadCoverImage(coverImage)
        : Promise.resolve<StorageResponse | undefined>(undefined),
    ]
  );
  if (profilePicsUploadResponse?.error) {
    console.log("error", profilePicsUploadResponse.error);
    return;
  }
  if (CoverImageUploadResponse?.error) {
    console.log("error", CoverImageUploadResponse.error);
    return;
  }
  if (profilePicsUploadResponse?.data) {
    profilePictureUrl = `${hostUrl}/storage/v1/object/public/public/${profileImagePath}`;
  }
  if (CoverImageUploadResponse?.data) {
    coverPhotoUrl = `${hostUrl}/storage/v1/object/public/public/${coverImagePath}`;
  }
  let response = await db
    .user_profiles()
    .update({
      cover_photo_url: coverPhotoUrl,
      profile_pic_url: profilePictureUrl,
      first_name: formData.first_name,
      last_name: formData.last_name,
      handle: formData.handle,
      subtitle: formData.subtitle,
      about: formData.about,
      current_org_position: formData.current_org_position,
      current_org_id: formData.current_org_id
        ? Number(formData.current_org_id)
        : null,
      facebook_url: formData.facebook_url,
      instagram_url: formData.instagram_url,
      linkedin_url: formData.linkedin_url,
      twitter_url: formData.twitter_url,
      is_sponsor: formData.is_sponsor === "true" ? true : false,
    })
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (response?.error) {
    console.log("Error.", response.error);
  }
  return response;
};
