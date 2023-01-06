import { MouseEvent, ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "button";
  children: ReactNode;
  className?: string;
  onClick?: (evt?: MouseEvent) => void;
}

export function OutlineButton({
  children,
  type = "button",
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded border text-base font-medium border-gray-400 shadow-sm hover:bg-gray-50 text-gray-800 hover:text-black ${className}`}
    >
      {children}
    </button>
  );
}
