"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, PartyPopper } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ProfileButton } from "@/components/profile-button";
import { ChatPreferencesButton } from "@/components/chat-preferences-button";

function MeetConnectedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const [data, setData] = useState<{
    matchName: string;
    meetLocation: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col">
      <div className="max-w-2xl mx-auto p-6 w-full flex-1 flex flex-col">
        <div className="flex justify-end pb-4">
          <ProfileButton />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-6 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 mb-4">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">You&apos;re connected!</h1>
        <p className="text-xl text-muted-foreground">
          You have to meet <span className="font-bold text-violet-500">{data.matchName}</span> at{" "}
          <span className="font-bold">{data.meetLocation}</span> now!
        </p>
        <p className="text-2xl font-bold text-violet-500">Lessgoo! 🚀</p>

        <Card className="border-2 border-violet-100 shadow-xl">
          <CardContent className="p-6 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-violet-500 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Meeting location</p>
              <p className="text-muted-foreground">{data.meetLocation}</p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <BackLink href="/categories" label="Categories" />
      <ChatPreferencesButton />
    </div>
  );
}

export default function ConnectedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
          <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
        </div>
      }
    >
      <MeetConnectedContent />
    </Suspense>
  );
}
