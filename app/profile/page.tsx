"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileView } from "@/components/profile-view";
import { BadgeCollection } from "@/components/badge-collection";
import { getUserAchievements, UserProgress } from "@/lib/achievements";

interface ProfileData {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  likes: string[];
  dislikes: string[];
  about: string;
  acceptedGuidelines?: boolean;
  stats: {
    events: number;
    connections: number;
    rating: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData & { progress: UserProgress } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"profile" | "badges">("profile");

  useEffect(() => {
    const userId = localStorage.getItem("socialcue_user_id");
    if (!userId) {
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

  if (!profile) return null;

  const achievements = getUserAchievements(profile.progress);

  if (view === "badges") {
    return (
      <BadgeCollection
        achievements={achievements}
        onBack={() => setView("profile")}
      />
    );
  }

  return (
    <ProfileView
      userName={profile.name}
      age={profile.age.toString()}
      gender={profile.gender}
      location={profile.location}
      category="General"
      achievements={achievements}
      stats={profile.stats}
      about={profile.about}
      interests={profile.interests}
      acceptedGuidelines={profile.acceptedGuidelines}
      onBack={() => router.push("/categories")}
      onViewBadges={() => setView("badges")}
    />
  );
}
