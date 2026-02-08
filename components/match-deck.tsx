"use client"

import { useState, useRef } from "react"
import {
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  User,
  Check,
  X,
  Star,
  Loader2,
} from "lucide-react"

interface MatchDeckProps {
  userName: string
  age: string
  location: string
  category: string
  onBack: () => void
  onProfile: () => void
  onMatchFound?: (matchName: string) => void
}

const MATCHES: Record<string, any[]> = {
  sports: [
    {
      id: 1,
      title: "Ping Pong @ Fitness Center",
      category: "Sports & Fitness",
      location: "Downtown Fitness Center",
      time: "Saturday, 3:00 PM",
      spots: "4 spots left",
      color: "bg-[hsl(45_80%_92%)]",
      accent: "text-[hsl(45_70%_35%)]",
      borderColor: "border-[hsl(45_70%_82%)]",
      emoji: "🏓",
    },
    {
      id: 2,
      title: "Saturday Morning Basketball",
      category: "Sports & Fitness",
      location: "Community Park Courts",
      time: "Saturday, 9:00 AM",
      spots: "2 spots left",
      color: "bg-[hsl(45_80%_92%)]",
      accent: "text-[hsl(45_70%_35%)]",
      borderColor: "border-[hsl(45_70%_82%)]",
      emoji: "🏀",
    },
    {
      id: 3,
      title: "Sunset Yoga",
      category: "Sports & Fitness",
      location: "Riverfront Park",
      time: "Sunday, 6:00 PM",
      spots: "10 spots left",
      color: "bg-[hsl(45_80%_92%)]",
      accent: "text-[hsl(45_70%_35%)]",
      borderColor: "border-[hsl(45_70%_82%)]",
      emoji: "🧘",
    },
  ],
  community: [
    {
      id: 1,
      title: "Trail Cleanup",
      category: "Community Service",
      location: "Riverside Nature Trail",
      time: "Sunday, 9:00 AM",
      spots: "8 spots left",
      color: "bg-[hsl(152_44%_92%)]",
      accent: "text-[hsl(152_44%_36%)]",
      borderColor: "border-[hsl(152_44%_80%)]",
      emoji: "🌿",
    },
    {
      id: 2,
      title: "Community Garden Planting",
      category: "Community Service",
      location: "Urban Roots Garden",
      time: "Saturday, 10:00 AM",
      spots: "5 spots left",
      color: "bg-[hsl(152_44%_92%)]",
      accent: "text-[hsl(152_44%_36%)]",
      borderColor: "border-[hsl(152_44%_80%)]",
      emoji: "🌱",
    },
    {
      id: 3,
      title: "Food Bank Packing",
      category: "Community Service",
      location: "City Food Bank",
      time: "Saturday, 1:00 PM",
      spots: "3 spots left",
      color: "bg-[hsl(152_44%_92%)]",
      accent: "text-[hsl(152_44%_36%)]",
      borderColor: "border-[hsl(152_44%_80%)]",
      emoji: "📦",
    },
  ],
  food: [
    {
      id: 1,
      title: "Ramen Making Workshop",
      category: "Food & Dining",
      location: "Community Kitchen",
      time: "Friday, 6:30 PM",
      spots: "6 spots left",
      color: "bg-[hsl(20_80%_93%)]",
      accent: "text-[hsl(20_70%_40%)]",
      borderColor: "border-[hsl(20_60%_84%)]",
      emoji: "🍜",
    },
    {
      id: 2,
      title: "Taco Tuesday Meetup",
      category: "Food & Dining",
      location: "El Camino Plaza",
      time: "Tuesday, 7:00 PM",
      spots: "Open",
      color: "bg-[hsl(20_80%_93%)]",
      accent: "text-[hsl(20_70%_40%)]",
      borderColor: "border-[hsl(20_60%_84%)]",
      emoji: "🌮",
    },
  ],
  music: [
    {
      id: 1,
      title: "Acoustic Jam Session",
      category: "Music & Concerts",
      location: "The Loft Studio",
      time: "Thursday, 7:00 PM",
      spots: "3 spots left",
      color: "bg-[hsl(270_40%_93%)]",
      accent: "text-[hsl(270_35%_42%)]",
      borderColor: "border-[hsl(270_30%_84%)]",
      emoji: "🎸",
    },
    {
      id: 2,
      title: "Local Band Showcase",
      category: "Music & Concerts",
      location: "Underground Venue",
      time: "Saturday, 8:00 PM",
      spots: "Limited",
      color: "bg-[hsl(270_40%_93%)]",
      accent: "text-[hsl(270_35%_42%)]",
      borderColor: "border-[hsl(270_30%_84%)]",
      emoji: "🎤",
    },
  ],
  arts: [
    {
      id: 1,
      title: "Pottery Workshop",
      category: "Arts & Culture",
      location: "Clay Studio",
      time: "Sunday, 2:00 PM",
      spots: "2 spots left",
      color: "bg-[hsl(210_60%_93%)]",
      accent: "text-[hsl(210_50%_38%)]",
      borderColor: "border-[hsl(210_50%_84%)]",
      emoji: "🏺",
    },
    {
      id: 2,
      title: "Gallery Walk",
      category: "Arts & Culture",
      location: "Art District",
      time: "Friday, 6:00 PM",
      spots: "Open",
      color: "bg-[hsl(210_60%_93%)]",
      accent: "text-[hsl(210_50%_38%)]",
      borderColor: "border-[hsl(210_50%_84%)]",
      emoji: "🎨",
    },
  ],
  social: [
    {
      id: 1,
      title: "Board Game Night",
      category: "Social Hangouts",
      location: "The Dice Cafe",
      time: "Wednesday, 6:00 PM",
      spots: "4 spots left",
      color: "bg-[hsl(340_50%_93%)]",
      accent: "text-[hsl(340_45%_42%)]",
      borderColor: "border-[hsl(340_40%_85%)]",
      emoji: "🎲",
    },
    {
      id: 2,
      title: "Trivia Night",
      category: "Social Hangouts",
      location: "Downtown Pub",
      time: "Thursday, 7:30 PM",
      spots: "Team of 5",
      color: "bg-[hsl(340_50%_93%)]",
      accent: "text-[hsl(340_45%_42%)]",
      borderColor: "border-[hsl(340_40%_85%)]",
      emoji: "❓",
    },
  ],
};



