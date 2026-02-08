"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, PartyPopper } from "lucide-react";
import Link from "next/link";
import { ChatRoom } from "@/components/chat-room";

export default function ActivitiesConnectedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");

  const [showChat, setShowChat] = useState(false);
  const [data, setData] = useState<{
    matchName: string;
    sport: string;
    meetLocation: string;
    meetRequestId?: string;
    userName?: string;
    matchUser?: {
      name: string | null;
      age: number | null;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      router.replace("/activities");
      return;
    }

    const userId = localStorage.getItem("socialcue_user_id");
    fetch(`/api/activities/status?matchId=${matchId}&userId=${userId}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(() => router.replace("/activities"))
      .finally(() => setLoading(false));
  }, [matchId, router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  if (showChat && data?.meetRequestId) {
    return (
      <ChatRoom
        userName={data.userName || "Me"}
        matchName={data.matchName}
        matchId={data.meetRequestId}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 mb-4">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">You&apos;re connected!</h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100">
          <p className="text-xl text-muted-foreground mb-2">
            You&apos;re playing <span className="font-bold text-emerald-600">{data.sport}</span> with
          </p>
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-gray-900">{data.matchName}</span>
            {data.matchUser?.age && (
              <span className="text-sm font-medium text-muted-foreground bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Age {data.matchUser.age}
              </span>
            )}
          </div>
          <p className="text-xl text-muted-foreground mt-2">
            at <span className="font-bold">{data.meetLocation}</span>
          </p>
        </div>

        <p className="text-2xl font-bold text-emerald-600">Lessgoo! 🚀</p>

        <Card className="border-2 border-emerald-100 shadow-xl">
          <CardContent className="p-6 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-emerald-500 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Play location</p>
              <p className="text-muted-foreground">{data.meetLocation}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
            onClick={() => setShowChat(true)}
          >
            Join Chat & Plan
          </Button>

          <Link href="/categories">
            <Button variant="outline" className="w-full">
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
