import { useState } from "react"
import { ArrowLeft, Lock } from "lucide-react"
import { UserAchievement } from "@/lib/achievements"

interface BadgeCollectionProps {
    achievements: UserAchievement[]
    onBack: () => void
}

export function BadgeCollection({ achievements, onBack }: BadgeCollectionProps) {
    const [selectedBadge, setSelectedBadge] = useState<UserAchievement | null>(null)

    const unlockedCount = achievements.filter((a) => a.unlocked).length

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="flex items-center gap-4 px-6 py-4">
                <button
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-90"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-foreground">Accomplishments</h1>
                    <p className="text-sm text-muted-foreground">
                        {unlockedCount} of {achievements.length} unlocked
                    </p>
                </div>
            </header>

            {/* Badge Grid */}
            <main className="flex-1 overflow-y-auto px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                    {achievements.map((badge) => (
                        <button
                            key={badge.id}
                            onClick={() => setSelectedBadge(badge)}
                            className={`relative flex flex-col items-center gap-3 rounded-3xl border p-6 text-center transition-all hover:scale-105 hover:shadow-md ${badge.unlocked
                                ? "border-current " + badge.color
                                : "border-border bg-card opacity-80 grayscale"
                                }`}
                        >
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-inner ${badge.unlocked ? "bg-background/80" : "bg-muted"
                                    }`}
                            >
                                {badge.unlocked ? (
                                    <badge.icon className="h-8 w-8" />
                                ) : (
                                    <Lock className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold leading-tight">
                                    {badge.name}
                                </h3>
                                {!badge.unlocked && (
                                    <div className="mt-2 text-xs font-medium text-muted-foreground">
                                        {badge.progress} / {badge.total}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            {/* Detail Modal/Overlay */}
            {selectedBadge && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                    onClick={() => setSelectedBadge(null)}
                >
                    <div
                        className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-inner ${selectedBadge.unlocked
                                    ? selectedBadge.color.split(" ")[1] + " " + selectedBadge.color.split(" ")[0].replace("text-", "bg-opacity-20 text-")
                                    : "bg-muted grayscale"
                                    }`}
                            >
                                <selectedBadge.icon
                                    className={`h-12 w-12 ${selectedBadge.unlocked ? "" : "text-muted-foreground"
                                        }`}
                                />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-foreground">
                                {selectedBadge.name}
                            </h2>
                            <p className="mb-6 text-muted-foreground">
                                {selectedBadge.description}
                            </p>

                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                    <span>Progress</span>
                                    <span>
                                        {selectedBadge.progress} / {selectedBadge.total}
                                    </span>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${selectedBadge.unlocked ? "bg-primary" : "bg-muted-foreground"
                                            }`}
                                        style={{
                                            width: `${(selectedBadge.progress / selectedBadge.total) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                {selectedBadge.unlocked ? (
                                    <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-bold text-green-600">
                                        Badge Unlocked! 🎉
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                                        Keep going! 🔒
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
