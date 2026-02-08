"use client"

import {
    MapPin,
    Calendar,
    Settings,
    Edit3,
    LogOut,
    ChevronLeft,
    Share2,
    Trophy,
    Lock,
} from "lucide-react"
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
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-4 backdrop-blur-md">
                <button
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <span className="text-lg font-semibold">My Profile</span>
                <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
                    <Settings className="h-6 w-6 text-foreground" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="relative">
                    {/* Cover Image */}
                    <div className="h-48 w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Profile Stats Card */}
                    <div className="-mt-20 px-6 pb-6">
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4 h-24 w-24">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-3xl font-bold text-muted-foreground">
                                        {userName.charAt(0)}
                                    </div>
                                    <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted">
                                        <Edit3 className="h-4 w-4 text-foreground" />
                                    </button>
                                </div>

                                <h2 className="text-2xl font-bold text-foreground">{userName}</h2>
                                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{location || "San Francisco, CA"}</span>
                                </div>

                                <div className="mt-6 flex w-full justify-between px-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-foreground">12</span>
                                        <span className="text-xs text-muted-foreground">Events</span>
                                    </div>
                                    <div className="h-10 w-px bg-border" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-foreground">48</span>
                                        <span className="text-xs text-muted-foreground">Connections</span>
                                    </div>
                                    <div className="h-10 w-px bg-border" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-foreground">4.9</span>
                                        <span className="text-xs text-muted-foreground">Rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6 px-6 pb-20">
                    {/* Achievements Preview */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
                            <button
                                onClick={onViewBadges}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {achievements.slice(0, 3).map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center shadow-sm ${achievement.unlocked
                                            ? "border-border bg-card"
                                            : "border-dashed border-border bg-muted/50 opacity-70"
                                        }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${achievement.unlocked
                                                ? achievement.color.split(" ")[1] + " " + achievement.color.split(" ")[0]
                                                : "bg-muted"
                                            }`}
                                    >
                                        {achievement.unlocked ? (
                                            <achievement.icon className="h-5 w-5" />
                                        ) : (
                                            <Lock className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-medium leading-tight max-w-full truncate px-1">
                                        {achievement.unlocked ? achievement.name : "Locked"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">About Me</h3>
                        <p className="leading-relaxed text-muted-foreground">
                            Passionate about community service and meeting new people. Always up for
                            a coffee chat or a weekend cleanup drive!
                        </p>
                    </div>

                    {/* Interests */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Volunteering", icon: Trophy },
                                { label: "Social Events", icon: Calendar },
                                { label: "Photography", icon: Settings },
                            ].map((interest, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    <interest.icon className="h-3.5 w-3.5 text-primary" />
                                    {interest.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4">
                        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-4 font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.98]">
                            <Share2 className="h-5 w-5" />
                            Share Profile
                        </button>
                        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-destructive hover:bg-destructive/10 active:scale-[0.98]">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
