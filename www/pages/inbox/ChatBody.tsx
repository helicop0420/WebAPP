import React, { useEffect, useRef, useState } from "react";
import Image from "next/future/image";
import { ConversationMessage } from "types/views";
import {
  faCircle,
  faPaperclip,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import ChatAttachment from "./ChatAttachment";
import { clientSupabase } from "www/shared/modules/supabase";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useOnScreen } from "www/shared/utils/hooks/useOnScreen";
import Skeleton from "react-loading-skeleton";

interface ChatBodyProps {
  chatContent: ConversationMessage;
}
export default function ChatBody({ chatContent }: ChatBodyProps) {
  const {
    created_at,
    sender_user_first_name,
    sender_user_last_name,
    sender_user_profile_pic_url,
    content,
    deal_about,
    deal_handle,
    deal_title,
    deal_image,
    on_deal_id,
  } = chatContent;

  return (
    <div>
      <div className="flex flex-row h-full mr-4.5">
        <div className="mr-4 mb-2 overflow-hidden flex flex-none">
          {sender_user_profile_pic_url ? (
            <Image
              src={sender_user_profile_pic_url}
              alt="Profile Picture"
              className="rounded-full w-11 h-11 object-cover"
              width={45}
              height={45}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 rounded-full w-11 h-11"
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-row">
            <p className="text-sm leading-5 font-semibold mt-1">
              {sender_user_first_name}
              {"  "}
              {sender_user_last_name}
            </p>
            <div className="h-full content-center ml-2 mr-2 pt-0.5">
              <FontAwesomeIcon
                icon={faCircle}
                className="text-gray-500 w-1 h-1 mb-1.5"
              />
            </div>
            <p className="text-sm leading-5 font-light text-gray-500 pt-1">
              {format(new Date(created_at), "h:MM aa")}
            </p>
          </div>
          <p className="text-sm leading-5 font-normal w-4/5 mb-2.5">
            {content}
          </p>
          {chatContent.attachment_filename && (
            <FileAttachment
              filename={chatContent.attachment_filename}
              attachment_url={chatContent.attachment_url}
              filesize={chatContent.attachment_size_in_bytes}
            />
          )}
          {on_deal_id ? (
            <ChatAttachment
              dealTitle={deal_title}
              dealAbout={deal_about}
              dealHandle={deal_handle}
              dealImage={deal_image}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

function FileAttachment({
  filename,
  filesize,
  attachment_url,
}: {
  filename: string;
  filesize: number;
  attachment_url: string;
}) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [downloadState, setDownloadState] = useState<
    "idle" | "downloading" | "downloaded" | "error"
  >("idle");
  const defaultLayoutPluginInstance = defaultLayoutPlugin({});
  const ref: any = useRef<HTMLButtonElement>();
  const onScreen = useOnScreen(ref, "0px");
  const isPDF = attachment_url.endsWith(".pdf");

  useEffect(() => {
    if (isPDF && onScreen && downloadState === "idle") {
      setDownloadState("downloading");
      clientSupabase.storage
        .from("private")
        .download(`${attachment_url}`)
        .then((res) => {
          if (res.data) {
            const url = URL.createObjectURL(res.data);
            setPdfUrl(url);
          }
        })
        .finally(() => {
          setDownloadState("downloaded");
        });
    }
  }, [attachment_url, downloadState, onScreen]);

  const onClick = async () => {
    if (downloadState === "downloading") {
      return;
    }

    const { data } = await clientSupabase.storage
      .from("private")
      .download(`${attachment_url}`);

    if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <button
        className="text-sm text-green-700 mb-3"
        onClick={onClick}
        ref={ref}
      >
        <FontAwesomeIcon icon={faPaperclip} />
        <span className=" font-semibold ml-1">{filename}</span>
        <span className="mx-0.5">•</span>
        <span className="text-xs leading-4 font-normal text-gray-400">
          {filesize / 1000} kb
        </span>
      </button>
      {isPDF && (
        <div className="h-[300px] mb-4">
          {downloadState !== "downloaded" && downloadState !== "error" && (
            <Skeleton height={300} />
          )}
          {pdfUrl && downloadState === "downloaded" && (
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
          )}
        </div>
      )}
    </>
  );
}
