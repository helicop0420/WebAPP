import React, { useEffect, useRef, useState } from "react";
import { clientSupabase } from "www/shared/modules/supabase";
import { toast } from "react-toastify";
import { LoadingItem, useGlobalState } from "www/shared/modules/global_context";

interface FormInputTypes {
  email: string;
  password: string;
}
export default function AccountSettings() {
  const loading = useGlobalState((s) => s.loading);
  const [_updateError, setUpdateError] = useState<string | null>(null);
  const supabaseUser = useGlobalState((s) => s.supabaseUser);
  const promiseLoadingHelper = useGlobalState((s) => s.promiseLoadingHelper);
  const accountLoadingItem: LoadingItem = { componentName: "account" };
  const inputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<FormInputTypes>({
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState("noEditing");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async (field: "email" | "password") => {
    setEditing("noEditing");
    let { data, error } = await clientSupabase.auth.update({
      [field]: formState[field],
    });
    if (error) {
      console.log("Error", error);
      toast.error(`Error updating ${field}`);
      setUpdateError(error.message);
    }
    if (!error && data) {
      if (field === "email") {
        toast.success(
          <p>
            Please check your email {supabaseUser?.email} to confirm email
            change.
            <br />
            May take a few minutes for delivery
          </p>
        );
      } else {
        toast.success(`${field} updated`);
      }
    }
  };

  const resetFields = () => {
    setFormState({
      email: "",
      password: "",
    });
  };

  const onCancel = () => {
    setEditing("noEditing");
    resetFields();
  };

  const onClickOutSide = (e: any) => {
    // Check if user is clicking outside of <input and action buttons>
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      e.target.name !== "action-btn"
    ) {
      setEditing("noEditing");
      resetFields();
    }
  };

  useEffect(() => {
    if (editing === "email" || editing === "password") {
      document.addEventListener("mousedown", onClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutSide);
    };
  });

  return (
    <section aria-labelledby="payment-details-heading" className="w-full">
      <form action="#" method="POST" className="w-full">
        <div className="shadow sm:overflow-hidden sm:rounded-md w-full">
          <div className="bg-white py-6 px-4 sm:p-6 w-full">
            <div>
              <h2
                id="payment-details-heading"
                className="text-gray-900 text-2xl leading-8 font-medium"
              >
                Account
              </h2>
              <p className="mt-2  text-gray-500 text-base leading-6 font-normal">
                Change your account info below
              </p>
            </div>
            <div className="mt-10 divide-y divide-gray-200 border-y w-full">
              <div className="">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 items-center h-[86px]">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow flex items-center">
                        {editing === "email" ? (
                          <input
                            value={
                              formState.email
                                ? formState.email
                                : supabaseUser?.email ?? ""
                            }
                            onChange={(e) => onInputChange(e)}
                            ref={inputRef}
                            type="text"
                            name="email"
                            id="email"
                            autoFocus
                            autoComplete="email"
                            className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-700 focus:outline-none focus:ring-gray-900 sm:text-sm"
                          />
                        ) : (
                          <p
                            className="flex-grow"
                            onClick={() => setEditing("email")}
                          >
                            {supabaseUser?.email ?? ""}
                          </p>
                        )}
                      </span>
                      <span className="ml-4 flex-shrink-0 items-center self-center">
                        {editing === "email" ? (
                          <span className="flex gap-1">
                            <button
                              name="action-btn"
                              type="button"
                              className="rounded-md py-2 px-4 bg-red-700 font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-red-900 disabled:cursor-none"
                              onClick={onCancel}
                            >
                              Cancel
                            </button>
                            <button
                              name="action-btn"
                              type="button"
                              className="rounded-md py-2 px-4 bg-gray-700 font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-gray-900 disabled:cursor-none"
                              onClick={() => {
                                onSave("email").finally(
                                  promiseLoadingHelper(accountLoadingItem)
                                );
                              }}
                            >
                              Save
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            name="action-btn"
                            className="rounded-md py-2 px-4 bg-green-700 font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-green-900 disabled:cursor-none"
                            onClick={() => {
                              setEditing("email");
                            }}
                            disabled={
                              editing === "email" || loading ? true : false
                            }
                          >
                            Update
                          </button>
                        )}
                      </span>
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5 items-center h-[86px]">
                    <dt className="text-sm font-medium text-gray-500">
                      Password
                    </dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                      <span className="flex-grow flex items-center">
                        {editing === "password" ? (
                          <input
                            onChange={(e) => onInputChange(e)}
                            value={formState.password}
                            ref={inputRef}
                            type="password"
                            name="password"
                            id="password"
                            autoFocus
                            autoComplete="password"
                            className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-700 focus:outline-none focus:ring-gray-900 sm:text-sm"
                          />
                        ) : (
                          <p
                            className="flex-grow"
                            onClick={() => setEditing("password")}
                          >
                            ****************
                          </p>
                        )}
                      </span>
                      <span className="ml-4 flex-shrink-0 self-center">
                        {editing === "password" ? (
                          <span className="flex gap-1">
                            <button
                              name="action-btn"
                              type="button"
                              className="rounded-md py-2 px-4 bg-red-700 font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-red-900 disabled:cursor-none"
                              onClick={onCancel}
                            >
                              Cancel
                            </button>
                            <button
                              name="action-btn"
                              type="button"
                              className="rounded-md py-2 px-4 bg-gray-700 font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-gray-900 disabled:cursor-none"
                              onClick={() => {
                                onSave("password").finally(
                                  promiseLoadingHelper(accountLoadingItem)
                                );
                              }}
                            >
                              Save
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            name="action-btn"
                            className="rounded-md py-2 px-4 bg-green-700 font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-green-900 disabled:cursor-none"
                            onClick={() => {
                              setEditing("password");
                            }}
                            disabled={
                              editing === "password" || loading ? true : false
                            }
                          >
                            Update
                          </button>
                        )}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
