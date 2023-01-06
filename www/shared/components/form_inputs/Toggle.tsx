import { Switch } from "@headlessui/react";
import classNames from "www/shared/utils/classNames";

interface ToggleProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  required?: boolean;
}

type LabelProps = {
  label: string;

  placement: "left" | "right";
};
type NoLabelProps = {
  label?: never;
  placement?: never;
};
export default function Toggle({
  placement = "left",
  label,
  disabled,
  value = false,
  onChange,
  error,
}: ToggleProps & (LabelProps | NoLabelProps)) {
  return (
    <Switch.Group as="div" className="flex items-center">
      {label && (
        <Switch.Label
          as="span"
          className={classNames("ml-3 cursor-pointer", placement === "left" ? "order-0 mr-3" : "order-1 ml-3")}
        >
          <span className="text-base leading-6 font-medium text-gray-600">{label}</span>
        </Switch.Label>
      )}
      <Switch
        disabled={disabled}
        checked={value}
        onChange={onChange}
        className={classNames(
          value ? "bg-green-700" : "bg-gray-200",
          error ? "text-red-600 border  border-red-500" : "",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-30"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            value ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
