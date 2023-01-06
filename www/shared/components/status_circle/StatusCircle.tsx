import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StatusCircleProps } from "./StatusCircle.types";

export default function StatusCircle(props: StatusCircleProps) {
  return (
    <FontAwesomeIcon
      icon={faCircle}
      className={`${props.color} w-2 h-2 mb-1.5`}
    />
  );
}
