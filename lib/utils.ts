import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { adminDb } from "@/firebaseAdmin";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { auth } from "@clerk/nextjs/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace provided");

  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateDocs(docId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  console.log("--- Fetching the download URL from firestore ---");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadURL = firebaseRef.data()?.downloadURL;

  if (!downloadURL) {
    throw new Error("Download URL not found");
  }

  console.log("--- Fetched download URL successfully ---");

  // Download the file from the URL
  const response = await fetch(downloadURL);

  const data = await response.blob();

  console.log("--- Loading PDF file ---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  console.log("--- Splitting the document into smaller parts/chunks ---");

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);

  return splitDocs;
}
