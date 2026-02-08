"use client"

import { useState, useEffect } from "react"
import { X, Heart, MapPin, Search, ChevronLeft, User } from "lucide-react"

interface MatchDeckProps {
    userName: string
    age: string
    location: string
    category: string
    onBack: () => void
    onProfile: () => void
    onMatchFound: (matchName: string) => void
}

const MOCK_MATCHES = [
    {
        id: "1",
        name: "Sarah Chen",
        age: 24,
        location: "Mission District",
        bio: "Love hiking and trying new coffee spots. looking for a workout buddy!",
        interests: ["Hiking", "Coffee", "Yoga"],
        color: "bg-emerald-500",
    },
    {
        id: "2",
        name: "Marcus Rodriguez",
        age: 27,
        location: "Hayes Valley",
        bio: "Musician and foodie. Let's grab a bite and talk about jazz.",
        interests: ["Music", "Food", "Jazz"],
        color: "bg-blue-500",
    },
    {
        id: "3",
        name: "Priya Patel",
        age: 25,
        location: "SoMa",
        bio: "Techie by day, painter by night. Looking for creative friends.",
        interests: ["Art", "Tech", "Painting"],
        color: "bg-purple-500",
    },
]

export function MatchDeck({
    userName,
    age,
    location,
    category,
    onBack,
    onProfile,
    onMatchFound,
}: MatchDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isSearching, setIsSearching] = useState(true)

    useEffect(() => {
        // Simulate searching
        const timer = setTimeout(() => {
            setIsSearching(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    const currentProfile = MOCK_MATCHES[currentIndex]

    const handleSwipe = (direction: "left" | "right") => {
        if (direction === "right") {
            onMatchFound(currentProfile.name)
        } else {
            if (currentIndex < MOCK_MATCHES.length - 1) {
                setCurrentIndex((prev) => prev + 1)
            } else {
                // Reset or show no more matches
                setCurrentIndex(0)
            }
        }
    }

    if (isSearching) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
                <div className="mb-8 relative">
                    <div className="h-24 w-24 rounded-full border-4 border-primary/30 animate-ping absolute inset-0" />
                    <div className="h-24 w-24 rounded-full border-4 border-primary/50 animate-pulse absolute inset-0" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Search className="h-10 w-10 animate-spin-slow" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold">Finding people using {category}...</h2>
                <p className="text-muted-foreground mt-2">Looking for matches nearby...</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <span className="text-lg font-semibold capitalize">{category}</span>
                <button
                    onClick={onProfile}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                >
                    <User className="h-6 w-6" />
                </button>
            </div>

            {/* Card area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-xl bg-card border border-border">
                    {/* Image Placeholder */}
                    <div className={`h-2/3 w-full ${currentProfile.color} relative`}>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                            <h2 className="text-3xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="h-4 w-4" />
                                <span>{currentProfile.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 h-1/3 flex flex-col justify-between">
                        <p className="text-muted-foreground line-clamp-3">
                            {currentProfile.bio}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {currentProfile.interests.map((tag) => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-8 flex items-center justify-center gap-6 w-full max-w-sm">
                    <button
                        onClick={() => handleSwipe("left")}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-muted shadow-lg text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <button
                        onClick={() => handleSwipe("right")}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg text-primary-foreground hover:bg-primary/90 transition-colors hover:scale-105 active:scale-95"
                    >
                        <Heart className="h-8 w-8 fill-current" />
                    </button>
                </div>
            </div>
        </div>
    )
}
