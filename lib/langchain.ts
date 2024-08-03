import { auth } from "@clerk/nextjs/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { pineconeClient } from "./pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { adminDb } from "@/firebaseAdmin";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
});

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace provided");

  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

async function generateDocs(docId: string) {
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

export const indexName = "addy";

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let pineconeVectorStore;

  console.log("---Generating embeddings.---");
  const embeddings = new OpenAIEmbeddings();

  const index = pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log("---Namespace already exists, reusing existing one---");

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    // If the namespace does not exist, downlaod the PDF from firestore ,generate embeddings and upload to pinecone
    console.log("---Namespace doesn't exists, creating new one---");
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
}
