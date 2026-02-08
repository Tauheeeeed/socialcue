"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Heart, ThumbsDown, Sparkles } from "lucide-react";

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

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("socialcue_user_id");
    if (!userId) {
      // If no local ID, they likely haven't completed onboarding.
      // Redirect to home (which shows onboarding if logged in).
      router.replace("/");
      return;
    }

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
        // Instead of redirecting to /intro, we'll stop loading and let the UI show empty/error state,
        // or redirect to home.
        router.replace("/");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find your profile details.</p>
        <Button onClick={() => router.push("/")} className="w-full max-w-xs">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-lg mx-auto p-6">
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Profile is Ready!</h1>
              <p className="text-muted-foreground">Here&apos;s what we learned about you</p>
            </div>
          </div>

          <Card className="border-2 border-violet-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
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
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-violet-100 text-violet-800 text-sm font-medium"
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
              className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30"
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
    </div>
  );
}
