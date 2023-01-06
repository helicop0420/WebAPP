import { ReactNode } from "react";

// This component covers the whole area provided with a soft gray background
// Then adds white box in the middle of the page
// Useful for lone forms on a page e.g. Login form
// This component needs to be rendered under a flex component that it grows into
export default function PageCenteredCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-grow justify-center items-center bg-gray-200">
      <div className="max-w-lg w-3/5 bg-white rounded overflow-hidden shadow-lg">
        {children}
      </div>
    </div>
  );
}
