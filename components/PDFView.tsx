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
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);

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
        <div className="max-w-6xl px-2 grid grid-cols-3 gap-2">
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
        <div className="flex items-center justify-center min-h-screen overflow-y-scroll h-full w-full">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            rotate={rotation}
            className="m-4 overflow-scroll"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                className="shadow-lg mb-4"
              />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default PDFView;
