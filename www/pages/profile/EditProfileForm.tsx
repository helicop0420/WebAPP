import React, { useMemo, useState } from "react";
import { ProfilePageView } from "types/views";
import { Control, useForm, useWatch } from "react-hook-form";
import { Organization } from "types/tables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useDropzone, FileWithPath } from "react-dropzone";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { LoadingItem, useGlobalState } from "www/shared/modules/global_context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "react-query";
import { invalidateProfileViews } from "./Profile.fetchers";
import { updateProfile } from "./EditProfileForm.fetchers";
import classNames from "www/shared/utils/classNames";

// import EndorsementCard from "www/shared/components/profile/EndorsementCard";
// import DealCard from "www/shared/components/profile/DealCard";
interface EditProfileFormProps {
  profile: ProfilePageView;
  setModal: (modal: boolean) => void;
  organizations: Organization["Row"][];
}
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

// Calculating input lengths
function InputLength({
  control,
  name,
  limit,
}: {
  control: Control<FormInputType>;
  name: "about" | "subtitle";
  limit: number;
}) {
  let aboutLength = useWatch({
    control,
    name: name,
  })?.length;

  return (
    <p className="mt-1  text-gray-500 text-right text-xs leading-4 font-normal">
      {aboutLength ?? 0}/{limit} Characters
    </p>
  );
}

