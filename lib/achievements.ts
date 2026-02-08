import { Award, Users, Leaf, Utensils, Music, Palette, LucideIcon, Lock } from "lucide-react"

export interface Achievement {
    id: string
    name: string
    description: string
    icon: LucideIcon
    total: number
    color: string
    category: "community" | "social" | "nature" | "food" | "music" | "art"
}

export interface UserProgress {
    communityEvents: number
    peopleMet: number
    natureEvents: number
    foodEvents: number
    musicEvents: number
    artEvents: number
}

export interface UserAchievement extends Achievement {
    unlocked: boolean
    progress: number
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "1",
        name: "Community Hero",
        description: "Participate in 5 community service events",
        icon: Award,
        total: 5,
        color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
        category: "community",
    },
    {
        id: "2",
        name: "Social Butterfly",
        description: "Meet 10 new people",
        icon: Users,
        total: 10,
        color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        category: "social",
    },
    {
        id: "3",
        name: "Green Thumb",
        description: "Attend 3 gardening events",
        icon: Leaf,
        total: 3,
        color: "text-green-600 bg-green-500/10 border-green-500/20",
        category: "nature",
    },
    {
        id: "4",
        name: "Foodie",
        description: "Attend 3 food events",
        icon: Utensils,
        total: 3,
        color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
        category: "food",
    },
    {
        id: "5",
        name: "Melody Maker",
        description: "Attend 3 music events",
        icon: Music,
        total: 3,
        color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
        category: "music",
    },
    {
        id: "6",
        name: "Art Enthusiast",
        description: "Attend 3 art workshops",
        icon: Palette,
        total: 3,
        color: "text-pink-600 bg-pink-500/10 border-pink-500/20",
        category: "art",
    },
]

export const INITIAL_PROGRESS: UserProgress = {
    communityEvents: 5, // Already completed
    peopleMet: 3,
    natureEvents: 3,   // Already completed
    foodEvents: 1,
    musicEvents: 0,
    artEvents: 0,
}

export function getUserAchievements(progress: UserProgress): UserAchievement[] {
    return ACHIEVEMENTS.map((achievement) => {
        let currentProgress = 0
        switch (achievement.category) {
            case "community":
                currentProgress = progress.communityEvents
                break
            case "social":
                currentProgress = progress.peopleMet
                break
            case "nature":
                currentProgress = progress.natureEvents
                break
            case "food":
                currentProgress = progress.foodEvents
                break
            case "music":
                currentProgress = progress.musicEvents
                break
            case "art":
                currentProgress = progress.artEvents
                break
        }

        // Cap progress at total
        const effectiveProgress = Math.min(currentProgress, achievement.total)

        return {
            ...achievement,
            progress: effectiveProgress,
            unlocked: effectiveProgress >= achievement.total,
        }
    })
}
