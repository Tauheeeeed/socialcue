"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileCreating, setProfileCreating] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let userId = localStorage.getItem("socialcue_user_id");
    if (!userId) {
      fetch("/api/user/me")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          localStorage.setItem("socialcue_user_id", data.id);
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: "What are your top 2–3 hobbies or interests?",
            },
          ]);
        })
        .catch(() => router.replace("/"));
      return;
    }
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "What are your top 2–3 hobbies or interests?",
      },
    ]);
  }, [router]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        },
      ]);

      if (data.profileReady) {
        setShowNextButton(true);
        // Auto-save profile and go to categories
        const uid = localStorage.getItem("socialcue_user_id");
        if (uid) {
          setProfileCreating(true);
          fetch("/api/profile/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: uid,
              lastMessage: userMessage.content,
              chatHistory: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
            }),
          })
            .then(() => router.push("/categories"))
            .catch((err) => {
              console.error("Profile creation failed:", err);
              setProfileCreating(false);
            });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, something went wrong. Can you tell me more about your interests?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    const userId = localStorage.getItem("socialcue_user_id");
    if (!userId) return;
    setProfileCreating(true);
    try {
      await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lastMessage: messages.filter((m) => m.role === "user").pop()?.content ?? "",
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      router.push("/categories");
    } catch (err) {
      console.error("Profile creation failed:", err);
      setProfileCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Let&apos;s get to know you</h1>
            <p className="text-sm text-muted-foreground">
              Share your interests, likes & dislikes
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-card border-violet-100"
                }`}
              >
                <CardContent className="p-4">
                  {msg.role === "assistant" ? (
                    <div className="text-sm leading-relaxed [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_strong]:font-semibold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="bg-card border-violet-100">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft" />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft [animation-delay:0.4s]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {profileCreating && (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
              <p className="text-sm text-muted-foreground">Saving your profile...</p>
            </div>
          )}
          {showNextButton && !profileCreating && (
            <div className="flex flex-col items-center py-6 gap-4">
              <p className="text-sm text-muted-foreground">Profile saved. Pick categories next.</p>
              <Button
                onClick={() => router.push("/categories")}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                Go to categories
              </Button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!profileCreating && (
          <div className="flex flex-col gap-3 pt-4">
            {showNextButton ? (
              <Button
                className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600"
                onClick={createProfile}
                disabled={profileCreating}
              >
                Next → Categories
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Your answer..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={loading}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
