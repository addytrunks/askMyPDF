import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("Pinecone API key not found");
}

export const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
