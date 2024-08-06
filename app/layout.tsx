import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AskMyPDF",
  description:
    "Upload your document, and our chatbot will answer questions, summarize content, and answer all your Qs. Ideal for everyone, Ask My PDF turns static documents into dynamic conversations, enhancing productivity 10x fold effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            inter.className,
            "min-h-screen h-screen overflow-hidden flex flex-col"
          )}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
