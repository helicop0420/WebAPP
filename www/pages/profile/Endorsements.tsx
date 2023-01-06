/* eslint-disable @next/next/no-img-element */
import { Endorsement } from "types/views";
import dateFormat from "dateformat";
import Image from "next/image";
import Link from "next/link";

interface EndorsementsProps {
  endorsements: null | Endorsement[];
  setOpenAddEndorsementModal: (state: boolean) => void;
}

export default function Endorsements({
  endorsements,
  setOpenAddEndorsementModal,
}: EndorsementsProps) {
  return (
    <div className="bg-white rounded-lg px-11 py-7 pb-6 flex flex-col">
      <div className="text-3xl font-extrabold mb-12">Endorsements</div>
      <div className="border-b">
        <p className="border-b border-b-green-700 text-green-700 font-medium text-sm leading-5 pb-5 w-[60px] -mb-[1px]">
          Received
        </p>
      </div>

      <div className="border-b last:border-0 mb-4 mt-8 md:flex gap-20 pb-6">
        {/* endorsements list */}
        <div className="w-full md:w-[64.29%]" role="list">
          {endorsements &&
            endorsements.map(
              (
                {
                  text,
                  endorsing_user_profile_pic_url,
                  endorsing_user_first_name,
                  endorsing_user_last_name,
                  created_at,
                  endorsing_user_handle,
                  relationship,
                  on_deal,
                },
                i
              ) => (
                <EndorsementRowCard
                  key={i}
                  text={text}
                  userProfilePic={endorsing_user_profile_pic_url}
                  userFirstName={endorsing_user_first_name}
                  userLastName={endorsing_user_last_name}
                  userProfileHandle={endorsing_user_handle}
                  date={created_at}
                  relationship={relationship}
                  deal={on_deal}
                />
              )
            )}
          {endorsements && endorsements.length > 3 && (
            <div className="">
              <button className="button  py-2 px-3 rounded-md text-sm leading-5 font-semibold mt-7  w-auto border  border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                {`Show more (${endorsements.length - 3})`}
              </button>
            </div>
          )}
        </div>
        {/* Endorse section */}
        <div className="w-full mt-12 md:mt-0 md:w-[28.57%]">
          <div className="mt-3 md:mt-0 md:pl-4  self-end">
            <p className="text-xl leading-7 font-semibold text-gray-900">
              Share your thoughts
            </p>
            <p className="text-sm leading-5 font-normal text-gray-500 mt-2">
              If you’ve worked with this person, share your thoughts with other
              users
            </p>
            <button
              className="button text-white bg-green-700 hover:bg-green-800 border-2 border-transparent focus:bg-green-700 focus:border-2 focus:border-green-800 py-2 px-3 rounded-md text-sm leading-5 font-semibold mt-7  w-auto"
              onClick={() => setOpenAddEndorsementModal(true)}
            >
              Endorse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
interface EndorsementRowCardProps {
  text: string;
  userProfilePic: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  deal: string | null;
  date: string;
  userProfileHandle: string | null;
  relationship: string;
}
const EndorsementRowCard = ({
  text,
  userFirstName,
  userLastName,
  userProfilePic,
  date,
  userProfileHandle,
  relationship,
  deal,
}: EndorsementRowCardProps) => {
  return (
    <div className="md:flex space-x-4 w-full">
      <div className="flex space-x-4 text-sm text-gray-500 w-full">
        <div className="flex-none ">
          <Image
            src={userProfilePic ?? "/avatar.png"}
            alt=""
            height={40}
            width={40}
            className="h-10 w-10 rounded-full bg-gray-100"
          />
        </div>
        <div className="w-full flex flex-col space-y-4">
          <div className="">
            <span className="w-full flex justify-between items-center">
              <span className="flex-1">
                <Link href={userProfileHandle as string}>
                  <a className="text-gray-900 text-sm leading-5 font-bold">
                    {userFirstName} {userLastName}
                  </a>
                </Link>
              </span>
              <p className="text-xs leading-4 font-medium w-[150px] text-gray-500 justify-self-end text-right">
                {dateFormat(new Date(date), "mmmm dd, yyyy")}
              </p>
            </span>
            <p className="text-sm leading-5 font-normal">
              <span className="capitalize">{relationship}</span> in{" "}
              <span className="font-bold">{deal}</span>
            </p>
          </div>

          <p className="text-sm leading-5 font-normal text-gray-700">{text}</p>
        </div>
      </div>
    </div>
  );
};
