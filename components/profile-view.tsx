"use client"

import { User, MapPin, Calendar, Heart, ArrowLeft, Settings, LogOut, Award, Lock, Leaf } from "lucide-react"
import { UserAchievement } from "@/lib/achievements"

interface ProfileViewProps {
    userName: string
    age: string
    location: string
    category: string
    achievements: UserAchievement[]
    onBack: () => void
    onViewBadges?: () => void
}

export function ProfileView({
    userName,
    age,
    location,
    category,
    achievements,
    onBack,
    onViewBadges,
}: ProfileViewProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-90"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <span className="text-lg font-semibold text-foreground">Profile</span>
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-90"
                    aria-label="Settings"
                >
                    <Settings className="h-5 w-5 text-muted-foreground" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-20 pt-4">
                {/* Profile Card */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary shadow-inner">
                            <User className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md border-4 border-background">
                            <span className="text-xs font-bold">98%</span>
                        </div>
                    </div>

                    <h1 className="mb-1 text-2xl font-bold text-foreground">{userName}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{age} years old</span>
                        <span>•</span>
                        <span>{location}</span>
                    </div>
                </div>

                {/* Stats / Info */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <span className="block text-xs font-medium text-muted-foreground">Location</span>
                        <span className="text-sm font-semibold text-foreground">{location}</span>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span className="block text-xs font-medium text-muted-foreground">Joined</span>
                        <span className="text-sm font-semibold text-foreground">Feb 2026</span>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Achievements</h2>
                        {onViewBadges && (
                            <button
                                onClick={onViewBadges}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View All
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {achievements.slice(0, 3).map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center shadow-sm ${achievement.unlocked ? "border-border bg-card" : "border-dashed border-border bg-muted/50 opacity-70"
                                    }`}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${achievement.unlocked ? achievement.color.split(" ")[1] + " " + achievement.color.split(" ")[0] : "bg-muted"
                                        }`}
                                >
                                    {achievement.unlocked ? (
                                        <achievement.icon className="h-5 w-5" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <span className="text-[10px] font-medium leading-tight">
                                    {achievement.unlocked ? achievement.name : "Locked"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interests */}
                <div className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Interests</h2>
                    <div className="flex flex-wrap gap-2">
                        {category ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                <Heart className="h-3.5 w-3.5" />
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                        ) : (
                            <span className="text-sm text-muted-foreground">No interests selected yet.</span>
                        )}
                        {/* Hardcoded extras for visual fullness */}
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                            Photography
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                            Hiking
                        </span>
                    </div>
                </div>

                {/* About */}
                <div className="mt-8">
                    <h2 className="mb-3 text-lg font-semibold text-foreground">About</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Enthusiast of {category || "trying new things"}. Looking to meet new people and explore the city!
                    </p>
                </div>

                {/* Logout */}
                <div className="mt-12 flex justify-center">
                    <a
                        href="/auth/logout"
                        className="flex items-center gap-2 rounded-xl bg-destructive/10 px-6 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                    >
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </a>
                </div>
            </main>
        </div>
    )
}
