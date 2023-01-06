import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/pro-thin-svg-icons";
import Image from "next/image";
import Link from "next/link";
import SlideOver from "www/shared/components/slideOver/SlideOver";
import styles from "./Home.module.css";
import cx from "classnames";
import { clientSupabase } from "www/shared/modules/supabase";

interface ProviderButtonProps {
  provider: string;
  onClick: () => void;
  iconPath: string;
}
interface AuthPageProps {
  show: boolean;
  setShow: (show: boolean) => void;
}
export default function Auth({ show, setShow }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginEmailPassword = async () => {
    setError(null);
    const res = await clientSupabase.auth.signIn({
      email,
      password,
    });
    if (res.error !== null) {
      let errorMessage = res.error.message;
      if (errorMessage === "Email not confirmed") {
        errorMessage = "Account pending approval";
      }
      setError(errorMessage);
      return;
    }
  };

  return (
    <SlideOver show={show} setShow={setShow}>
      <div className="h-full  flex items-center  justify-center flex-col bg-white  w-full">
        <div className="max-w-[350px] w-full ">
          <p className="font-inter font-medium text-[32px] leading-[39px] text-green-700 mb-12 text-center">
            Sign In
          </p>
          <div className="flex flex-col  w-full justify-center space-y-4 ">
            <ProviderButton
              iconPath="/google.svg"
              provider="Continue with Google"
              onClick={() => {}}
            />
            <ProviderButton
              iconPath="/linkedin.svg"
              provider="Continue with Linkedin"
              onClick={() => {}}
            />
          </div>
          <div className="relative w-full flex items-center my-4">
            <div className="h-[1px] flex-1 bg-gray-200 " />
            <span className="text-gray-700 font-medium z-2 bg-white px-2 ">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-gray-200 " />
          </div>
          {!showLoginForm && (
            <p
              className="font-inter font-medium text-base leading-[39px] text-[#15803D] text-center cursor-pointer"
              onClick={() => {
                setShowLoginForm(!showLoginForm);
              }}
            >
              Sign In with Email address
            </p>
          )}
          {showLoginForm && (
            <div
              className={cx(
                "relative rounded-md shadow-sm w-full",
                styles.loginForm
              )}
            >
              <div className="w-full space-y-6">
                <div className="w-full">
                  <div className="mt-1 flex rounded-md shadow-sm w-full">
                    <div className="relative rounded-md shadow-sm w-full">
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="block w-full rounded-md border-gray-300 px-4 py-[21.5px] focus:border-green-500 focus:ring-green-500 sm:text-sm h-[60px] font-light text-sm leading-[17px] text-[#828B93] bg-white "
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="mt-1 flex rounded-md shadow-sm w-full">
                    <div className="relative rounded-md shadow-sm w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-[21.5px] focus:border-green-500 focus:ring-green-500 sm:text-sm h-[60px] font-light text-sm leading-[17px] text-[#828B93] bg-white  autofill:bg-white "
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="h-6 w-5 text-green-700 font-light text-[19.2px] leading-[19px]"
                          aria-hidden="true"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="#">
                  <a className="text-green-700 text-right w-full block">
                    Forgot Password?
                  </a>
                </Link>
              </div>
              <button
                className="bg-[#15803D] font-inter font-normal text-sm leading-[150%] text-white py-[19.5px] flex gap-2 items-center justify-center border border-[#D1DBE3]  rounded-[6px] shadow-[0px_10px_20px_rgba(0,0,0,0.2)] w-full max-w-[350px] mx-auto mt-6"
                onClick={loginEmailPassword}
              >
                Sign In
              </button>
            </div>
          )}
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
      </div>
    </SlideOver>
  );
}

const ProviderButton = ({
  provider,
  onClick,
  iconPath,
}: ProviderButtonProps) => {
  return (
    <button
      className="bg-white font-inter font-normal text-sm leading-[150%] text-[#353636] py-[19.5px] flex gap-2 items-center justify-center border border-[#D1DBE3]  rounded-[6px] w-full max-w-[350px] mx-auto "
      onClick={onClick}
    >
      <Image src={iconPath} alt="linkedin" height="24" width="24" />
      {provider}
    </button>
  );
};
