import { ReactNode } from "react";
import { TopLoadingBar } from "../TopLoadingBar";
import { useRouter } from "next/router";
export default function MainLayout({ children, navBar }: { children: ReactNode; navBar?: ReactNode }) {
  const { asPath } = useRouter();
  const path = asPath.split("#")[0].split("?")[0];
  return (
    <div className="h-screen w-screen bg-white text-gray-700 flex flex-col antialiased">
      {path !== "/" && navBar}
      <TopLoadingBar />
      <div className="flex flex-grow justify-center bg-gray-100">{children}</div>
    </div>
  );
}
