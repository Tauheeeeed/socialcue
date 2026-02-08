"use client"

import { useState } from "react"
import { ChevronLeft, Lock } from "lucide-react"
import { UserAchievement } from "@/lib/achievements"

interface BadgeCollectionProps {
    achievements: UserAchievement[]
    onBack: () => void
}

export function BadgeCollection({ achievements, onBack }: BadgeCollectionProps) {
    const [selectedBadge, setSelectedBadge] = useState<UserAchievement | null>(null)

    const unlockedCount = achievements.filter((a) => a.unlocked).length
    const totalCount = achievements.length
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100)

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
                <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold">Achievements</span>
                    <span className="text-xs text-muted-foreground">
                        {unlockedCount} of {totalCount} unlocked
                    </span>
                </div>
                <div className="h-10 w-10" /> {/* Spacer */}
            </div>

            <main className="flex-1 overflow-y-auto px-6 py-6">
                {/* Progress Card */}
                <div className="mb-8 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-6 text-white shadow-lg">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Level {Math.floor(unlockedCount / 3) + 1}</h2>
                            <p className="text-white/80">Keep going!</p>
                        </div>
                        <div className="text-3xl font-bold">{progressPercentage}%</div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
                        <div
                            className="h-full bg-white transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {achievements.map((badge) => (
                        <button
                            key={badge.id}
                            onClick={() => setSelectedBadge(badge)}
                            className={`relative flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${badge.unlocked
                                    ? `border-current ${badge.color} bg-card`
                                    : "border-border bg-muted/30 opacity-60 grayscale"
                                }`}
                        >
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-sm ${badge.unlocked ? "bg-background" : "bg-muted"
                                    }`}
                            >
                                {badge.unlocked ? (
                                    <badge.icon className="h-8 w-8" />
                                ) : (
                                    <Lock className="h-8 w-8 text-muted-foreground" />
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-semibold leading-tight">
                                    {badge.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {badge.progress} / {badge.total}
                                </span>
                            </div>

                            {/* Progress Bar for Badge */}
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full transition-all ${badge.unlocked ? "bg-current" : "bg-muted-foreground"}`}
                                    style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            {/* Details Modal (Simple Overlay) */}
            {selectedBadge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${selectedBadge.unlocked ? selectedBadge.color : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                <selectedBadge.icon className="h-12 w-12" />
                            </div>

                            <h3 className="mb-2 text-2xl font-bold">{selectedBadge.name}</h3>
                            <p className="mb-6 text-muted-foreground">
                                {selectedBadge.description}
                            </p>

                            <div className="mb-6 w-full rounded-2xl bg-muted/50 p-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress</span>
                                    <span className="font-mono">{selectedBadge.progress} / {selectedBadge.total}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full bg-primary transition-all"
                                        style={{ width: `${Math.min((selectedBadge.progress / selectedBadge.total) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
