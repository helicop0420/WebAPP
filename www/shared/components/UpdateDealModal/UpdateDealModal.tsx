import React, { useEffect, useMemo, useState } from "react";
import TextInput from "www/shared/components/form_inputs/TextInput";
import TextArea from "www/shared/components/form_inputs/TextArea";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { LoadingItem, useGlobalState } from "www/shared/modules/global_context";
import _ from "lodash";
import Toggle from "www/shared/components/form_inputs/Toggle";
import classNames from "www/shared/utils/classNames";
import { toast } from "react-toastify";
import UploadBox from "www/shared/components/form_inputs/UploadBox";
import { AutoCompleteUsersView, DealPageView, Sponsor } from "types/views";
import { MultiSelect } from "www/shared/components/form_inputs";
import { OptionProps } from "react-select";
import { getFullName } from "www/shared/utils";
import ConnectionListItem from "./ConnectionListItem";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addDeal,
  fetchAutoCompleteUserView,
  updateDeal,
  UpdateDealModalQueryKey,
} from "./UpdateDealModal.fetchers";
import { invalidateDealViews } from "www/pages/deal/Deal.fetchers";
import { useRouter } from "next/router";
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

function InputLength({
  control,
  name,
  limit,
}: {
  control: Control<FormInputType>;
  name: "title" | "about";
  limit: number;
}) {
  let aboutLength =
    useWatch({
      control,
      name: name,
    })?.length || 0;

  return (
    <p
      className={classNames(
        "mt-2 text-sm text-gray-600",
        aboutLength > limit ? "text-red-300" : ""
      )}
    >
      {aboutLength}/{limit} Characters
    </p>
  );
}
interface UpdateDealModalProps {
  setOpen: (open: boolean) => void;
  existingDeal?: DealPageView | null;
}
function parseAutoCompleteUsersToPersonData(
  user: Pick<
    AutoCompleteUsersView,
    "to_user_id" | "first_name" | "last_name" | "profile_pic_url" | "subtitle"
  >
): Person {
  return {
    id: user.to_user_id!,
    name: getFullName({
      firstName: user.first_name!,
      lastName: user.last_name,
    }),
    imageUrl: user.profile_pic_url!,
    subtitle: user.subtitle,
  };
}
function parseSponsorToPersonData(
  friendConnection: Pick<
    Sponsor,
    "user_id" | "first_name" | "last_name" | "profile_pic_url" | "subtitle"
  >
): Person {
  return {
    id: friendConnection.user_id!,
    name: getFullName({
      firstName: friendConnection.first_name!,
      lastName: friendConnection.last_name,
    }),
    imageUrl: friendConnection.profile_pic_url!,
    subtitle: friendConnection.subtitle,
  };
}

