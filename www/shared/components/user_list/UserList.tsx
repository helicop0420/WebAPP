import React from "react";
import SimpleBar from "simplebar-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import UserCard from "./UserCard";
import "simplebar-react/dist/simplebar.min.css";
interface UserListProps {
  users: UserCardProps[] | null;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showIcon?: boolean;
  icon?: IconProp;
}
interface UserCardProps {
  subtitle: string | null;
  firstName: string | null;
  handle: string | null;
  lastName: string | null;
  profilePicUrl: string | null;
}
export default function UserList({ users, header, footer, showIcon, icon }: UserListProps) {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 bg-white w-[353px] flex flex-col">
      {header && header}
      <SimpleBar
        style={{ maxHeight: 250, zIndex: 20 }}
        className="  z-10 bg-white w-[353px] flex"
        forceVisible="y"
        autoHide={false}
      >
        <div className=" flow-root px-6 max-h-[250px] overflow-y-auto">
          <ul role="list" className=" divide-y divide-gray-200 border-y-2">
            {users &&
              users.map((member) => <UserCard key={member.handle} profile={member} icon={icon} showIcon={showIcon} />)}
          </ul>
        </div>
      </SimpleBar>
      {footer && footer}
    </div>
  );
}
