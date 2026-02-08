"use client"

import { useState, useRef } from "react"
import {
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  Star,
  User,
} from "lucide-react"

interface MatchDeckProps {
  userName: string
  category: string
  onBack: () => void
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


function GhostSlot({
  label,
  side,
}: {
  label: string
  side: "left" | "right"
}) {
  return (
    <div
      className={`hidden w-48 flex-col items-center gap-3 lg:flex ${side === "left" ? "items-end" : "items-start"
        }`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50">
        <User className="h-8 w-8 text-muted-foreground/30" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
        {label}
      </span>
      <div className="space-y-2">
        <div className="h-2 w-24 rounded-full bg-muted" />
        <div className="h-2 w-16 rounded-full bg-muted" />
        <div className="h-2 w-20 rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function MatchDeck({ userName, category, onBack }: MatchDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const matches = MATCHES[category] || MATCHES["social"] // Fallback
  const currentMatch = matches[currentIndex]
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Star className="h-5 w-5" />
        </div>
      </header>

      {/* Card Stack Area */}
      <div className="flex flex-1 items-center justify-center gap-8 px-6 py-4">
        {/* Left Ghost - ME */}
        <GhostSlot label="ME" side="left" />

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
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-primary/10">
                <span className="rounded-xl border-2 border-primary px-4 py-2 text-lg font-bold text-primary">
                  JOIN
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Ghost - MATCH */}
        <GhostSlot label="MATCH" side="right" />
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
          onClick={() => swipe("right")}
          disabled={isAnimating}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-card shadow-md transition-all hover:border-primary hover:bg-primary/5 active:scale-90"
          aria-label="Join this match"
        >
          <Heart className="h-7 w-7 text-primary" />
        </button>
      </div>

      {/* Card counter */}
      <div className="pb-6 text-center text-xs text-muted-foreground">
        {currentIndex + 1} of {matches.length} matches
      </div>

      {/* Mobile ghost slots */}
      <div className="flex justify-between px-6 pb-8 lg:hidden">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
            <User className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            ME
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
            <User className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            MATCH
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
