import { ReactNode } from "react";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (val: boolean) => void;
};

export function Checkbox({ checked, onChange, id }: CheckboxProps) {
  return (
    <input
      id={id}
      type="checkbox"
      className="h-4 w-4 rounded border-green-700 text-green-700 focus:outline-green-700"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}

type LabelProps = {
  label: string;
  description?: string;
  icon?: ReactNode;
};
export function CheckboxWithLabel({
  label,
  icon,
  description,
  ...checkboxProps
}: CheckboxProps & LabelProps) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <Checkbox {...checkboxProps} />
      </div>
      <div className="ml-3 text-sm flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <label className="font-medium text-gray-700">{label}</label>
        {description && <span className="text-gray-500">{description}</span>}
      </div>
    </div>
  );
}
