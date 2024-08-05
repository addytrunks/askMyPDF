"use client";

import { Message } from "@/lib/types";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { db } from "@/firebase";
import { useToast } from "./ui/use-toast";
import { askQuestion } from "@/actions/askQuestion";

const Chat = ({ id }: { id: string }) => {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (!snapshot) return;

    // get last message to check if it's from the AI
    const lastMessage = messages.pop();

    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      // remove the last message from the list
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });
    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;
    setInput("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      console.log("DEBUG", success, message);

      if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });

        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Whoops... ${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className="flex-1 w-full">
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>

      <form
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Ask a Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2Icon className="animate-spin text-indigo-600" />
            </div>
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Chat;
