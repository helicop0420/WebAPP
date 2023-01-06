import { StorageError } from "@supabase/storage-js";
import { parse } from "date-fns";
import { DealToSponsorAssociation } from "types/tables";
import { DealImage, Sponsor } from "types/views";
import { db, clientSupabase } from "www/shared/modules/supabase";
const hostUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Types>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export enum UpdateDealModalQueryKey {
  AutoCompleteUsersView = "AutoCompleteUsersView",
}
type Person = {
  id: string;
  name: string;
  imageUrl: string;
  subtitle: string | null;
};
interface FormInputType {
  title: string | null;
  handle: string;
  highlight_1_name: string | null;
  highlight_1_value: string | null;
  highlight_2_name: string | null;
  highlight_2_value: string | null;
  highlight_term: string | null;
  highlight_equity_raise: string | null;
  about: string | null;
  is_active: boolean;
  launch_date: string | null | undefined;
  deal_images: { image: File | null | string }[];
  deal_sponsors: Person[] | null;
}
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

// Query>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const fetchAutoCompleteUserView = async (userId: string) => {
  if (!userId) {
    // TODO: redirect to login?
    throw Error("userId is required");
  }

  return await db.autocomplete_users_view().select().eq("from_user_id", userId);
};
// Mutations<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// Deal creation(AddDeal)
export const addDeal = async ({ formData }: { formData: FormInputType }) => {
  const {
    title,
    handle,
    highlight_1_name,
    highlight_1_value,
    highlight_2_name,
    highlight_2_value,
    highlight_term,
    highlight_equity_raise,
    about,
    is_active,
    launch_date,
    deal_images,
    deal_sponsors,
  } = formData;

  //   console.log("this get called", formData);
  let res = await db
    .deals()
    .insert({
      title: title,
      handle: handle,
      highlight_1_name: highlight_1_name,
      highlight_1_value: highlight_1_value,
      highlight_2_name: highlight_2_name,
      highlight_2_value: highlight_2_value,
      highlight_term: highlight_term,
      highlight_equity_raise: highlight_equity_raise,
      about: about,
      is_active: is_active,
      launch_date: launch_date
        ? parse(launch_date, "yyyy-MM-dd", new Date())
            .toISOString()
            .toLocaleString()
        : null,
    })
    .limit(1)
    .single();

  if (!res.error) {
    let imageFiles = availableImagesToUpload(deal_images);
    if (imageFiles) {
      const imageUrl = await goUploadImages(imageFiles, res.data.handle);
      if (!imageUrl) {
        console.log("Error uploading images");
        return;
      }
      let dealImages = imageUrl.map((url) => {
        return {
          deal_id: res.data?.id,
          image_url: `${hostUrl}/storage/v1/object/public/${url}`,
        };
      });
      let dealSponsors = deal_sponsors
        ? deal_sponsors.map((sponsor, index) => {
            return {
              deal_id: res.data?.id,
              sponsor_id: sponsor.id,
              order_index: index,
            };
          })
        : [];

      const insertDealSponsors = async (dealSponsors: any) =>
        await db.deal_to_sponsor_associations().insert([...dealSponsors]);
      const insertDealImages = async (dealImages: any) =>
        await db.deal_images().insert([...dealImages]);

      let [insertDealSponsorsResponse, insertDealImagesResponse] =
        await Promise.all([
          insertDealSponsors(dealSponsors),
          insertDealImages(dealImages),
        ]);

      if (insertDealSponsorsResponse?.error) {
        console.log(
          "error saving deal sponsor to table",
          insertDealSponsorsResponse?.error
        );
        return;
      }
      if (insertDealImagesResponse?.error) {
        console.log(
          "error saving deal urls to table",
          insertDealImagesResponse?.error
        );
        return;
      }
    }
  }
  return res;
};

