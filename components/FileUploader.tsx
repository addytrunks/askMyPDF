"use client";

import { useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import { MAX_FILE_SIZE } from "@/constants";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const FileUploader = () => {
  const { toast } = useToast();
  const router = useRouter();

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
    ),
  };

  const { progress, status, fileId, handleUpload } = useUpload();
  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(({ code }) => {
          if (code === "file-too-large") {
            toast({
              title: "File too large",
              variant: "destructive",
              description: `The file is too large, please upload a file smaller than ${Math.floor(
                MAX_FILE_SIZE / 1000000
              )}MB`,
            });
          } else if (code === "file-invalid-type") {
            toast({
              title: "Invalid file type",
              variant: "destructive",
              description: "The file is not a PDF. Please upload a PDF file",
            });
          }
        });
      });

      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];

        if (file) {
          await handleUpload(file);
        }
      }
    },
    [toast, handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: MAX_FILE_SIZE,
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={cn(
              "radial-progress bg-indigo-300 text-white border-indigo-600 border-4",
              progress === 100 && "hidden"
            )}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12rem",
              thickness: "1.3rem",
            }}
          >
            {progress} %
          </div>

          {
            // @ts-ignore
            statusIcons[status]
          }
          {/* @ts-ignore */}
          <p className="text-indigo-600 animate-pulse">{status}</p>
        </div>
      )}
      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed mt-10 w-[90%]  border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center hover:cursor-pointer ${
            isFocused || isDragAccept || isDragActive
              ? "bg-indigo-300"
              : "bg-indigo-100"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>Drag & drop some files here, or click to select files</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
