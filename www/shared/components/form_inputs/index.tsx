import React from "react";

import { Badge } from "www/shared/components/Badge";
import Select, { GroupBase, MultiValueProps } from "react-select";
import { SelectComponents } from "react-select/dist/declarations/src/components";

type MultiSelectProps<T> = React.ComponentProps<typeof Select<T, true>>;

// MultiSelect component structured from "react-select" docs
// Can pass in custom Option component like `EditConversation.tsx` does
export function MultiSelect<T>({
  options,
  value,
  placeholder,
  components,
  getOptionLabel,
  getOptionValue,
  onChange,
}: {
  options: T[];
  value: T[];
  components?: Partial<SelectComponents<T, true, GroupBase<T>>>;
} & Pick<
  MultiSelectProps<T>,
  "getOptionLabel" | "getOptionValue" | "onChange" | "placeholder"
>) {
  return (
    <Select<T, true>
      options={options}
      isMulti
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      value={value}
      onChange={onChange}
      components={{
        ...components,
        MultiValue: MultiSelectBadge,
        IndicatorsContainer: () => null,
      }}
      placeholder={placeholder}
    />
  );
}

function MultiSelectBadge<T>(props: MultiValueProps<T, true, GroupBase<T>>) {
  return (
    <div className="mr-1">
      <Badge
        bgColorClassName="bg-green-700"
        textColorClassName="text-white"
        size="small"
        name={props.children}
        onDelete={(event) => props.removeProps.onClick?.(event)}
      />
    </div>
  );
}
