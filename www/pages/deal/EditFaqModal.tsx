import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import TextArea from "www/shared/components/form_inputs/TextArea";
import TextInput from "www/shared/components/form_inputs/TextInput";
import ReactTooltip from "react-tooltip";
import { useForm, useFieldArray } from "react-hook-form";
import { DealFaq } from "types/views";
import { useMutation, useQueryClient } from "react-query";
import { addFaqs, updateFaqs } from "./EditFaqModal.fetchers";
import { toast } from "react-toastify";
import { invalidateDealViews } from "./Deal.fetchers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableFaqContainer from "./DraggableFaqContainer";

import ModalHeader from "../../shared/components/modal/ModalHeader";

export type FormInputType = {
  faqs: {
    question: string;
    answer: string;
  }[];
};

export default function EditFaqModal({
  dealFaqs,
  dealId,
  openEditFaqModal,
  setOpen,
  title,
}: {
  dealFaqs?: DealFaq[];
  dealId: number;
  openEditFaqModal: (state: boolean) => void;
  setOpen: (open: boolean) => void;
  title: string;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm<FormInputType>({
    reValidateMode: "onChange",
    defaultValues: useMemo(
      () => ({
        faqs: [
          {
            question: "",
            answer: "",
          },
        ],
      }),
      []
    ),
  });

  const { fields, append, remove } = useFieldArray({
    name: "faqs",
    control,
  });

  useEffect(() => {
    if (dealFaqs) {
      const faqs = dealFaqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }));

      reset({
        faqs: [...faqs],
      });
    } else {
      reset({
        faqs: [
          {
            question: "",
            answer: "",
          },
        ],
      });
    }
  }, [reset, dealFaqs, getValues]);

  const createFaqsMutation = useMutation(addFaqs);
  const updateDealFaqsMutation = useMutation(updateFaqs);

  const createDealFaqs = async (data: FormInputType) => {
    const faqs = data.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
    const response = await createFaqsMutation.mutateAsync({ faqs, dealId });
    if (response?.data) {
      console.log("response", response);
      toast.success("Faqs added successfully");
      invalidateDealViews(queryClient);

      openEditFaqModal(false);
    }
    if (response?.error) {
      toast.error("Error adding faqs");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };

  const updateDealFaqs = async (data: FormInputType) => {
    const response = await updateDealFaqsMutation.mutateAsync({
      currentFaqs: data.faqs,
      dealId,
      previousFaqs: dealFaqs || [],
    });
    if (response?.data) {
      console.log("response", response);
      toast.success("Faqs added successfully");
      invalidateDealViews(queryClient);
      openEditFaqModal(false);
    }
    if (response?.error) {
      toast.error("Error adding faqs");
      toast.error(response.error.message, {
        hideProgressBar: true,
      });
      console.log("Error", response.error);
    }
  };

  const [orderCards, setOrderCards] = useState<boolean>(false);

  return (
    <div className="inline-block align-bottom bg-white rounded-lg  pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[815px] sm:w-full  overflow-y-hidden h-full max-h-[68%] relative">
      <ModalHeader title={title} setOpen={setOpen} />
      <div className="h-[74%] overflow-auto mt-[65px] mb-[80px]">
        <div className="flex flex-col space-y-5 w-full px-4 mb-5 ">
          <div className="space-y-3">
            <button
              className="text-gray-500  border border-gray-300 pl-[14px] pr-3 rounded-md text-sm leading-5 font-semibold py-2"
              onClick={() => {
                setOrderCards(!orderCards);
              }}
            >
              {orderCards ? (
                "Back to edit"
              ) : (
                <span className="flex gap-2 items-center">
                  <AnchorIcon />
                  Change the order
                </span>
              )}
            </button>
            <hr className=" text-gray-300" />
          </div>
          {/* Form area */}
          {/* Card */}
          {orderCards ? (
            <DndProvider backend={HTML5Backend}>
              <DraggableFaqContainer
                faqs={getValues("faqs")}
                setValue={setValue}
              />
            </DndProvider>
          ) : (
            <div className="">
              {fields.map((faq, index: number) => (
                <div className="flex flex-col space-y-3" key={faq.id}>
                  <div className="flex justify-between mt-6">
                    <p className="text-base leading-6 font-extrabold text-gray-600">
                      Question {index + 1}
                    </p>
                    <button
                      className="flex justify-self-auto"
                      data-tip
                      data-for="global"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="h-3 w-3 text-gray-500 p-2 rounded-md border border-gray-500 hover:text-red-500 hover:border-red-500"
                        onClick={() => remove(index)}
                      />
                    </button>
                  </div>
                  <TextInput
                    placeholder="Enter your question"
                    containerClassName=""
                    {...register(`faqs.${index}.question`, {
                      required: true,
                    })}
                    error={errors?.faqs?.[index]?.question ? true : false}
                  />
                  <TextArea
                    placeholder="Provide an answer"
                    rows={4}
                    {...register(`faqs.${index}.answer`, {
                      required: true,
                    })}
                    error={errors?.faqs?.[index]?.answer ? true : false}
                  />
                  <ReactTooltip
                    id="global"
                    aria-haspopup="true"
                    place="top"
                    arrowColor="transparent"
                    backgroundColor="transparent"
                    className="z-[100]"
                    class="z-[120]"
                  >
                    <div className="bg-gray-900 text-gray-500 text-xs px-3 py-2 rounded-md w-[132px]">
                      <p className="text-sm leading-5 font-medium text-white">
                        Delete Question
                      </p>
                    </div>
                  </ReactTooltip>
                </div>
              ))}
              <hr className="mt-5" />
              <div className="mb-12 mt-5">
                <button
                  className="p-2 border border-green-700 text-green-700 inline-block text-sm leading-5 font-semibold rounded-md"
                  onClick={() => append({ question: "", answer: "" })}
                >
                  Add Question
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white px-8 py-[24.5px] h-[103px] absolute bottom-0 w-full flex space-x-3 justify-end shadow-2xl">
          <button
            className="px-5 py-3 bg-transparent border border-gray-500 text-gray-500 rounded-[6px] text-base font-semibold disabled:bg-green-900 text white disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-green-800"
            onClick={() => {
              openEditFaqModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-5 py-3 bg-green-700 rounded-[6px] text-base font-semibold disabled:bg-green-900 text white disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-green-800"
            onClick={handleSubmit((d) => {
              dealFaqs ? updateDealFaqs(d) : createDealFaqs(d);
            })}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const AnchorIcon = () => {
  return (
    <svg
      width="8"
      height="16"
      viewBox="0 0 8 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.68928 11.8107H5.24994V4.18937H6.68928C7.35747 4.18937 7.6921 3.38152 7.21963 2.90902L4.53028 0.21968C4.23738 -0.0732266 3.76253 -0.0732266 3.46963 0.21968L0.780283 2.90902C0.307814 3.38149 0.642439 4.18937 1.31063 4.18937H2.74994V11.8107H1.3106C0.642408 11.8107 0.307783 12.6185 0.780252 13.091L3.4696 15.7804C3.7625 16.0733 4.23735 16.0733 4.53025 15.7804L7.2196 13.091C7.6921 12.6186 7.35747 11.8107 6.68928 11.8107Z"
        fill="#374151"
      />
    </svg>
  );
};
