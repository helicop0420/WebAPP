import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faUpload } from "@fortawesome/pro-light-svg-icons";
import { faImage } from "@fortawesome/pro-regular-svg-icons";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import classNames from "www/shared/utils/classNames";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface UploadBoxExtendedProps {
  className?: string;
  onUpload: (file: File) => void;
  error?: boolean;
  filled?: boolean;
  image?: string | null | File;
  deleteImage?: () => void;
}

function UploadBox(
  props: UploadBoxExtendedProps,
  ref: React.Ref<HTMLInputElement>
) {
  const { onUpload, error, filled, image, deleteImage, className = "" } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (files) => {
      onUpload(files[0]);
    },
    onDropAccepted: (_files, _event) => {
      setUploadError(false);
    },
    onDropRejected: (_fileRejections, _event) => {
      alert("Error");
    },
    onDragEnter: (_event) => {
      setIsDragging(true);
    },
    onDragLeave: (_event) => {
      setIsDragging(false);
    },

    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const removeImage = () => {
    deleteImage?.();
  };
  const changeImage = () => {
    open();
  };

  const imageFile = React.useMemo(() => {
    if (image === null) {
      return null;
    }
    if (typeof image === "string") {
      return image;
    }
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return null;
  }, [image]);

  return (
    <div
      className={classNames(
        className,
        "bg-gray-200 flex flex-col justify-center items-center hover:bg-gray-300 hover:border-gray-600",
        error ? "bg-red-100 border-red-700" : "",
        isDragging ? "bg-gray-300 border-gray-600" : "",
        uploadError ? "bg-red-100 border-red-700" : "",
        filled ? "border-0 group/item" : ""
      )}
    >
      {filled ? (
        <div className="relative h-full">
          <div className="text-red-700 invisible group-hover/item:text-yellow-900 group-hover/item:visible absolute z-10 w-full h-full bg-gradient-to-r from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.5)] rounded-lg">
            <div className="flex space-x-4 justify-center items-center w-full h-full">
              <div className="p-[7px] rounded-full bg-white h-[30px] w-[30px] flex justify-center items-center ">
                <FontAwesomeIcon
                  icon={faImage}
                  className="text-gray-600 h-4 w-4 hover:cursor-pointer"
                  onClick={changeImage}
                />
              </div>
              <div className="p-[7px] rounded-full bg-white h-[30px] w-[30px] flex justify-center items-center ">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-gray-600 h-4 w-4 hover:cursor-pointer"
                  onClick={removeImage}
                />
              </div>
            </div>
          </div>
          <Image
            src={imageFile ? imageFile : "/test_company.png"}
            className="rounded-lg"
            alt="pics"
            width={139}
            height={88}
            onLoad={() => {
              URL.revokeObjectURL(imageFile ? imageFile : "/test_company.png");
            }}
          />
        </div>
      ) : (
        <div
          {...getRootProps({
            className:
              "dropzone cursor-pointer w-[139px] h-[88px] flex flex-col justify-center items-center",
          })}
        >
          <FontAwesomeIcon icon={faUpload} className="text-gray-600 h-4 w-4" />
          <input {...getInputProps()} ref={ref} />
          <p className="text-xs leading-4 font-semibold mt-1.5 text-gray-500">
            Click to upload
          </p>
          <p className="text-xs leading-4 font-normal text-gray-500">
            or drag and drop
          </p>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef<HTMLInputElement, UploadBoxExtendedProps>(
  UploadBox
);