// Update Deal(updateDeal)
export const updateDeal = async ({
  formData,
  dealId,
  previousDealImages,
  previousDealSponsors,
}: {
  formData: FormInputType;
  dealId: number;
  previousDealImages: DealImage[] | null | undefined;
  //   deal_sponsors;
  previousDealSponsors: Sponsor[] | null | undefined;
}) => {
  const {
    title,
    handle,
    highlight_1_name,
    highlight_1_value,
    highlight_2_name,
    highlight_2_value,
    highlight_term,
    highlight_equity_raise,
    about,
    is_active,
    launch_date,
    deal_images,
    deal_sponsors,
  } = formData;
  const res = await db
    .deals()
    .update({
      title,
      handle,
      highlight_1_name,
      highlight_1_value,
      highlight_2_name,
      highlight_2_value,
      highlight_term,
      highlight_equity_raise,
      about,
      is_active: is_active ? true : false,
      launch_date: launch_date
        ? (parse(launch_date, "yyyy-MM-dd", new Date()) as unknown as string)
        : null,
    })
    .eq("id", dealId as number);

  const { fileIndex, files, allImages } = getImagesToUpdate(deal_images);
  if (!res.error) {
    const imageUrls = await goUploadImages(files, handle);
    if (imageUrls) {
      let allImageLinks: string[] = [];
      allImages.map((item, index) => {
        if (typeof item === "string") {
          allImageLinks.push(item);
        } else {
          allImageLinks.push(imageUrls[fileIndex.indexOf(index)] as string);
        }
      });

      let updateLinks: any = [];
      let newLinks: any = [];
      allImageLinks.forEach((url, index) => {
        if (fileIndex.includes(index)) {
          // check if the image exist on the deal_images
          if (previousDealImages && previousDealImages[index]) {
            updateLinks.push({
              ...previousDealImages[index],
              image_url: `${hostUrl}/storage/v1/object/public/${url}`,
              order_index: index,
            });
          } else {
            newLinks.push({
              image_url: `${hostUrl}/storage/v1/object/public/${url}`,
              order_index: index,
              deal_id: dealId as number,
            });
          }
        } else {
          if (previousDealImages && previousDealImages[index]) {
            updateLinks.push({
              ...previousDealImages[index],
              order_index: index,
              image_url: url,
            });
          } else {
            newLinks.push({
              order_index: fileIndex[index],
              deal_id: dealId as number,
              image_url: `${hostUrl}/storage/v1/object/public/${url}`,
            });
          }
        }
      });

      // check for deal_images that are not in the allImageLinks
      let deleteImages: DealImage[] = [];
      previousDealImages
        ? previousDealImages
            .filter((image) => !allImageLinks.includes(image.image_url))
            .map((image) => {
              if (
                !updateLinks.some((img: { id: number }) => img.id === image.id)
              ) {
                deleteImages.push(image);
              }
            })
        : [];

      const insertDealImages = async (links: DealImage[]) =>
        await db.deal_images().insert([...links]);

      const updateDealImages = async (links: DealImage[]) =>
        await db.deal_images().upsert([...links]);

      const deleteDealImages = async (images: DealImage[]) =>
        await db
          .deal_images()
          .delete()
          .in(
            "id",
            images?.map((image) => image.id)
          );

      // check if there is a sponsor that is not in the deal.deal_sponsors
      let newOrderIndex: number[] = [];
      let updateOrderIndex: { [id: string]: number } = {};
      let tempUpdate: Person[] = [];
      let newSponsors: DealToSponsorAssociation["Update"][] = [];
      // let get the order index out
      deal_sponsors?.forEach((sponsor, index) => {
        if (
          previousDealSponsors?.some(
            (dealSponsor) => dealSponsor.user_id === sponsor.id
          )
        ) {
          updateOrderIndex[sponsor.id as string] = index;
          tempUpdate.push(sponsor);
        } else {
          newOrderIndex.push(index);
          newSponsors.push({
            deal_id: dealId as number,
            sponsor_id: sponsor.id,
            order_index: newOrderIndex[index],
          });
        }
      });

      let deleteSponsors = previousDealSponsors?.filter((sponsor) => {
        return !tempUpdate?.some(
          (dealSponsor) => dealSponsor.id === sponsor.user_id
        );
      });

      let updatedSponsors = previousDealSponsors?.filter((dealSponsor) =>
        tempUpdate.some((sponsor) => sponsor.id == dealSponsor.user_id)
      );

      const insertDealSponsors = async (
        sponsors: DealToSponsorAssociation["Update"][]
      ) => await db.deal_to_sponsor_associations().insert([...sponsors]);

      const updateDealSponsors = async (sponsors: Sponsor[]) =>
        await db.deal_to_sponsor_associations().upsert([
          ...sponsors.map((item) => ({
            id: item.deal_to_sponsor_association_id,
            deal_id: dealId as number,
            sponsor_id: item.user_id,
            order_index: updateOrderIndex[item.user_id],
          })),
        ]);

      const deleteDealSponsorsV2 = async (sponsors: Sponsor[]) =>
        await db
          .deal_to_sponsor_associations()
          .delete()
          .in(
            "id",
            sponsors?.map((sponsor) => sponsor.deal_to_sponsor_association_id)
          );

      // crud operations for add deal images and sponsors
      let [
        insertDealImagesResponse,
        updateDealImagesResponse,
        deleteDealImagesResponse,
        insertDealSponsorsResponse,
        updateDealSponsorsResponse,
        deleteDealSponsorsResponse,
      ] = await Promise.all([
        newLinks
          ? insertDealImages(newLinks)
          : Promise.resolve<StorageResponse | undefined>(undefined),
        updateLinks
          ? updateDealImages(updateLinks)
          : Promise.resolve<StorageResponse | undefined>(undefined),
        deleteImages
          ? deleteDealImages(deleteImages)
          : Promise.resolve<StorageResponse | undefined>(undefined),
        newSponsors
          ? insertDealSponsors(newSponsors)
          : Promise.resolve<StorageResponse | undefined>(undefined),
        updatedSponsors
          ? updateDealSponsors(updatedSponsors)
          : Promise.resolve<StorageResponse | undefined>(undefined),
        deleteSponsors
          ? deleteDealSponsorsV2(deleteSponsors)
          : Promise.resolve<StorageResponse | undefined>(undefined),
      ]);

      // Crud operations errors image response
      if (insertDealImagesResponse?.error) {
        console.log(
          "error saving deal urls to table",
          insertDealImagesResponse.error
        );
        return;
      }
      if (updateDealImagesResponse?.error) {
        console.log(
          "error updating deal urls to table",
          updateDealImagesResponse?.error
        );
        return;
      }
      if (deleteDealImagesResponse?.error) {
        console.log(
          "error deleting deal urls to table",
          deleteDealImagesResponse?.error
        );
        return;
      }
      // Crud operations errors for deal_sponsors
      if (insertDealSponsorsResponse?.error) {
        console.log(
          "error saving new deal sponsor to table",
          insertDealSponsorsResponse.error
        );
        return;
      }
      if (updateDealSponsorsResponse?.error) {
        console.log(
          "error updating deal sponsors to table",
          updateDealSponsorsResponse?.error
        );
        return;
      }
      if (deleteDealSponsorsResponse?.error) {
        console.log(
          "error deleting deal sponsors from table",
          deleteDealSponsorsResponse?.error
        );
        return;
      }
    }
  }
  return res;
};

