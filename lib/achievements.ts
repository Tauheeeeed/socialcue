import { LucideIcon, Hand, User, Heart, Sparkles, Zap, Trophy, Smile } from "lucide-react"

export interface UserProgress {
    communityEvents: number
    peopleMet: number
    activitiesHosted: number
    messagesSent: number
    daysActive: number
}

export const INITIAL_PROGRESS: UserProgress = {
    communityEvents: 0,
    peopleMet: 0,
    activitiesHosted: 0,
    messagesSent: 0,
    daysActive: 0,
}

export interface Achievement {
    id: string
    name: string
    description: string
    icon: LucideIcon
    total: number // Requirement to unlock
    category: "community" | "social" | "activity" | "engagement"
    color: string // Tailwind classes for icon color
}

export interface UserAchievement extends Achievement {
    progress: number
    unlocked: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "community-hero",
        name: "Community Hero",
        description: "Participate in 5 community service events",
        icon: Hand,
        total: 5,
        category: "community",
        color: "text-emerald-500 bg-emerald-100",
    },
    {
        id: "social-butterfly",
        name: "Social Butterfly",
        description: "Meet 10 new people through activities",
        icon: User,
        total: 10,
        category: "social",
        color: "text-blue-500 bg-blue-100",
    },
    {
        id: "host-with-most",
        name: "Host with the Most",
        description: "Host 3 activities successfully",
        icon: Heart,
        total: 3,
        category: "activity",
        color: "text-rose-500 bg-rose-100",
    },
    {
        id: "early-adopter",
        name: "Early Adopter",
        description: "Join SocialCue during the beta phase",
        icon: Sparkles,
        total: 1,
        category: "engagement",
        color: "text-purple-500 bg-purple-100",
    },
    {
        id: "active-participant",
        name: "Active Participant",
        description: "Maintain a 7-day activity streak",
        icon: Zap,
        total: 7,
        category: "engagement",
        color: "text-amber-500 bg-amber-100",
    },
    {
        id: "friendly-face",
        name: "Friendly Face",
        description: "Send 50 messages to matches",
        icon: Smile,
        total: 50,
        category: "social",
        color: "text-pink-500 bg-pink-100",
    },
]

export function getUserAchievements(progress: UserProgress): UserAchievement[] {
    return ACHIEVEMENTS.map((achievement) => {
        let currentProgress = 0
        switch (achievement.category) {
            case "community":
                currentProgress = progress.communityEvents
                break
            case "social":
                if (achievement.id === "social-butterfly") currentProgress = progress.peopleMet
                else if (achievement.id === "friendly-face") currentProgress = progress.messagesSent
                break
            case "activity":
                currentProgress = progress.activitiesHosted
                break
            case "engagement":
                if (achievement.id === "early-adopter") currentProgress = 1 // Always unlocked for now
                else if (achievement.id === "active-participant") currentProgress = progress.daysActive
                break
        }

        const effectiveProgress = Math.min(currentProgress, achievement.total)

        return {
            ...achievement,
            progress: effectiveProgress,
            unlocked: effectiveProgress >= achievement.total,
        }
    })
}
