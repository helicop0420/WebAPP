import { db } from "www/shared/modules/supabase";
interface FormInputType {
  text: string;
  relationship: string;
  on_deal: string;
}

export const addEndorsement = async ({
  formData,
  authorId,
  receiverId,
}: {
  formData: FormInputType;
  authorId: string;
  receiverId: string;
}) => {
  const response = await db.endorsements().insert({
    to_user_id: receiverId,
    author_user_id: authorId,
    ...formData,
  });

  return response;
};
