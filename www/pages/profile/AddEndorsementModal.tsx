import React from "react";
import TextArea from "www/shared/components/form_inputs/TextArea";
import TextInput from "www/shared/components/form_inputs/TextInput";
import ModalHeader from "../../shared/components/modal/ModalHeader";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { addEndorsement } from "./Endorsements.fetchers";
import { LoadingItem, useGlobalState } from "www/shared/modules/global_context";
import { toast } from "react-toastify";
import { invalidateProfileViews } from "./Profile.fetchers";

interface FormInputType {
  text: string;
  relationship: string;
  on_deal: string;
}
export default function AddEndorsementModal({
  setOpen,
  title,
  firstName,
  lastName,
  position,
  picUrl,
  isVerified,
  userId,
}: {
  setOpen: (open: boolean) => void;
  title: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  picUrl: string | null;
  isVerified: boolean | null;
  userId: string;
}) {
  const promiseLoadingHelper = useGlobalState((s) => s.promiseLoadingHelper);
  const userProfileLoadingItem: LoadingItem = { componentName: "profile" };
  const supabaseUser = useGlobalState((s) => s.supabaseUser);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormInputType>({
    reValidateMode: "onChange",
  });
  // text, on_deal, relationship
  const addEndorsementMutation = useMutation(addEndorsement);
  const addEndorsementFunction = async () => {
    const response = await addEndorsementMutation.mutateAsync({
      formData: {
        ...getValues(),
      },
      authorId: supabaseUser?.id as string,
      receiverId: userId,
    });
    if (response?.data) {
      console.log("response", response);
      toast.success("Endorsement added successfully");
      setOpen(false);
      invalidateProfileViews(queryClient);
    }
    if (response?.error) {
      toast.error("Error adding endorsement");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };

  return (
    <div className="inline-block align-bottom bg-white rounded-lg  pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[815px] sm:w-full  overflow-y-hidden h-full max-h-[65%] relative">
      <ModalHeader title={title} setOpen={setOpen} />
      <div className="h-[74%] overflow-auto mt-[65px] mb-[44px]">
        <div className="flex flex-col space-y-5 w-full px-4 mb-[44px] ">
          {/* Card */}
          <UserAvatarWithBadge
            firstName={firstName}
            lastName={lastName}
            position={position}
            picUrl={picUrl}
            isVerified={isVerified}
          />
          <div className="flex flex-col space-y-5">
            <TextInput
              placeholder="Enter deal name"
              containerClassName=""
              label="Deal Name"
              {...register("on_deal")}
            />
            <TextInput
              containerClassName=""
              label="Relationship to person in deal"
              placeholder="What is your relationship to person in deal? (e.g., “example”)"
              {...register("relationship")}
            />
            <TextArea
              placeholder="Share your thoughts"
              rows={6}
              label="Endorsement"
              required={true}
              error={errors.text ? true : false}
              {...register("text", {
                required: true,
                // maxLength: 1000,
              })}
            />
          </div>
        </div>
        <div className="bg-white px-8 py-[24.5px] h-[103px] absolute bottom-0 w-full flex space-x-3 justify-end shadow-2xl">
          <button
            className="px-5 py-3 bg-transparent border border-gray-700 text-gray-700 rounded-[6px] text-base font-semibold disabled:bg-gray-50 text white disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-gray-100 focus:border-2"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-5 py-3 bg-green-700 rounded-[6px] text-base font-semibold disabled:opacity-30 disabled:bg-emerald-700 text white disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-green-800"
            onClick={handleSubmit(() => {
              addEndorsementFunction().finally(
                promiseLoadingHelper(userProfileLoadingItem)
              );
            })}
            disabled={isValid ? false : true}
          >
            Submit an Endorsement
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO: This to be refactored to a shared component
interface UserAvatarWithBadgeProps {
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  picUrl: string | null;
  isVerified: boolean | null;
}
const UserAvatarWithBadge = ({
  firstName,
  lastName,
  position,
  picUrl,
  isVerified,
}: UserAvatarWithBadgeProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-8">
        <Image
          src={picUrl ?? "/avatar.png"}
          alt="avatar"
          width={40}
          height={40}
          className="h-8 w-8 rounded-full"
        />
      </div>
      <div className="">
        <p className="text-sm leading-5 font-bold text-gray-700 flex gap-1 items-center">
          {firstName} {lastName}{" "}
          <span className="flex space-x-2">
            {isVerified && <CheckBadge />}
            <LeafBadge />
          </span>
        </p>
        <p className="text-sm leading-5 font-medium text-green-700">
          {position}
        </p>
      </div>
    </div>
  );
};

const CheckBadge = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.3867 1.41684C3.83698 1.38089 4.26444 1.20378 4.6082 0.910739C4.99647 0.580053 5.4898 0.398438 5.9998 0.398438C6.50981 0.398438 7.00314 0.580053 7.3914 0.910739C7.73516 1.20378 8.16262 1.38089 8.6129 1.41684C9.12141 1.45748 9.59881 1.67791 9.95952 2.03862C10.3202 2.39934 10.5407 2.87674 10.5813 3.38524C10.617 3.83534 10.7941 4.26304 11.0874 4.60674C11.4181 4.995 11.5997 5.48834 11.5997 5.99834C11.5997 6.50834 11.4181 7.00168 11.0874 7.38994C10.7944 7.7337 10.6173 8.16116 10.5813 8.61144C10.5407 9.11994 10.3202 9.59734 9.95952 9.95805C9.59881 10.3188 9.12141 10.5392 8.6129 10.5798C8.16262 10.6158 7.73516 10.7929 7.3914 11.0859C7.00314 11.4166 6.50981 11.5982 5.9998 11.5982C5.4898 11.5982 4.99647 11.4166 4.6082 11.0859C4.26444 10.7929 3.83698 10.6158 3.3867 10.5798C2.8782 10.5392 2.4008 10.3188 2.04009 9.95805C1.67938 9.59734 1.45894 9.11994 1.4183 8.61144C1.38235 8.16116 1.20525 7.7337 0.912204 7.38994C0.581518 7.00168 0.399902 6.50834 0.399902 5.99834C0.399902 5.48834 0.581518 4.995 0.912204 4.60674C1.20525 4.26298 1.38235 3.83552 1.4183 3.38524C1.45894 2.87674 1.67938 2.39934 2.04009 2.03862C2.4008 1.67791 2.8782 1.45748 3.3867 1.41684ZM8.5947 5.09324C8.72221 4.96122 8.79277 4.7844 8.79117 4.60086C8.78958 4.41732 8.71596 4.24175 8.58618 4.11197C8.45639 3.98218 8.28082 3.90856 8.09728 3.90697C7.91375 3.90537 7.73693 3.97593 7.6049 4.10344L5.2998 6.40854L4.3947 5.50344C4.26268 5.37593 4.08586 5.30537 3.90232 5.30697C3.71878 5.30856 3.54322 5.38218 3.41343 5.51197C3.28365 5.64175 3.21003 5.81732 3.20843 6.00086C3.20684 6.1844 3.27739 6.36122 3.4049 6.49324L4.8049 7.89324C4.93617 8.02447 5.11419 8.09819 5.2998 8.09819C5.48542 8.09819 5.66343 8.02447 5.7947 7.89324L8.5947 5.09324Z"
        fill="#15803D"
      />
    </svg>
  );
};

