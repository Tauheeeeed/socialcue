"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Sparkles, Flame } from "lucide-react";
import Link from "next/link";

export default function MeetPage() {
  const router = useRouter();
  const [duration, setDuration] = useState("");
  const [surpriseLevel, setSurpriseLevel] = useState(2); // 1: Low, 2: Medium, 3: High
  const [loading, setLoading] = useState(false);

  const handleSimilarInterests = async () => {
    if (!duration) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/meet/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          durationMinutes: parseInt(duration),
          surpriseMe: false,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push(`/meet/connected?matchId=${data.matchId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/meet/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          durationMinutes: parseInt(duration || "60"),
          surpriseMe: true,
          surpriseLevel,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push(`/meet/connected?matchId=${data.matchId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-lg mx-auto p-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to Categories
        </Link>

        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Meet New People</h1>
              <p className="text-muted-foreground">Find someone to connect with nearby</p>
            </div>
          </div>

          <Card className="border-2 border-violet-100 shadow-xl">
            <CardHeader>
              <CardTitle>How long are you free?</CardTitle>
              <CardDescription>
                We&apos;ll find someone available for the same time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30"
                  onClick={handleSimilarInterests}
                  disabled={loading || !duration}
                >
                  {loading ? "Finding match..." : "Find someone with similar interests"}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or surprise me</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-violet-50 rounded-xl border border-violet-100">

                  <style jsx global>{`
                    @keyframes flicker {
                      0% { transform: scale(1) rotate(0deg); opacity: 0.9; }
                      25% { transform: scale(1.05) rotate(2deg); opacity: 1; }
                      50% { transform: scale(0.95) rotate(-2deg); opacity: 0.8; }
                      75% { transform: scale(1.02) rotate(1deg); opacity: 1; }
                      100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
                    }
                    .animate-flicker {
                      animation: flicker 0.5s infinite alternate;
                    }
                  `}</style>

                  <div className="flex flex-col items-center gap-6 pt-4">
                    <Label className="text-center block text-violet-700 font-medium pb-4">
                      Surprise Level: <span className="font-bold">{surpriseLevel === 1 ? "Low" : surpriseLevel === 2 ? "Medium" : "High"}</span>
                    </Label>

                    {/* Custom Slider Container */}
                    <div className="relative w-full h-16 flex items-center px-4 max-w-xs mx-auto">

                      {/* 1. The Track */}
                      <div className="absolute left-4 right-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                        {/* Fill based on value */}
                        <div
                          className={`h-full transition-all duration-300 ${surpriseLevel === 1 ? "bg-orange-300 w-[0%]" :
                              surpriseLevel === 2 ? "bg-orange-500 w-[50%]" :
                                "bg-red-600 w-[100%]"
                            }`}
                        />
                      </div>

                      {/* 2. The Thumb (Visual Only) - moves with state */}
                      <div
                        className="absolute pointer-events-none transition-all duration-300 ease-out flex items-center justify-center z-10"
                        style={{
                          left: `calc(${((surpriseLevel - 1) / 2) * 100}% + 16px - ${((surpriseLevel - 1) / 2) * 32}px)`
                          // Simple logic: 0% at level 1, 50% at level 2, 100% at level 3. 
                          // Adjusting specifically for layout padding.
                        }}
                      >
                        <div className={`
                                flex items-center justify-center rounded-full shadow-lg border-4 border-white
                                transition-all duration-300
                                ${surpriseLevel === 1 ? "w-10 h-10 bg-orange-100" : ""}
                                ${surpriseLevel === 2 ? "w-14 h-14 bg-orange-100" : ""}
                                ${surpriseLevel === 3 ? "w-16 h-16 bg-red-100" : ""}
                            `}>
                          <Flame
                            className={`
                                        transition-all duration-300 animate-flicker
                                        ${surpriseLevel === 1 ? "w-6 h-6 text-orange-500 fill-orange-500" : ""}
                                        ${surpriseLevel === 2 ? "w-8 h-8 text-orange-600 fill-orange-600" : ""}
                                        ${surpriseLevel === 3 ? "w-10 h-10 text-red-600 fill-red-600 drop-shadow-md" : ""}
                                    `}
                          />
                        </div>
                      </div>

                      {/* 3. The Input (Invisible but Interactive) */}
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="1"
                        value={surpriseLevel}
                        onChange={(e) => setSurpriseLevel(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                    </div>

                    <div className="flex justify-between w-full px-4 text-xs text-muted-foreground font-medium">
                      <span>Safe</span>
                      <span>Random</span>
                      <span>Anti-Match</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg border-2 border-violet-200 hover:bg-white hover:text-violet-700"
                    onClick={handleSurpriseMe}
                    disabled={loading}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Surprise Me!
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
