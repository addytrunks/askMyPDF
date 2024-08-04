"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "./ui/button";

// Make sure to update CORS settings

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFView = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchFile = async () => {
      const res = await fetch(url);
      const blob = await res.blob();
      setFile(blob);
    };
    fetchFile();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="sticky top-0 z-50 bg-gray-100/80 backdrop-blur-md p-2 rounded-b-l shadow-md ">
        <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
          <Button
            variant="outline"
            disabled={pageNumber === 1}
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
          >
            Previous
          </Button>

          <p className="flex items-center justify-center">
            {pageNumber} of {numPages}
          </p>

          <Button
            variant="outline"
            disabled={pageNumber === numPages}
            onClick={() => {
              if (numPages) {
                if (pageNumber < numPages) {
                  setPageNumber(pageNumber + 1);
                }
              }
            }}
          >
            Next
          </Button>

          <Button
            variant="outline"
            onClick={() => setRotation((rotation + 90) % 360)}
          >
            <RotateCw />
          </Button>

          <Button
            variant="outline"
            disabled={scale >= 1.5}
            onClick={() => {
              setScale(scale * 1.2);
            }}
          >
            <ZoomInIcon />
          </Button>

          <Button
            variant="outline"
            disabled={scale <= 0.75}
            onClick={() => setScale(scale / 1.2)}
          >
            <ZoomOutIcon />
          </Button>
        </div>
      </div>
      {!file ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2Icon className="animate-spin h-16 w-16 text-indigo-600 mt-20" />
        </div>
      ) : (
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          rotate={rotation}
          className="m-4 overflow-scroll"
        >
          <Page pageNumber={pageNumber} scale={scale} className="shadow-lg" />
        </Document>
      )}
    </div>
  );
};

export default PDFView;
