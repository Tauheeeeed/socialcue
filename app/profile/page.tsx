"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Heart, ThumbsDown, Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ProfileButton } from "@/components/profile-button";
import { ChatPreferencesButton } from "@/components/chat-preferences-button";

interface ProfileData {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  likes: string[];
  dislikes: string[];
}

function loadProfile(
  setProfile: (p: ProfileData | null) => void,
  setLoading: (l: boolean) => void,
  router: ReturnType<typeof useRouter>
) {
  const userId = localStorage.getItem("socialcue_user_id");
  if (!userId) {
    router.replace("/");
    return;
  }
  setLoading(true);
  fetch(`/api/profile/${userId}`)
    .then((res) => {
      if (!res.ok) {
        if (res.status === 404) throw new Error("Profile not found");
        throw new Error("Failed to load profile");
      }
      return res.json();
    })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      setProfile(data);
    })
    .catch((err) => {
      console.error(err);
      setProfile(null);
    })
    .finally(() => setLoading(false));
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile(setProfile, setLoading, router);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">We couldn&apos;t load your profile. You can go back or retry.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={() => router.push("/categories")} className="w-full">
            Back to Categories
          </Button>
          <Button variant="outline" onClick={() => loadProfile(setProfile, setLoading, router)} className="w-full">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex flex-col">
      <div className="max-w-lg mx-auto p-6 w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate sm:text-2xl">Your Profile is Ready!</h1>
            <p className="text-muted-foreground text-sm truncate">Here&apos;s what we learned about you</p>
          </div>
        </div>
        <div className="space-y-6 animate-fade-in flex-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-400/25 shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>

          <Card className="border-2 border-blue-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-100/80 to-sky-100/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <CardDescription>
                    {profile.age} years {profile.gender ? `• ${profile.gender}` : ""}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {profile.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.likes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Likes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.likes.map((l) => (
                      <span
                        key={l}
                        className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-sm"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.dislikes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4 text-slate-500" />
                    Dislikes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.dislikes.map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 shadow-lg shadow-blue-400/25"
              onClick={() => router.push("/categories")}
            >
              Continue to Categories
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 text-lg border-2"
              asChild
            >
              <a href="/auth/logout">Logout</a>
            </Button>
          </div>
        </div>
      </div>
      <BackLink href="/categories" label="Categories" />
      <ChatPreferencesButton />
    </div>
  );
}