function MeCard({ userName, category, age, location }: { userName: string; category: string; age: string; location: string }) {
  return (
    <div className="hidden w-64 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md lg:flex">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary shadow-inner">
          <User className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-background">
          <Star className="h-4 w-4 fill-current" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-foreground">{userName}, {age}</h3>
        <p className="text-sm text-muted-foreground">Looking for {category}</p>
      </div>

      <div className="mt-2 w-full space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="truncate">{location || "Location not set"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <span className="truncate">Free Weekends</span>
        </div>
      </div>

      <div className="mt-4 w-full rounded-xl bg-muted/50 p-3 text-center text-xs text-muted-foreground">
        "Ready to explore new activities!"
      </div>
    </div>
  )
}

function GhostSlot({
  label,
  side,
  isSearching = false,
}: {
  label: string
  side: "left" | "right"
  isSearching?: boolean
}) {
  return (
    <div
      className={`hidden w-48 flex-col items-center gap-3 lg:flex ${side === "left" ? "items-end" : "items-start"
        }`}
    >
      <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-all ${isSearching ? "border-primary/50 bg-primary/5" : ""}`}>
        {isSearching ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <User className="h-8 w-8 text-muted-foreground/30" />
        )}
      </div>
      <span className={`text-xs font-semibold uppercase tracking-widest transition-colors ${isSearching ? "text-primary animate-pulse" : "text-muted-foreground/40"}`}>
        {isSearching ? "SEARCHING..." : label}
      </span>
      <div className="space-y-2">
        <div className={`h-2 w-24 rounded-full transition-colors ${isSearching ? "bg-primary/20 animate-pulse" : "bg-muted"}`} />
        <div className={`h-2 w-16 rounded-full transition-colors ${isSearching ? "bg-primary/20 animate-pulse delay-75" : "bg-muted"}`} />
        <div className={`h-2 w-20 rounded-full transition-colors ${isSearching ? "bg-primary/20 animate-pulse delay-150" : "bg-muted"}`} />
      </div>
    </div>
  )
}

export function MatchDeck({ userName, age, location, category, onBack, onProfile, onMatchFound }: MatchDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const matches = MATCHES[category] || MATCHES["social"] // Fallback
  const currentMatch = matches[currentIndex]
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)



  const swipe = (dir: "left" | "right") => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(dir)

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % matches.length)
      setDirection(null)
      setIsAnimating(false)
    }, 350)
  }

  const handleConfirm = () => {
    if (isAnimating || isSearching) return
    setIsSearching(true)

    // Simulate finding a match
    setTimeout(() => {
      setIsSearching(false)
      // Call the callback to transition to chat
      if (onMatchFound) {
        onMatchFound(currentMatch.title)
      } else {
        // Fallback if prop not provided (though it should be)
        alert(`It's a match! You're going to ${currentMatch.title}!`)
        setCurrentIndex((prev) => (prev + 1) % matches.length)
      }
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-90"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Your Matches</h1>
            <p className="text-sm text-muted-foreground">
              Curated for {userName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onProfile}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-90"
            aria-label="View Profile"
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Star className="h-5 w-5" />
          </div>
        </div>
      </header>

      {/* Card Stack Area */}
      <div className="flex flex-1 items-center justify-center gap-8 px-6 py-4">
        {/* Left Side - ME Card */}
        <MeCard userName={userName} age={age} location={location} category={category} />

        {/* Card Stack */}
        <div className="relative h-[420px] w-full max-w-sm">
          {/* Background cards for stack effect */}
          {matches.slice(currentIndex + 1, currentIndex + 3).map((m, i) => (
            <div
              key={m.id}
              className="absolute inset-0 rounded-3xl border border-border bg-card shadow-sm"
              style={{
                transform: `scale(${1 - (i + 1) * 0.04}) translateY(${(i + 1) * 10}px)`,
                zIndex: 10 - (i + 1),
                opacity: 1 - (i + 1) * 0.2,
              }}
            />
          ))}

          {/* Active Card */}
          <div
            ref={cardRef}
            className={`absolute inset-0 z-20 overflow-hidden rounded-3xl border-2 bg-card shadow-xl transition-all duration-300 ${currentMatch.borderColor
              } ${direction === "left"
                ? "-translate-x-[120%] -rotate-12 opacity-0"
                : direction === "right"
                  ? "translate-x-[120%] rotate-12 opacity-0"
                  : "translate-x-0 rotate-0 opacity-100"
              }`}
          >
            {/* Card Top */}
            <div
              className={`flex h-44 flex-col items-center justify-center ${currentMatch.color}`}
            >
              <span className="text-6xl">{currentMatch.emoji}</span>
              <span
                className={`mt-2 text-sm font-semibold ${currentMatch.accent}`}
              >
                {currentMatch.category}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">
                {currentMatch.title}
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{currentMatch.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <span>{currentMatch.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0 text-primary" />
                  <span>{currentMatch.spots}</span>
                </div>
              </div>
            </div>

            {/* Swipe hint overlays */}
            {direction === "left" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-destructive/10">
                <span className="rounded-xl border-2 border-destructive px-4 py-2 text-lg font-bold text-destructive">
                  PASS
                </span>
              </div>
            )}
            {direction === "right" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-destructive/10">
                <span className="rounded-xl border-2 border-destructive px-4 py-2 text-lg font-bold text-destructive">
                  PASS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Ghost - MATCH */}
        <GhostSlot label="MATCH" side="right" isSearching={isSearching} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 px-6 pb-8">
        <button
          type="button"
          onClick={() => swipe("left")}
          disabled={isAnimating}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive/20 bg-card shadow-md transition-all hover:border-destructive hover:bg-destructive/5 active:scale-90"
          aria-label="Pass on this match"
        >
          <X className="h-7 w-7 text-destructive" />
        </button>

        <button
          type="button"
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % matches.length)
          }
          disabled={isAnimating}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-90"
          aria-label="Skip to next"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isAnimating || isSearching}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500/20 bg-card shadow-md transition-all hover:border-green-500 hover:bg-green-500/5 active:scale-90"
          aria-label="Confirm this match"
        >
          <Check className="h-7 w-7 text-green-500" />
        </button>
      </div>


      {/* Mobile Me Card Preview */}
      <div className="flex justify-between px-6 pb-8 lg:hidden">
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <User className="h-6 w-6 text-muted-foreground/50" />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground shadow-sm ring-2 ring-background">
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            YOU
          </span>
        </div>

        {/* Right side ghost remains simple */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50">
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            NEXT
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pb-6">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        <div className="h-2.5 w-8 rounded-full bg-primary" />
      </div>
    </div>
  )
}

