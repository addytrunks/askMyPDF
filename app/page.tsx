import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
const features = [
  {
    name: "Store your PDF Documents",
    description:
      "Securely stash all your crucial PDFs for quick access anytime, anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing Fast Responses",
    description:
      "Get answers at lightning speed, ensuring you have the info you need in a flash.",
    icon: ZapIcon,
  },
  {
    name: "Smart Chat Memory ",
    description:
      "Our smart chatbot remembers past chats, giving you a smooth and tailored experience.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Viewer",
    description:
      "Dive into your PDFs with our engaging and user-friendly viewer.",
    icon: EyeIcon,
  },
  {
    name: "Cloud Safeguard",
    description:
      "Your documents are safely backed up in the cloud, protected against loss or damage.",
    icon: ServerCogIcon,
  },
  {
    name: "Device Compatibility",
    description:
      "Effortlessly access and chat with your PDFs on any device, be it desktop, tablet, or smartphone.",
    icon: MonitorSmartphoneIcon,
  },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600 ">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-lg">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Interactive Document Companion
            </h2>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your PDFs into Interactive Conversations
            </p>

            <p>
              Introducing{" "}
              <span className="font-bold text-indigo-600">Ask My PDF.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all your Qs. Ideal for
              everyone, <span className="text-indigo-600">Ask My PDF</span>{" "}
              turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>

          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