const LeafBadge = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3231 0.09375C11.3231 0.09375 11.3231 3.88542 8.98981 7.38542C6.37636 11.3056 2.71775 9.90807 1.87661 9.5159C1.12496 10.7958 0.970316 11.7616 0.967545 11.7812C0.957016 11.8538 0.894628 11.9062 0.823432 11.9062C0.816316 11.9062 0.809462 11.9057 0.802345 11.9047C0.722603 11.8933 0.667332 11.8195 0.678737 11.7398C0.683928 11.7036 1.17743 8.56092 4.76548 6.01321C5.24568 5.62917 6.29772 5.07518 6.31712 5.06498C5.91984 5.17569 3.04961 6.05297 1.36549 8.71297C0.193812 5.7305 1.86238 2.74707 7.23984 1.55208C9.86484 0.96875 11.3232 0.09375 11.3232 0.09375H11.3231Z"
        fill="url(#paint0_linear_6433_79517)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6433_79517"
          x1="-3.02612"
          y1="12.7237"
          x2="10.7897"
          y2="-1.09211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60451E" />
          <stop offset="0.401042" stopColor="#D5B770" />
          <stop offset="0.609375" stopColor="#E9CB7E" />
          <stop offset="1" stopColor="#987730" />
        </linearGradient>
      </defs>
    </svg>
  );
};
