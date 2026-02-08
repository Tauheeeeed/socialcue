"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, PartyPopper } from "lucide-react";
import Link from "next/link";

import { ChatRoom } from "@/components/chat-room";

export default function ConnectedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const [data, setData] = useState<{
    matchName: string;
    userName: string;
    meetLocation: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!matchId) {
      router.replace("/meet");
      return;
    }

    const userId = localStorage.getItem("socialcue_user_id");
    fetch(`/api/meet/status?matchId=${matchId}&userId=${userId}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(() => router.replace("/meet"))
      .finally(() => setLoading(false));
  }, [matchId, router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (showChat) {
    return (
      <ChatRoom
        userName={data.userName || "Me"}
        matchName={data.matchName}
        matchId={matchId || ""}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 mb-4">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">You&apos;re connected!</h1>
        <p className="text-xl text-muted-foreground">
          You have to meet <span className="font-bold text-violet-600">{data.matchName}</span> at{" "}
          <span className="font-bold">{data.meetLocation}</span> now!
        </p>
        <p className="text-2xl font-bold text-violet-600">Lessgoo! 🚀</p>

        <Card className="border-2 border-violet-100 shadow-xl">
          <CardContent className="p-6 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-violet-500 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Meeting location</p>
              <p className="text-muted-foreground">{data.meetLocation}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg"
            onClick={() => setShowChat(true)}
          >
            Join Chat & Plan
          </Button>

          <Link href="/categories" className="block">
            <Button variant="outline" className="w-full h-12">
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
