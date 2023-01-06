import { ReactNode } from "react";

// TailwindUI
// https://tailwindui.com/components/application-ui/elements/badges
export function Badge({
  name,
  size = "small",
  bgColorClassName = "bg-green-700",
  textColorClassName = "text-white",
  onDelete,
}: {
  name: string | ReactNode;
  size?: "small" | "medium";
  bgColorClassName?: string;
  textColorClassName?: string;
  onDelete?: (event: any) => void | undefined;
}) {
  const sizingClassname = size === "small" ? "px-2.5" : "px-3";

  return (
    <span
      className={`inline-flex items-center rounded-full ${bgColorClassName} ${sizingClassname} py-0.5 pl-2 ${
        onDelete ? "pr-0.5" : "pr-2"
      } text-xs font-medium ${textColorClassName}`}
    >
      {name}
      {onDelete && (
        <button
          type="button"
          className={`ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full hover:${bgColorClassName} focus:${bgColorClassName} focus:outline-none`}
          onClick={onDelete}
        >
          <span className="sr-only">Remove Item</span>
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
