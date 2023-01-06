import React from "react";
import classNames from "www/shared/utils/classNames";
interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  value?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  info?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  required?: boolean;
  rows?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea(props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) {
  const {
    label,
    info,
    error,
    rows,
    placeholder,
    required,
    errorMessage,
    containerClassName,
    name,
    className,
    ...rest
  } = props;
  return (
    <div className={containerClassName}>
      <div className=" sm:items-start sm:gap-4 ">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className={classNames(label ? "mt-2.5" : "", "w-full")}>
          <textarea
            name={name}
            rows={rows}
            className={classNames(
              "block w-full  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-gray-500 text-gray-900",
              className ? className : "",
              error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            )}
            defaultValue={""}
            placeholder={placeholder}
            {...rest}
            ref={ref}
          />
          {info && <p className="mt-2 text-sm text-gray-500">{info}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef<HTMLTextAreaElement, TextAreaProps>(TextArea);
