import Chat from "@/components/Chat";
import PDFView from "@/components/PDFView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { userId } = auth();

  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(params.id)
    .get();

    const title = ref.data()?.name as string;
    const slicedTitle = title.slice(0, -4);
  return {
    title: slicedTitle
  };
}

const ChatToFilePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  auth().protect();

  const { userId } = auth();

  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

  const URL = ref.data()?.downloadURL;
  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      <div className="lg:col-span-2 overflow-y-auto">
        <Chat id={id} />
      </div>

      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        <PDFView url={URL} />
      </div>
    </div>
  );
};

export default ChatToFilePage;
