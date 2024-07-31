"use client";

import { useCallback } from "react";
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

const FileUploader = () => {
  const { toast } = useToast();
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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
              description: 'The file is not a PDF. Please upload a PDF file',
            });
          }
        });
      });

      if (acceptedFiles.length > 0) {
        console.log("File uploaded successfully");
      }
    },
    [toast]
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
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
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
    </div>
  );
};

export default FileUploader;
