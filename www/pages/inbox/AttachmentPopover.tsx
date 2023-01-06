import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useGlobalState } from "www/shared/modules/global_context";
import UploadBox from "www/shared/components/form_inputs/UploadBox";
import { InboxPopoverBodyItem, InboxPopoverHeader } from "./InboxPopover";
import { SimpleAlert } from "www/shared/components/modal/SimpleAlert";
import TextInput from "www/shared/components/form_inputs/TextInput";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  AttachmentPopoverQuerykey,
  getDealFilenames,
  uploadFileAttachment,
} from "./AttachmentPopover.fetchers";

export function AttachmentPopover({
  onSelectAttachment,
}: {
  onSelectAttachment: (fileNameId: number) => void;
}) {
  const queryClient = useQueryClient();

  const dealOptions = useGlobalState((s) => s.sponsorDeals).map((deal) => {
    return {
      value: deal.id,
      label: deal.title!,
      deal,
    };
  });
  const [selectedDeal, setSelectedDeal] = useState(dealOptions[0]);
  useEffect(() => {
    if (!selectedDeal && dealOptions.length > 0) {
      setSelectedDeal(dealOptions[0]);
    }
  }, [dealOptions, selectedDeal]);

  const { data: filenameData } = useQuery({
    queryKey: [AttachmentPopoverQuerykey.Filenames, selectedDeal?.value],
    queryFn: () => getDealFilenames(selectedDeal?.value),
  });
  const filenames = filenameData?.data || [];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const uploadFileAttachmentMutation = useMutation(uploadFileAttachment);
  const onUpload = async (filename: string, extension: string) => {
    await uploadFileAttachmentMutation.mutateAsync({
      deal_id: selectedDeal.value,
      file: uploadedFile!,
      filename,
      extension,
    });
    setUploadedFile(null);

    queryClient.invalidateQueries([AttachmentPopoverQuerykey.Filenames]);
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (uploadedFile) {
          return;
        }

        setIsPopoverOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [containerRef, uploadedFile]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => {
          setIsPopoverOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faPaperclip}
          className="hover:cursor-pointer hover:text-gray-900"
        />
      </button>
      {isPopoverOpen && (
        <div className="absolute z-10 bg-white w-[320px] shadow-lg rounded-md overflow-y-auto bottom-0 left-8 border border-gray-100">
          <div className="p-2" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base leading-6 font-semibold mb-1">
              Documents for deal:
            </h2>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable={false}
              name="chooseDeal"
              options={dealOptions}
              value={selectedDeal}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setSelectedDeal(selectedOption);
                }
              }}
            />
          </div>
          <UploadBox
            className="min-h-[200px]"
            onUpload={(_file) => {
              setUploadedFile(_file);
            }}
          />
          {filenames.map((filename) => {
            return (
              <Fragment key={filename.id}>
                <InboxPopoverHeader title={filename.filename} />
                <InboxPopoverBodyItem>
                  <button
                    onClick={() => {
                      onSelectAttachment(filename.id);
                      setIsPopoverOpen(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPaperclip}
                      className="hover:cursor-pointer hover:text-gray-900 mr-2"
                    />
                    <span className="text-green-700 text-sm leading-5 font-semibold">
                      Version 1
                    </span>
                  </button>
                </InboxPopoverBodyItem>
              </Fragment>
            );
          })}
        </div>
      )}
      {uploadedFile && (
        <StoreFilename
          defaultFilename={uploadedFile.name}
          onSave={onUpload}
          onCancel={() => {
            setUploadedFile(null);
          }}
        />
      )}
    </div>
  );
}

function StoreFilename({
  defaultFilename,
  onSave,
  onCancel,
}: {
  defaultFilename: string;
  onSave: (filename: string, extension: string) => void;
  onCancel: () => void;
}) {
  const [fileName, setFilename] = useState(defaultFilename.split(".")[0]);
  const extension = defaultFilename.split(".")[1];

  return (
    <SimpleAlert
      open={true}
      setOpen={onCancel}
      title="Filename"
      primaryOptions={{
        label: "Save",
        onClick: () => onSave(fileName, extension),
      }}
      secondaryOptions={{
        label: "Cancel",
        onClick: onCancel,
      }}
      description={
        <div className="w-full mt-3">
          <TextInput
            value={fileName}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
      }
    />
  );
}
