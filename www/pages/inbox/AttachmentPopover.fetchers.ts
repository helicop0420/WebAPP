import { clientSupabase, db } from "www/shared/modules/supabase";

export enum AttachmentPopoverQuerykey {
  Filenames = "Filenames",
}

// Upload an attachment to a deal and return the `deal_attachment_id` which
// can be used for creating a message
export const uploadFileAttachment = async ({
  deal_id,
  filename,
  extension,
  file,
}: {
  deal_id: number;
  filename: string;
  extension: string;
  file: File;
}) => {
  const filenameRes = await db
    .deal_filenames()
    .insert({ filename, deal_id })
    .single();

  const filenameId = filenameRes.data?.id;

  if (!filenameId) throw new Error("Could not create filename");

  // Initialize row first so we can get the attachment id
  const attachmentRes = await db
    .deal_attachments()
    .insert({
      deal_filename_id: filenameId,
      storage_url: "",
      attachment_type: extension,
      size_in_bytes: file.size,
    })
    .single();

  const attachmentId = attachmentRes.data?.id;
  if (!attachmentId) throw new Error("Could not create attachment");

  const storageUrl = `attachments/${attachmentId}/${filename}.${extension}`;
  await clientSupabase.storage.from("private").upload(storageUrl, file, {
    cacheControl: "1",
  });

  const res = await db
    .deal_attachments()
    .update({ storage_url: storageUrl })
    .eq("id", attachmentId)
    .single();

  return res;
};

export const getDealFilenames = async (deal_id?: number) => {
  if (!deal_id) return null;

  const filenames = await db.deal_filenames().select().eq("deal_id", deal_id);

  return filenames;
};

export const getAllFilenamesForDeals = async (deal_ids?: number[]) => {
  if (!deal_ids) return null;

  const filenames = await db.deal_filenames().select().in("deal_id", deal_ids);

  return filenames;
};