export default function UpdateDealModal({
  setOpen,
  existingDeal,
}: UpdateDealModalProps) {
  const promiseLoadingHelper = useGlobalState((s) => s.promiseLoadingHelper);
  const userProfileLoadingItem: LoadingItem = { componentName: "profile" };
  const loading = useGlobalState((s) => s.loading);
  const router = useRouter();
  const user = useGlobalState((s) => s.supabaseUser);
  const queryClient = useQueryClient();
  const { data: friendsViewRes } = useQuery({
    queryKey: [UpdateDealModalQueryKey.AutoCompleteUsersView, user?.id],
    queryFn: () => fetchAutoCompleteUserView(user?.id!),
  });
  const createDealMutation = useMutation(addDeal);
  const updateDealMutation = useMutation(updateDeal);

  const createDealFunction = async () => {
    const response = await createDealMutation.mutateAsync({
      formData: {
        ...getValues(),
      },
    });
    if (response?.data) {
      console.log("response", response);
      toast.success("Deal created successfully");
      setOpen(false);
    }
    if (response?.error) {
      toast.error("Error creating deal");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };

  const updateDealFunction = async () => {
    const response = await updateDealMutation.mutateAsync({
      formData: {
        ...getValues(),
      },
      dealId: existingDeal?.id as number,
      previousDealSponsors: existingDeal?.deal_sponsors,
      previousDealImages: existingDeal?.deal_images,
    });
    if (response?.data) {
      toast.success("Deal created successfully");
      router.push(`/deal/${existingDeal?.handle}`, undefined, {
        shallow: true,
      });
      setOpen(false);
      invalidateDealViews(queryClient);
    }
    if (response?.error) {
      toast.error("Error creating deal");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };

  const dealPossibleSponsors = useMemo(
    () =>
      friendsViewRes?.data?.map((friend) =>
        parseAutoCompleteUsersToPersonData(friend)
      ) || [],
    [friendsViewRes?.data]
  );

  const [selectedSponsors, setSelectedSponsors] = useState<Person[]>([]);
  const [dealImages, setDealImages] = useState<
    { image: File | null | string }[]
  >([]);
  const peopleNotSelectedYet = useMemo(() => {
    return dealPossibleSponsors.filter(
      (sponsor) => !selectedSponsors.includes(sponsor)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealPossibleSponsors]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    getValues,
    reset,
    trigger,
  } = useForm<FormInputType>({
    reValidateMode: "onChange",
    defaultValues: useMemo(() => {
      let sponsors =
        existingDeal && existingDeal.deal_sponsors
          ? existingDeal.deal_sponsors?.map((sponsor) =>
              parseSponsorToPersonData(sponsor)
            )
          : [];
      setSelectedSponsors(sponsors);
      const currentImages = existingDeal
        ? existingDeal?.deal_images?.map((image) => ({
            image: image.image_url,
          }))
        : [];
      setDealImages(currentImages ?? []);
      return existingDeal
        ? {
            title: existingDeal.title,
            handle: existingDeal.handle as string,
            highlight_1_name: existingDeal.highlight_1_name,
            highlight_1_value: existingDeal.highlight_1_value,
            highlight_2_name: existingDeal.highlight_2_name,
            highlight_2_value: existingDeal.highlight_2_value,
            highlight_term: existingDeal.highlight_term,
            highlight_equity_raise: existingDeal.highlight_equity_raise,
            about: existingDeal.about,
            deal_images: [...new Array(10).fill({ image: null })],
            is_active: existingDeal.is_active ?? false,
            launch_date: existingDeal.launch_date
              ? existingDeal.launch_date
              : undefined,
            deal_sponsor: existingDeal.deal_sponsors
              ? existingDeal.deal_sponsors?.map((sponsor) =>
                  parseSponsorToPersonData(sponsor)
                )
              : null,
          }
        : {
            deal_images: [...new Array(10).fill({ image: null })],
            is_active: false,
          };
    }, [existingDeal]),
  });

  useEffect(() => {
    let numberOfDealsImage =
      existingDeal && existingDeal.deal_images?.length
        ? 10 - existingDeal.deal_images?.length
        : 10;
    const checkDealImageError = async () => {
      await trigger("deal_images");
    };

    let images = getValues("deal_images");
    const imageArray = Object.values(images);
    const imageFile = imageArray.filter(
      (image) => image.image !== null && typeof image.image !== "string"
    );
    if (existingDeal) {
      checkDealImageError();
      reset({
        deal_sponsors: selectedSponsors,
        deal_images: [
          ...dealImages,
          ...new Array(numberOfDealsImage).fill({ image: null }),
        ],
      });
    }
    if (!existingDeal && imageFile.length >= 4) {
      checkDealImageError();
    }
  }, [reset, selectedSponsors, existingDeal, dealImages, getValues, trigger]);
  const { fields } = useFieldArray({
    control,
    name: "deal_images",
  });

  const addImage = async (file: File, index: number) => {
    setValue(`deal_images.${index}.image`, file);
  };
  const deleteImage = async (index: number) => {
    setValue(`deal_images.${index}.image`, null);
  };

  const validateUploadBox = useMemo(
    () => {
      let images = getValues("deal_images");
      const imageArray = Object.values(images);
      if (errors.deal_images) {
        const availableImages = imageArray.filter(
          (image) => image.image !== null
        ).length;
        let invalidIndexes: any = [];
        let invalidImages: any = [];
        imageArray.map((image, index) => {
          if (image.image === null) {
            invalidIndexes.push(index);
            invalidImages.push(image);
          }
        });
        const nonValidBox = _.take(
          invalidIndexes,
          4 - Math.min(availableImages, 4)
        );
        const result = imageArray.map((_image, index) => {
          return Object.values(nonValidBox).includes(index);
        });
        return result;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return imageArray.map((_image) => false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useWatch({ control, name: "deal_images" }), errors.deal_images]
  );

  const isSponsorValid = useMemo(() => {
    if (errors.deal_sponsors) {
      if (selectedSponsors.length > 0) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }, [
    errors.deal_sponsors,
    useWatch({ control, name: "deal_sponsors" }),
    selectedSponsors,
  ]);
  return (
    <div className="h-[83.33%] overflow-auto  pb-10 mb-[160px]  mt-[52px] ">
      <div className="flex flex-col space-y-5 w-full px-4 sm:p-[30px]  ">
        <span>
          <TextInput
            variant="default"
            required
            label="Deal Name"
            placeholder="78-Acre Commercial and Residential Development in Elgin, TX"
            containerClassName=""
            error={errors.title ? true : false}
            errorMessage={errors.title?.message}
            {...register("title", { required: true, maxLength: 100 })}
          />
          <InputLength control={control} name="title" limit={100} />
        </span>

        <hr />
        <span>
          <TextInput
            variant="add-on"
            required
            label="Handle"
            placeholder="handle"
            containerClassName=""
            addOn="elmbase.com/deal/"
            error={errors.handle ? true : false}
            errorMessage={errors.handle?.message}
            {...register("handle", { required: true, maxLength: 1000 })}
          />
        </span>

        <hr />
        {/* Deal status */}
        <div className="grid grid-cols-6">
          <div className="col-start-1 col-end-3 flex flex-col space-y-3">
            <span className="">
              <p className="text-base leading-6 font-medium text-gray-600">
                Deal status <span className="text-red-500">*</span>
              </p>
            </span>
            <div className="flex-1 flex items-center">
              <Controller
                name="is_active"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value == null) {
                      return "Please, choose a value";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Toggle
                    label="Deal is currently active"
                    placement="right"
                    onChange={onChange}
                    value={value}
                    error={errors.is_active ? true : false}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-start-3 col-end-7 flex flex-col space-y-3">
            <span>
              <p className="text-base leading-6 font-medium text-gray-600">
                Launch date <span className="text-red-500">*</span>
              </p>
            </span>

            <div className=" relative rounded-md shadow-sm w-full">
              <input
                type="date"
                className={classNames(
                  " block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-600 bg-gray-100 h-[38px]",
                  errors.launch_date ? "border-red-500" : ""
                )}
                {...register("launch_date", { required: true })}
              />
            </div>
          </div>
        </div>
        <hr />

        {/* Image upload section */}
        <div className="flex flex-col space-y-2">
          <p className="text-base leading-6 font-medium text-gray-600">
            Images <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-5 gap-[15px]">
            {fields.map((field, index) => {
              return (
                <UploadBox
                  {...register(`deal_images.${index}.image`, {
                    required: errors.deal_images
                      ? validateUploadBox[index]
                      : !validateUploadBox[index],
                  })}
                  key={field.id}
                  onUpload={(file: File) => {
                    addImage(file, index);
                  }}
                  filled={
                    getValues(`deal_images.${index}.image`) !== null &&
                    getValues(`deal_images.${index}.image`) !== undefined
                  }
                  image={getValues(`deal_images.${index}.image`)}
                  deleteImage={() => {
                    deleteImage(index);
                  }}
                  error={validateUploadBox[index]}
                />
              );
            })}
          </div>
          <div className="flex space-x-2 text-gray-600 items-center">
            <p className="text-sm leading-5 font-normal">
              Upload up to{" "}
              <span className="text-sm leading-5 font-bold">10</span> images.
            </p>
            <span className="">|</span>

            <p className="text-sm leading-5 font-normal">
              Acceptable formats:{" "}
              <span className="text-sm leading-5 font-bold">PNG or JPG</span>
            </p>
            <span className="">|</span>
            <p className="text-sm leading-5 font-normal">
              MAX.{" "}
              <span className="text-sm leading-5 font-bold">
                (1920 x 1200px)
              </span>
            </p>
          </div>
        </div>
        <hr />
        {/* Highlight section */}
        <div className="higlights flex flex-col space-y-5">
          <p className="text-base leading-6 font-medium text-gray-600">
            Highlights{"  "}
            <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-2 gap-5">
            <TextInput
              variant="default"
              label="LP Equity Raise ($)"
              placeholder="$10M"
              containerClassName=""
              error={errors.highlight_equity_raise ? true : false}
              errorMessage={errors.highlight_equity_raise?.message}
              {...register("highlight_equity_raise", {
                required: true,
                maxLength: 1000,
              })}
            />

            <TextInput
              variant="default"
              label="Term"
              placeholder="3 years"
              containerClassName=""
              error={errors.highlight_term ? true : false}
              errorMessage={errors.highlight_term?.message}
              {...register("highlight_term", {
                required: true,
                maxLength: 1000,
              })}
            />

            <TextInput
              variant="default"
              label="Name"
              placeholder="Target Average Annual Return (%)"
              containerClassName=""
              error={errors.highlight_1_name ? true : false}
              errorMessage={errors.highlight_1_name?.message}
              {...register("highlight_1_name", {
                required: true,
                maxLength: 1000,
              })}
            />

            <TextInput
              variant="default"
              label="Value"
              placeholder="75.00%"
              containerClassName=""
              error={errors.highlight_1_value ? true : false}
              errorMessage={errors.highlight_1_value?.message}
              {...register("highlight_1_value", {
                required: true,
                maxLength: 1000,
              })}
            />
            {/* row 2 */}
            <TextInput
              variant="default"
              label="Name"
              placeholder="Term (m / y)"
              containerClassName=""
              error={errors.highlight_2_name ? true : false}
              errorMessage={errors.highlight_2_name?.message}
              {...register("highlight_2_name", {
                required: true,
                maxLength: 1000,
              })}
            />

            <TextInput
              variant="default"
              label="Value"
              placeholder="2.5y"
              containerClassName=""
              error={errors.highlight_2_value ? true : false}
              errorMessage={errors.highlight_2_value?.message}
              {...register("highlight_2_value", {
                required: true,
                maxLength: 1000,
              })}
            />
          </div>
        </div>
        {/* about */}
        <span>
          <TextArea
            required
            label="Description"
            placeholder="Lorem ipsum dolor sit amet consectetur. Mattis nisl orci natoque lorem ac et. Risus augue feugiat nec sociis lobortis ornare quis nisi augue. Nunc quis amet ut commodo neque amet. Tincidunt mattis tellus et platea. Mattis pharetra pellentesque varius imperdiet nunc id mollis."
            containerClassName=""
            rows={5}
            error={errors.about ? true : false}
            errorMessage={errors.about?.message}
            {...register("about", { required: true, maxLength: 1000 })}
          />
          <InputLength control={control} name="about" limit={1000} />
        </span>
        <span className="">
          <label
            // htmlFor={name}
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 mb-2.5"
          >
            Sponsors <span className="text-red-500">*</span>
          </label>
          <Controller
            name="deal_sponsors"
            control={control}
            rules={{ required: true }}
            render={() => (
              <div
                className={classNames(
                  !isSponsorValid ? "border rounded-md border-red-500" : ""
                )}
              >
                <MultiSelect<Person>
                  options={peopleNotSelectedYet}
                  value={selectedSponsors}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  onChange={(_person) => {
                    setSelectedSponsors([..._person]);
                    setValue("deal_sponsors", [..._person]);
                  }}
                  placeholder="Type a name or multiple names"
                  components={{
                    Option: AddSponsor,
                  }}
                />
              </div>
            )}
          />
        </span>
      </div>
      <div className="bg-white px-8 py-[24.5px] h-[103px] absolute bottom-0 w-full flex justify-end shadow-2xl">
        <button
          className="px-5 py-3 bg-green-700 rounded-[6px] text-base font-semibold disabled:bg-green-900 text white disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-green-800"
          disabled={loading}
          onClick={handleSubmit(() => {
            existingDeal
              ? updateDealFunction().finally(
                  promiseLoadingHelper(userProfileLoadingItem)
                )
              : createDealFunction().finally(
                  promiseLoadingHelper(userProfileLoadingItem)
                );
          })}
        >
          {existingDeal
            ? loading
              ? "Updating..."
              : "Update"
            : loading
            ? "Saving..."
            : "Save"}
        </button>
      </div>
    </div>
  );
}

const AddSponsor = (props: OptionProps<Person>) => {
  const person: Person = props.data;

  return (
    <ConnectionListItem
      name={person.name}
      imageUrl={person.imageUrl}
      subtitle={person.subtitle}
      onDelete={() => props.selectOption(person)}
    />
  );
};
