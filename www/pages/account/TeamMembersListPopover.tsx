import Image from "next/image";
import { DealDashboardRowSponsors } from "types/views";
import Link from "next/link";
interface TeamMembersListPopoverProps {
  teamMembers: DealDashboardRowSponsors[] | null;
}
function TeamMembersListPopover({ teamMembers }: TeamMembersListPopoverProps) {
  return (
    <div className="overflow-y-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 bg-white w-[353px] max-w-[353px] max-h-[188px]">
      {/* List starts here */}
      <div className="flow-root px-6">
        <ul role="list" className=" divide-y divide-gray-200">
          {teamMembers &&
            teamMembers.map((person) => (
              <li key={person.user_id} className="py-4 hover:cursor-pointer">
                <Link href={`/p/${person.handle}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full"
                        height={40}
                        width={40}
                        src={person.profile_pic_url ?? "/avatar.png"}
                        alt=""
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Missing Name field here */}
                      <div className="max-w-[4/5]">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {`${person.first_name} ${person.last_name}`}
                        </p>
                        {/* Missing Company name field here */}
                        <p className=" text-xs leading-4 font-normal text-gray-500 whitespace-normal ">
                          {person.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default TeamMembersListPopover;
