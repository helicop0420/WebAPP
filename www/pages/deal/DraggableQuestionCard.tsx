import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Identifier, XYCoord } from "dnd-core";
import type { CSSProperties, FC } from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { faGripLines } from "@fortawesome/pro-solid-svg-icons";

export const DraggableItemTypes = {
  CARD: "card",
};
const style: CSSProperties = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
};

const handleStyle: CSSProperties = {
  display: "inline-block",
  cursor: "move",
};
export interface CardProps {
  id: any;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  question: string;
  answer: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableQuestionCard: FC<CardProps> = ({
  id,
  index,
  moveCard,
  question,
  answer,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: DraggableItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ opacity }, drag, preview] = useDrag({
    type: DraggableItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  drag(drop(ref));
  return (
    <div
      ref={preview}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
      className="flex flex-col space-y-3 shadow-lg rounded-lg border border-gray-200"
    >
      <div className="flex justify-between mt-6">
        <p className="text-base leading-6 font-extrabold text-gray-600">
          Question{"  "}
          {index + 1}
        </p>
      </div>
      <div className="py-4 pl-[22px] flex gap-4">
        <div className="" ref={ref} style={handleStyle}>
          <FontAwesomeIcon
            icon={faGripLines}
            className="w-[14px] h-4 text-gray-900 font-normal"
          />
        </div>
        <div className="">
          <p className="text-sm leading-5 font-normal text-gray-900">
            {question}{" "}
          </p>
          <p className="text-sm leading-5 font-normal mt-3 text-gray-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DraggableQuestionCard;
