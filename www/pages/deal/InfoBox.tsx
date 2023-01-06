import React from "react";
export interface InfoBoxProps {
  children: React.ReactNode;
}
function InfoBox(props: InfoBoxProps) {
  console.log(props);
  return (
    <section className="lg:col-span-1 lg:col-start-3">{props.children}</section>
  );
}

export default InfoBox;
