import update from "immutability-helper";
import { useEffect } from "react";
import { useCallback, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import DraggableQuestionCard from "./DraggableQuestionCard";
const style = {
  width: "100%",
};
interface Faq {
  question: string;
  answer: string;
}
export interface DragItem {
  id: number;
  question: string;
  answer: string;
}
export type FormInputType = {
  faqs: Faq[];
};

const DraggableFaqContainer = ({
  faqs,
  setValue,
}: {
  faqs: Faq[];
  setValue: UseFormSetValue<FormInputType>;
}) => {
  {
    const [cards, setCards] = useState([
      ...faqs.map((faq, i: number) => ({ id: i, ...faq })),
    ]);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: DragItem[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as DragItem],
          ],
        })
      );
    }, []);

    const renderCard = useCallback(
      (
        card: { id: number; question: string; answer: string },
        index: number
      ) => {
        return (
          <DraggableQuestionCard
            key={card.id}
            index={index}
            id={index}
            moveCard={moveCard}
            question={card.question}
            answer={card.answer}
          />
        );
      },
      []
    );
    useEffect(() => {
      setValue(
        "faqs",
        cards.map((card: { id: number; question: string; answer: string }) => ({
          question: card.question,
          answer: card.answer,
        }))
      );
    }, [cards]);

    return (
      <>
        <div style={style}>
          {cards.map((card, i: number) => renderCard(card, i))}
        </div>
      </>
    );
  }
};
export default DraggableFaqContainer;