// Utility Functions<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const availableImagesToUpload = (
  images: {
    image: File | null | string;
  }[]
) => {
  const imageArray = Object.values(images);
  const imageFile = imageArray.filter(
    (image) => image.image !== null && typeof image.image !== "string"
  );
  if (imageFile.length > 0) {
    return imageFile.map((image) => image.image) as File[];
  }
  return null;
};

const goUploadImages = async (myImages: File[], handle: string) => {
  const uploadImage = async (image: File) =>
    await clientSupabase.storage
      .from("public")
      .upload(`/deals/${handle}/${image.name}`, image, {
        cacheControl: "1",
        upsert: true,
      });
  const uploadImages = myImages.map((image) => uploadImage(image));
  const uploadImagesResponse = await Promise.all(uploadImages);
  const uploadImagesError = uploadImagesResponse.find(
    (response) => response.error
  );

  if (uploadImagesError) {
    // uploadImagesError.error && toast.error(uploadImagesError.error.message);
    return null;
  } else {
    const imageUrls = uploadImagesResponse.map(
      (response) => response.data?.Key
    );
    return imageUrls;
  }
};

const getImagesToUpdate = (
  images: {
    image: File | null | string;
  }[]
) => {
  const imageArray = Object.values(images);
  const fileIndex: number[] = [];
  const files: File[] = [];
  const allImages = imageArray
    .filter((image) => image.image !== null)
    .map((image, index) => {
      if (typeof image.image === "object") {
        fileIndex.push(index);
        files.push(image.image as File);
      }
      return image.image;
    });
  return { fileIndex, files, allImages };
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
