import dateFormat from "dateformat";
import { DateDividerProps } from "./Inbox.types";

export default function DateDivider(props: DateDividerProps) {
  return (
    <div className="relative my-3">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-500" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-sm leading-5 font-bold text-gray-500">
          {dateFormat(new Date(props.date), "mmmm d")}
        </span>
      </div>
    </div>
  );
}
