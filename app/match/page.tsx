"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Dumbbell, Users } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ProfileButton } from "@/components/profile-button";
import { ChatPreferencesButton } from "@/components/chat-preferences-button";

const POLL_INTERVAL_MS = 2500;
const SEARCH_TIMEOUT_MS = 10_000;
const MIN_SPIN_MS = 3500;

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

function ProfileCard({
  profile,
  title,
  variant = "default",
  theme = "emerald",
}: {
  profile: Profile;
  title: string;
  variant?: "default" | "highlight";
  theme?: "emerald" | "violet";
}) {
  const borderClass =
    theme === "violet"
      ? variant === "highlight"
        ? "border-violet-300 shadow-lg shadow-violet-500/20"
        : "border-violet-100"
      : variant === "highlight"
        ? "border-emerald-300 shadow-lg shadow-emerald-500/20"
        : "border-emerald-100";
  const iconBg = theme === "violet" ? "bg-violet-100" : "bg-emerald-100";
  const iconColor = theme === "violet" ? "text-violet-600" : "text-emerald-600";

  return (
    <Card className={`h-full border-2 ${borderClass}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
            <User className={`w-5 h-5 ${iconColor}`} />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {profile.name && <p className="font-medium">{profile.name}</p>}
        {profile.location && (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {profile.location}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function MatchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "activities" | "meet"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    currentUser: Profile;
    matchUser: Profile;
    sport?: string;
    meetLocation?: string;
    matchName?: string;
  } | null>(null);
  const [searchingSport, setSearchingSport] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const minSpinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("socialcue_user_id") : null;
    if (!userId) {
      router.replace("/");
      return;
    }

    startTimeRef.current = Date.now();
    const showAfterMinSpin = (cb: () => void) => {
      const elapsed = Date.now() - startTimeRef.current;
      const delay = Math.max(0, MIN_SPIN_MS - elapsed);
      if (minSpinTimeoutRef.current) clearTimeout(minSpinTimeoutRef.current);
      if (delay > 0) {
        minSpinTimeoutRef.current = setTimeout(() => {
          minSpinTimeoutRef.current = null;
          cb();
        }, delay);
      } else {
        cb();
      }
    };

    const clearMinSpin = () => {
      if (minSpinTimeoutRef.current) {
        clearTimeout(minSpinTimeoutRef.current);
        minSpinTimeoutRef.current = null;
      }
    };

    if (type === "activities") {
      const sport = searchParams.get("sport");
      const matchUserId = searchParams.get("matchUserId");
      const requestId = searchParams.get("requestId");

      if (!sport) {
        setError("Missing match details");
        setLoading(false);
        return;
      }

      if (matchUserId) {
        Promise.all([
          fetch(`/api/profile/${userId}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`/api/profile/${matchUserId}`).then((r) => (r.ok ? r.json() : null)),
        ]).then(([currentUser, matchUser]) => {
          if (currentUser && matchUser) {
            showAfterMinSpin(() => {
              setData({ currentUser, matchUser, sport });
              setLoading(false);
            });
          } else {
            setError("Could not load profiles");
            setLoading(false);
          }
        }).catch(() => {
          setError("Failed to load match");
          setLoading(false);
        });
        return clearMinSpin;
      }

      if (requestId) {
        setSearchingSport(sport);
        const poll = async () => {
          try {
            const res = await fetch(
              `/api/activities/status?requestId=${requestId}&userId=${userId}`
            );
            const statusData = await res.json();
            if (statusData.error) return;
            if (statusData.status === "matched" && statusData.matchUserId) {
              if (pollRef.current) clearInterval(pollRef.current);
              pollRef.current = null;
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
              setSearchingSport(null);
              const matchUserId = statusData.matchUserId;
              Promise.all([
                fetch(`/api/profile/${userId}`).then((r) => (r.ok ? r.json() : null)),
                fetch(`/api/profile/${matchUserId}`).then((r) => (r.ok ? r.json() : null)),
              ]).then(([currentUser, matchUser]) => {
                if (currentUser && matchUser) {
                  showAfterMinSpin(() => {
                    setData({ currentUser, matchUser, sport });
                    setLoading(false);
                  });
                } else {
                  setError("Could not load profiles");
                  setLoading(false);
                }
              }).catch(() => {
                setError("Failed to load match");
                setLoading(false);
              });
            }
          } catch {
            // ignore
          }
        };
        pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
        poll();
        timeoutRef.current = setTimeout(() => {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setSearchingSport(null);
          setError("No match found 🙁. Try again or pick another sport?");
          setLoading(false);
        }, SEARCH_TIMEOUT_MS);
        return () => {
          clearMinSpin();
          if (pollRef.current) clearInterval(pollRef.current);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      }

      // No matchUserId or requestId: call API from match page (instant nav from activities page)
      setSearchingSport(sport);
      fetch("/api/activities/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sport }),
      })
        .then((r) => r.json())
        .then((apiData) => {
          if (apiData.error) {
            setError(apiData.error);
            setSearchingSport(null);
            setLoading(false);
            return;
          }
          if (apiData.matchUserId) {
            setSearchingSport(null);
            const matchUserId = apiData.matchUserId;
            return Promise.all([
              fetch(`/api/profile/${userId}`).then((r) => (r.ok ? r.json() : null)),
              fetch(`/api/profile/${matchUserId}`).then((r) => (r.ok ? r.json() : null)),
            ]).then(([currentUser, matchUser]) => {
              if (currentUser && matchUser) {
                showAfterMinSpin(() => {
                  setData({ currentUser, matchUser, sport });
                  setLoading(false);
                });
              } else {
                setError("Could not load profiles");
                setLoading(false);
              }
            });
          }
          // requestId: start polling
          const reqId = apiData.requestId;
          const poll = async () => {
            try {
              const res = await fetch(
                `/api/activities/status?requestId=${reqId}&userId=${userId}`
              );
              const statusData = await res.json();
              if (statusData.error) return;
              if (statusData.status === "matched" && statusData.matchUserId) {
                if (pollRef.current) clearInterval(pollRef.current);
                pollRef.current = null;
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
                setSearchingSport(null);
                const matchUserId = statusData.matchUserId;
                Promise.all([
                  fetch(`/api/profile/${userId}`).then((r) => (r.ok ? r.json() : null)),
                  fetch(`/api/profile/${matchUserId}`).then((r) => (r.ok ? r.json() : null)),
                ]).then(([currentUser, matchUser]) => {
                  if (currentUser && matchUser) {
                    showAfterMinSpin(() => {
                      setData({ currentUser, matchUser, sport });
                      setLoading(false);
                    });
                  } else {
                    setError("Could not load profiles");
                    setLoading(false);
                  }
                }).catch(() => {
                  setError("Failed to load match");
                  setLoading(false);
                });
              }
            } catch {
              // ignore
            }
          };
          pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
          poll();
          timeoutRef.current = setTimeout(() => {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            setSearchingSport(null);
            setError("No match found 🙁. Try again or pick another sport?");
            setLoading(false);
          }, SEARCH_TIMEOUT_MS);
        })
        .catch(() => {
          setError("Failed to find match");
          setSearchingSport(null);
          setLoading(false);
        });
      return () => {
        clearMinSpin();
        if (pollRef.current) clearInterval(pollRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    if (type === "meet") {
      const matchId = searchParams.get("matchId");
      const duration = searchParams.get("duration");
      const surpriseMe = searchParams.get("surpriseMe") === "true";

      const fetchMeetMatch = (id: string) => {
        fetch(`/api/meet/status?matchId=${id}&userId=${userId}`)
          .then((r) => r.json())
          .then((meetData) => {
            if (meetData.error) {
              setError(meetData.error);
              setLoading(false);
              return;
            }
            const matchUserId = meetData.matchUserId;
            if (!matchUserId) {
              setError("Invalid match");
              setLoading(false);
              return;
            }
            return Promise.all([
              fetch(`/api/profile/${userId}`).then((r) => (r.ok ? r.json() : null)),
              fetch(`/api/profile/${matchUserId}`).then((r) => (r.ok ? r.json() : null)),
            ]).then(([currentUser, matchUser]) => {
              if (currentUser && matchUser) {
                showAfterMinSpin(() => {
                  setData({
                    currentUser,
                    matchUser,
                    meetLocation: meetData.meetLocation,
                    matchName: meetData.matchName,
                  });
                  setLoading(false);
                });
              } else {
                setError("Could not load profiles");
                setLoading(false);
              }
            });
          })
          .catch(() => {
            setError("Failed to load match");
            setLoading(false);
          });
      };

      if (matchId) {
        fetchMeetMatch(matchId);
        return clearMinSpin;
      }

      if (duration) {
        fetch("/api/meet/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            durationMinutes: parseInt(duration, 10) || 60,
            surpriseMe,
          }),
        })
          .then((r) => r.json())
          .then((apiData) => {
            if (apiData.error) {
              setError(apiData.error);
              setLoading(false);
              return;
            }
            if (apiData.matchId) {
              fetchMeetMatch(apiData.matchId);
            } else {
              setError("Failed to find match");
              setLoading(false);
            }
          })
          .catch(() => {
            setError("Failed to find match");
            setLoading(false);
          });
        return clearMinSpin;
      }

      setError("Missing match details");
      setLoading(false);
      return;
    }

    setError("Invalid match type");
    setLoading(false);
  }, [type, searchParams, router]);

  if (loading) {
    const isMeet = type === "meet";
    const isSearching = type === "activities" && searchingSport;
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 ${
          isMeet ? "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50" : "bg-gradient-to-br from-emerald-50 via-white to-teal-50"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full border-4 animate-spin ${
            isMeet ? "border-violet-200 border-t-violet-500" : "border-emerald-200 border-t-emerald-600"
          }`}
        />
        {isSearching && (
          <p className="mt-6 text-lg font-semibold text-center">
            Finding someone for <span className="text-emerald-600">{searchingSport}</span>...
          </p>
        )}
        {isSearching && (
          <p className="mt-2 text-sm text-muted-foreground">Searching nearby ...</p>
        )}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
        <p className="text-destructive mb-4">{error ?? "Something went wrong"}</p>
        <Button asChild variant="outline">
          <Link href="/categories">Back to Categories</Link>
        </Button>
      </div>
    );
  }

  const isMeet = type === "meet";
  const theme = isMeet ? "violet" : "emerald";
  const gradientBg = isMeet
    ? "min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col"
    : "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col";
  const centerGradient = isMeet
    ? "from-violet-500 to-fuchsia-500 shadow-violet-500/30"
    : "from-emerald-500 to-teal-500";
  const centerBorder = isMeet ? "border-violet-200" : "border-emerald-200";

  return (
    <div className={gradientBg}>
      <div className="max-w-4xl mx-auto p-6 w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate sm:text-2xl">You&apos;re matched!</h1>
            <p className="text-muted-foreground text-sm truncate">
              Meet up and connect
            </p>
          </div>
          <ProfileButton />
        </div>
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProfileCard profile={data.currentUser} title="You" theme={theme} />
            <Card className={`border-2 ${centerBorder} shadow-lg flex flex-col items-center justify-center p-6 text-center`}>
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${centerGradient} flex items-center justify-center shadow-lg mb-4`}
              >
                {isMeet ? (
                  <Users className="w-8 h-8 text-white" />
                ) : (
                  <Dumbbell className="w-8 h-8 text-white" />
                )}
              </div>
              {isMeet ? (
                <>
                  <CardTitle className="text-xl mb-1">Meet</CardTitle>
                  <CardDescription className="mt-1">
                    {data.meetLocation && (
                      <span className="flex items-center justify-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {data.meetLocation}
                      </span>
                    )}
                  </CardDescription>
                  {data.matchName && (
                    <p className="text-sm font-medium mt-2">{data.matchName}</p>
                  )}
                </>
              ) : (
                <>
                  <CardTitle className="text-xl mb-1">{data.sport}</CardTitle>
                  <CardDescription>Activity</CardDescription>
                </>
              )}
            </Card>
            <ProfileCard profile={data.matchUser} title="Match" variant="highlight" theme={theme} />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="w-full">
              <Link href={isMeet ? "/meet" : "/activities"}>Find another</Link>
            </Button>
          </div>
        </div>
      </div>
      <BackLink href="/categories" label="Categories" />
      <ChatPreferencesButton />
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      }
    >
      <MatchPageContent />
    </Suspense>
  );
}
