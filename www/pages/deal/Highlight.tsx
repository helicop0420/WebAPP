import * as React from "react";
export interface HighlightProps {
  class: string;
  value: string;
  title: string;
}
const Highlight = (props: HighlightProps) => (
  <div className={props.class}>
    <h1 className="text-green-700 text-2xl leading-8 font-extrabold">
      {props.value}
    </h1>
    <h1 className="text-base leading-6 font-medium text-gray-500 ">
      {props.title}
    </h1>
  </div>
);

export default Highlight;
