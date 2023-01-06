import React from "react";
import ReactTooltip from "react-tooltip";

type TooltipType = "dark" | "light" | "warning" | "info" | "success" | "error";
type Effect = "solid" | "float";
type Placement = "top" | "bottom" | "left" | "right";
interface ToolTipProps {
  children: React.ReactNode;
  element: React.ReactNode;
  type?: TooltipType;
  placement?: Placement;
  effect?: Effect;
}

export default function ToolTip({
  children,
  element,
  type = "dark",
  placement = "top",
  effect = "solid",
}: ToolTipProps) {
  return (
    <>
      <a data-tip data-for="sadFace">
        {children}
      </a>
      <ReactTooltip type={type} effect={effect} place={placement}>
        <span>{element}</span>
      </ReactTooltip>
    </>
  );
}
