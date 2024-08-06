"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { Button } from "./ui/button";
import { DownloadCloud, Loader2Icon, Trash2Icon } from "lucide-react";
import { deleteDocument } from "@/actions/deleteDocument";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const Document = ({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) => {
  const router = useRouter();
  const [isDeleting, startTransaction] = useTransition();
  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-indigo-600 hover:text-white cursor-pointer group">
      <div
        className="flex-1"
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
      >
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-100">
          {size > 1024 ** 2
            ? `${parseInt(byteSize(size).value) / 1024} MB`
            : `${byteSize(size).toString()}`}
        </p>
      </div>

      <div className="flex space-x-2 justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="hover:border-2 hover:border-red-500 "
              disabled={isDeleting}
            >
              <div className="flex items-center space-x-2">
                {isDeleting && <Loader2Icon className="w-6 h-6 animate-spin" />}
                <Trash2Icon className="h-6 w-6 text-red-500" />
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this document? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  startTransaction(async () => {
                    await deleteDocument(id);
                  });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="outline"
          className="hover:border-2 hover:border-indigo-400"
          asChild
        >
          <a href={downloadUrl}>
            <DownloadCloud className="h-6 w-6 text-indigo-600" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Document;
