import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import classNames from "www/shared/utils/classNames";
import { faEye } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  info?: string | React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: React.ComponentProps<"div">["className"];
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
type DefaultInputProps = {
  icon?: never;
  variant?: "default";
  addOn?: never;
};

type IconInputProps = {
  icon: IconProp;
  variant: "icon";
  addOn?: never;
};

type AddonInputProps = {
  icon?: never;
  variant: "add-on";
  addOn: string;
};

function TextInput(
  props: TextInputProps &
    (DefaultInputProps | IconInputProps | AddonInputProps),
  ref: React.Ref<HTMLInputElement>
) {
  const {
    icon = faEye,
    variant = "default",
    label,
    error,
    errorMessage,
    info,
    placeholder = "",
    addOn,
    required,
    containerClassName,
    type = "text",
    ...rest
  } = props;
  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={rest.name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={classNames(
          "relative rounded-md shadow-sm",
          label ? "mt-2.5" : ""
        )}
      >
        {variant === "default" && (
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              className={classNames(
                "block w-full rounded-md border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focused:border focused:border-red-500 disabled:text-gray-400",
                error
                  ? "border-red-300  focus:border-red-500 focus:ring-red-500"
                  : ""
              )}
              placeholder={placeholder}
              {...rest}
              type={type}
              ref={ref}
            />
          </div>
        )}
        {variant === "icon" && (
          <div className="relative mt-2.5 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon
                icon={icon}
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              {...rest}
              className={classNames(
                "block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                error
                  ? "border-red-700 focus:border-red-500 focus:ring-red-500"
                  : ""
              )}
              placeholder={placeholder}
              type={type}
              ref={ref}
            />
          </div>
        )}
        {variant === "add-on" && (
          <div className="mt-2.5 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              {addOn}
            </span>
            <input
              className={classNames(
                "block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500",
                error
                  ? "border-red-300  focus:border-red-500 focus:ring-red-500"
                  : ""
              )}
              placeholder={placeholder}
              type={type}
              {...rest}
              ref={ref}
            />
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      {info && <p className="mt-2 text-sm text-gray-600">{info}</p>}
    </div>
  );
}

export default React.forwardRef<
  HTMLInputElement,
  TextInputProps & (DefaultInputProps | IconInputProps | AddonInputProps)
>(TextInput);