const EditProfileForm = ({
  profile,
  setModal,
  organizations,
}: EditProfileFormProps) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<FileWithPath>();
  const [profileImage, setProfileImage] = useState<File>();
  const promiseLoadingHelper = useGlobalState((s) => s.promiseLoadingHelper);
  const userProfileLoadingItem: LoadingItem = { componentName: "profile" };
  const loading = useGlobalState((s) => s.loading);
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation(updateProfile);

  const { getRootProps, getInputProps } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => {
      setDragging(true);
    },
    onDragOver: () => {
      setDragging(true);
    },
    onDragLeave: () => {
      setDragging(false);
    },
    onDrop(acceptedFiles) {
      if (acceptedFiles.length > 0) {
        setCoverImage(acceptedFiles[0]);
      }
    },
  });
  const { register, handleSubmit, control, watch, getValues } =
    useForm<FormInputType>({
      reValidateMode: "onChange",
      defaultValues: useMemo(
        () => ({
          first_name: profile.first_name,
          last_name: profile.last_name,
          handle: profile.handle,
          subtitle: profile.subtitle,
          about: profile.about,
          current_org_id: profile.current_org_id,
          current_org_position: profile.current_org_position,
          facebook_url: profile.facebook_url,
          instagram_url: profile.instagram_url,
          linkedin_url: profile.linkedin_url,
          twitter_url: profile.twitter_url,
          profile_pic_url: profile.profile_pic_url,
          cover_photo_url: profile.cover_photo_url,
          is_sponsor: profile.is_sponsor === true ? "true" : "false",
        }),
        [profile]
      ),
    });

  const watchProfilePics = watch("profile_pic_url");
  const watchCoverPics = watch("cover_photo_url");

  const updateProfileFunction = async () => {
    const response = await updateProfileMutation.mutateAsync({
      formData: {
        ...getValues(),
      },
      profilePhotoLink: watchProfilePics,
      coverPhotoLink: watchCoverPics,
      profileImage: profileImage,
      coverImage: coverImage,
      userId: profile.user_id as string,
    });
    if (response?.data) {
      toast.success("Profile updated successfully");
      invalidateProfileViews(queryClient);
      setModal(false);
    }
    if (response?.error) {
      toast.error("Error updating profile", {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };

  return (
    <>
      <div className="h-[83.33%] overflow-auto px-4 sm:p-[30px] pb-10 mb-[160px]  mt-[52px] text-gray-700">
        {/* .File upload section */}
        <form>
          <div
            // className="sm:col-span-6 relative mb-12"
            {...getRootProps({
              className: "dropzone sm:col-span-6 relative mb-12",
            })}
          >
            <label
              htmlFor="cover-photo"
              className="block text-base leading-6 font-semibold text-gray-700"
            >
              Cover photo
            </label>
            <div
              className={classNames(
                dragging ? "border-green-500" : "border-gray-300",
                "mt-1 flex justify-center px-6 pt-5 pb-6 border-2  border-dashed rounded-md min-h-[140px] relative"
              )}
              style={{
                backgroundImage: `url(${
                  coverImage
                    ? URL.createObjectURL(coverImage)
                    : profile.cover_photo_url
                })`,
                backgroundSize: "cover",
              }}
            >
              <input {...getInputProps()} />
              <label
                htmlFor="cover-photo"
                className="absolute top-[18px] right-[18px] group"
              >
                <div className="w-8 h-8 rounded-full bg-white z-[400]  shadow-md flex justify-center items-center group-hover:bg-gray-200 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    size="lg"
                    className="text-green-600 group-hover:text-green-400"
                  />
                </div>
              </label>
              <div
                className={classNames(
                  profile.cover_photo_url ? "hidden" : "block",
                  "space-y-1 text-center"
                )}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="cover-photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-700 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="cover-photo"
                      name="cover-photo"
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files) {
                          setCoverImage(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {/* Photo section */}
            <div className="sm:col-span-6 ml-4 relative -mt-10 h-20 w-20 bg-white rounded-full">
              <div className="flex items-center  relative">
                <span className="h-20 w-20 rounded-full overflow-hidden bg-white  relative border-green-white border-[3px]">
                  <input
                    id="profile-pics"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      // setImage(e.target.files[0]);
                      if (e.target.files) {
                        setProfileImage(e.target.files[0]);
                        // uploadByType("profilePhoto", e.target.files[0]);
                      }
                    }}
                  />

                  {watchProfilePics !== null ? (
                    <Image
                      src={
                        profileImage
                          ? URL.createObjectURL(profileImage)
                          : watchProfilePics
                          ? watchProfilePics
                          : ""
                      }
                      alt="profile pic"
                      height="80"
                      width="80"
                    />
                  ) : (
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <label htmlFor="profile-pics" className="group">
                  <div className="w-8 h-8 rounded-full bg-white z-[400] absolute -right-1 bottom-0 shadow-md flex justify-center items-center group-hover:bg-gray-200 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faCameraRetro}
                      size="lg"
                      className=" text-green-600 group-hover:text-green-400"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
          {/* cover photo2 */}
          {/* <CoverPhoto /> */}
          {/* First name and last name section */}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="text-base leading-6 font-semibold text-gray-700"
              >
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder=""
                  {...register("first_name")}
                  id="first-name"
                  autoComplete="given-name"
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-base leading-6 font-semibold text-gray-700"
              >
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder=""
                  id="last-name"
                  autoComplete="family-name"
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...register("last_name")}
                />
              </div>
            </div>
          </div>
          {/* Profile Handle */}
          <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 w-full">
            <div className="sm:col-span-6">
              <label
                htmlFor="handle"
                className="block text-base leading-6 font-semibold text-gray-700"
              >
                Profile Handle
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  elmbase.com/p/
                </span>
                <input
                  type="text"
                  id="handle"
                  autoComplete="handle"
                  className="flex-1 focus:ring-green-500 focus:border-green-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  {...register("handle")}
                />
              </div>
            </div>
          </div>
          {/* Headline */}
          <div className="sm:col-span-6 mt-5">
            <label
              htmlFor="headline"
              className="block text-base leading-6 font-semibold text-gray-700"
            >
              Headline
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...register("subtitle")}
                id="headline"
                autoComplete="headline"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <InputLength control={control} name="subtitle" limit={100} />
          </div>
          {/* About */}
          <div className="sm:col-span-6 mt-5">
            <label
              htmlFor="about"
              className="block text-base leading-6 font-semibold text-gray-700"
            >
              About
            </label>
            <div className="mt-1">
              <textarea
                id="about"
                rows={3}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                defaultValue={""}
                {...register("about")}
              />
            </div>
            <InputLength control={control} name="about" limit={100} />
          </div>
          {/* are you a sponsor section */}
          <fieldset className="mt-5">
            <div>
              <legend className="text-base leading-6 font-semibold text-gray-700">
                Are you a sponsor?
              </legend>
            </div>
            <div className="mt-3 space-y-4">
              <div className="flex items-center">
                <input
                  id="true"
                  value="true"
                  {...register("is_sponsor")}
                  type="radio"
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <label
                  htmlFor="true"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="false"
                  value="false"
                  {...register("is_sponsor")}
                  type="radio"
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <label
                  htmlFor="false"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  No
                </label>
              </div>
            </div>
          </fieldset>
          {/* Current company Name */}
          <div className="sm:col-span-6 mt-5">
            <label
              htmlFor="company"
              className="block text-base leading-6 font-semibold text-gray-700"
            >
              Current Company
            </label>
            <select
              id="country"
              {...register("current_org_id")}
              autoComplete="current_org_id"
              className="relative block w-full rounded-none rounded-t-md border-gray-300 bg-transparent focus:z-10 focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          {/* Current company Position */}
          <div className="sm:col-span-6 mt-5">
            <label
              htmlFor="position"
              className="block text-base leading-6 font-semibold text-gray-700"
            >
              Position title
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...register("current_org_position")}
                id="position"
                placeholder="President"
                autoComplete="position"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          {/* LinkedIN */}
          <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 w-full">
            <div className="sm:col-span-6">
              <label
                htmlFor="facebook"
                className="block text-base leading-6 font-semibold text-gray-700"
              >
                Linkedin Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder=""
                  {...register("linkedin_url")}
                  id="linkedIn"
                  autoComplete="linkedIn"
                  className="flex-1 focus:ring-green-500 focus:border-green-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          {/* Twitter */}
          <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 w-full">
            <div className="sm:col-span-6">
              <label
                htmlFor="facebook"
                className="block text-base leading-6 font-semibold text-gray-700"
              >
                Twitter Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder=""
                  {...register("twitter_url")}
                  id="twitter"
                  autoComplete="twitter"
                  className="flex-1 focus:ring-green-500 focus:border-green-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          {/* Instagram */}
          <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 w-full">
            <div className="sm:col-span-6">
              <label
                htmlFor="facebook"
                className="block text-base leading-6 font-semibold text-gray-700"
              >
                Instagram Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder=""
                  {...register("instagram_url")}
                  id="instagram"
                  autoComplete="instagram"
                  className="flex-1 focus:ring-green-500 focus:border-green-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          {/* Facebook */}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 w-full mb-4">
            <div className="sm:col-span-6">
              <label
                htmlFor="facebook"
                className="block text-base leading-6 font-semibold text-gray-700"
              >
                Facebook Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  http://
                </span> */}
                <input
                  type="text"
                  placeholder=""
                  {...register("facebook_url")}
                  id="facebook"
                  autoComplete="facebook"
                  className="flex-1 focus:ring-green-500 focus:border-green-500 block w-full min-w-0  rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          {/* Deals */}
          {/* <div className="mt-5">
        <p className="font-inter text-base leading-6 font-semibold text-gray-700">Deals</p>
        <DealCard />
      </div> */}
          {/* Endorsement */}
          {/* <div className="">
        <p className="font-inter text-base leading-6 font-semibold text-gray-700">Endorsements</p>
        <EndorsementCard />
        <EndorsementCard />
        <EndorsementCard />
      </div> */}
        </form>
      </div>
      <div className="bg-white px-8 py-[24.5px] h-[103px] absolute bottom-0 w-full flex justify-end shadow-2xl">
        <button
          className="px-5 py-3 bg-green-700 rounded-[6px] text-base font-semibold disabled:bg-green-900 text white disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-green-800"
          disabled={loading}
          onClick={handleSubmit(() => {
            updateProfileFunction().finally(
              promiseLoadingHelper(userProfileLoadingItem)
            );
          })}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
};

export default EditProfileForm;
