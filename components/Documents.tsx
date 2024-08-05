import React from "react";
import PlaceholderDocument from "./PlaceholderDocument";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import Document from '@/components/Document'

const Documents = async () => {
  auth().protect();

  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();
  return (
    <div className="flex flex-wrap p-5 bg-gray-50 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
      {documentsSnapshot.docs.map((doc) => {
        const { name, downloadURL:downloadUrl, size } = doc.data();
        console.log(doc.data());

        return (
          <Document
            key={doc.id}
            id={doc.id}
            name={name}
            size={size}
            downloadUrl={downloadUrl}
          />
        );
      })}
      <PlaceholderDocument />
    </div>
  );
};

export default Documents;
