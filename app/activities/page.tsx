"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Plus, User, MapPin } from "lucide-react";
import Link from "next/link";

const DEFAULT_SPORTS = [
  "Tennis",
  "Basketball",
  "Soccer",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Swimming",
  "Running",
  "Cycling",
  "Gym",
];

const POLL_INTERVAL_MS = 2500;
const SEARCH_TIMEOUT_MS = 60_000;

type Profile = {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  location: string | null;
  interests: string[];
  likes: string[];
  dislikes: string[];
};

type MatchView = {
  sport: string;
  currentUser: Profile;
  matchUser: Profile;
  requestId: string;
};

function ProfileCard({
  profile,
  title,
  variant = "default",
}: {
  profile: Profile;
  title: string;
  variant?: "default" | "highlight";
}) {
  return (
    <Card
      className={`h-full border-2 ${variant === "highlight"
        ? "border-emerald-400 shadow-lg shadow-emerald-500/20"
        : "border-emerald-100"
        }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {profile.name && (
          <p className="font-medium">
            {profile.name}
            {profile.age ? <span className="text-muted-foreground font-normal">, {profile.age}</span> : ""}
          </p>
        )}
        {profile.location && (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {profile.location}
          </p>
        )}
        {profile.interests?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Interests</p>
            <p className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 5).map((i) => (
                <span
                  key={i}
                  className="inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs"
                >
                  {i}
                </span>
              ))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ActivitiesPage() {
  const [showAddSport, setShowAddSport] = useState(false);
  const [newSport, setNewSport] = useState("");
  const [sports, setSports] = useState(DEFAULT_SPORTS);
  const [findingSport, setFindingSport] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchView | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("socialcue_user_id") : null;

  const fetchProfile = async (id: string): Promise<Profile | null> => {
    const res = await fetch(`/api/profile/${id}`);
    if (!res.ok) return null;
    return res.json();
  };

  const applyMatch = async (sport: string, matchUserId: string, matchUserPayload: Profile | null, reqId: string) => {
    const current = await fetchProfile(userId!);
    const matchUser = matchUserPayload ?? (await fetchProfile(matchUserId));
    if (current && matchUser) {
      setMatch({ sport, currentUser: current, matchUser, requestId: reqId });
    }
    setFindingSport(null);
    setRequestId(null);
    setSearchError(null);
  };

  useEffect(() => {
    if (!findingSport || !requestId || !userId) return;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/activities/status?requestId=${requestId}&userId=${userId}`
        );
        const data = await res.json();
        if (data.error) return;
        if (data.status === "matched" && data.matchUserId) {
          if (pollRef.current) clearInterval(pollRef.current);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          await applyMatch(findingSport, data.matchUserId, data.matchUser ?? null, requestId);
        }
      } catch {
        // ignore poll errors
      }
    };

    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    timeoutRef.current = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      setFindingSport(null);
      setRequestId(null);
      setSearchError("No match found 🙁. Try again or pick another sport?");
    }, SEARCH_TIMEOUT_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [findingSport, requestId, userId]);

  const handleSportClick = async (sport: string) => {
    setSearchError(null);
    setMatch(null);
    try {
      const res = await fetch("/api/activities/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sport }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.matchUserId) {
        await applyMatch(sport, data.matchUserId, null, data.requestId);
        return;
      }

      setFindingSport(sport);
      setRequestId(data.requestId);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to find match");
    }
  };

  const handleAddSport = () => {
    if (newSport.trim() && !sports.includes(newSport.trim())) {
      setSports((prev) => [...prev, newSport.trim()]);
      setNewSport("");
      setShowAddSport(false);
    }
  };

  const loading = findingSport !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to Categories
        </Link>

        {match ? (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-emerald-800">You&apos;re matched!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProfileCard profile={match.currentUser} title="You" />
              <Card className="border-2 border-emerald-200 shadow-lg flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mb-4">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-1">{match.sport}</CardTitle>
                <CardDescription>Activity</CardDescription>
              </Card>
              <ProfileCard profile={match.matchUser} title="Match" variant="highlight" />
            </div>
            <div className="flex flex-col gap-3">
              <Link href={`/activities/connected?matchId=${match.requestId}`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" size="lg">
                  Start Chatting & Meet Up 🚀
                </Button>
              </Link>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setMatch(null);
                    setSearchError(null);
                  }}
                >
                  Find another
                </Button>
                <Link href="/categories" className="flex-1">
                  <Button variant="secondary" className="w-full">Back to Categories</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Activities</h1>
                <p className="text-muted-foreground">Find people to play with right now</p>
              </div>
            </div>

            {findingSport && (
              <Card className="border-2 border-emerald-200 bg-emerald-50/50">
                <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                  <p className="text-lg font-semibold">
                    Finding someone for <span className="text-emerald-600">{findingSport}</span>...
                  </p>
                  <p className="text-sm text-muted-foreground">Searching for up to 1 minute</p>
                </CardContent>
              </Card>
            )}

            {searchError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {searchError}
              </p>
            )}

            <Card className="border-2 border-emerald-100 shadow-xl">
              <CardHeader>
                <CardTitle>Sports</CardTitle>
                <CardDescription>
                  Click a sport to find people in your area who want to play
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {sports.map((sport) => (
                    <Button
                      key={sport}
                      variant="outline"
                      className="h-14 text-base border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400"
                      onClick={() => handleSportClick(sport)}
                      disabled={loading}
                    >
                      {findingSport === sport ? (
                        <span className="animate-pulse">Finding...</span>
                      ) : (
                        sport
                      )}
                    </Button>
                  ))}
                </div>

                {showAddSport ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new sport"
                      value={newSport}
                      onChange={(e) => setNewSport(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSport()}
                      className="flex-1 h-12 rounded-xl border-2 border-input px-4 text-base"
                    />
                    <Button onClick={handleAddSport}>Add</Button>
                    <Button variant="outline" onClick={() => setShowAddSport(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => setShowAddSport(true)}
                    disabled={loading}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add a sport
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
