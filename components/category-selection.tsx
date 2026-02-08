"use client"

import { useState } from "react"
import {
  Sprout,
  Trophy,
  UtensilsCrossed,
  Palette,
  Users,
  Music,
  ArrowRight,
  Check,
} from "lucide-react"

interface CategorySelectionProps {
  onNext: (category: string) => void
}

const CATEGORIES = [
  {
    id: "community",
    name: "Community Service",
    description: "Give back and make a difference together",
    icon: Sprout,
    bg: "bg-[hsl(152_44%_92%)]",
    iconColor: "text-[hsl(152_44%_36%)]",
    borderColor: "border-[hsl(152_44%_80%)]",
    selectedBorder: "border-[hsl(152_44%_42%)]",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Stay active with people who match your energy",
    icon: Trophy,
    bg: "bg-[hsl(45_80%_92%)]",
    iconColor: "text-[hsl(45_70%_35%)]",
    borderColor: "border-[hsl(45_70%_82%)]",
    selectedBorder: "border-[hsl(45_70%_50%)]",
  },
  {
    id: "food",
    name: "Food & Dining",
    description: "Explore flavors and cook up connections",
    icon: UtensilsCrossed,
    bg: "bg-[hsl(20_80%_93%)]",
    iconColor: "text-[hsl(20_70%_40%)]",
    borderColor: "border-[hsl(20_60%_84%)]",
    selectedBorder: "border-[hsl(20_70%_55%)]",
  },
  {
    id: "arts",
    name: "Arts & Culture",
    description: "Create, explore, and appreciate beauty",
    icon: Palette,
    bg: "bg-[hsl(210_60%_93%)]",
    iconColor: "text-[hsl(210_50%_38%)]",
    borderColor: "border-[hsl(210_50%_84%)]",
    selectedBorder: "border-[hsl(210_50%_55%)]",
  },
  {
    id: "social",
    name: "Social Hangouts",
    description: "Casual meetups, game nights, and good vibes",
    icon: Users,
    bg: "bg-[hsl(340_50%_93%)]",
    iconColor: "text-[hsl(340_45%_42%)]",
    borderColor: "border-[hsl(340_40%_85%)]",
    selectedBorder: "border-[hsl(340_45%_55%)]",
  },
  {
    id: "music",
    name: "Music & Concerts",
    description: "Bond over beats and live performances",
    icon: Music,
    bg: "bg-[hsl(270_40%_93%)]",
    iconColor: "text-[hsl(270_35%_42%)]",
    borderColor: "border-[hsl(270_30%_84%)]",
    selectedBorder: "border-[hsl(270_35%_55%)]",
  },
]

export function CategorySelection({ onNext }: CategorySelectionProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const toggleCategory = (id: string) => {
    setSelected((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Pick Your Interests
          </h1>
          <p className="text-base text-muted-foreground">
            Select the categories that speak to you. We&apos;ll use these to find your perfect matches.
          </p>
        </div>

        {/* Category Tiles */}
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selected === cat.id
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${cat.bg
                  } ${isSelected
                    ? `${cat.selectedBorder} shadow-md`
                    : `${cat.borderColor} hover:shadow-sm`
                  }`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${cat.bg}`}
                >
                  <Icon className={`h-7 w-7 ${cat.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </div>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${isSelected
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border bg-card"
                    }`}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          Find Matches
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <div className="h-2.5 w-8 rounded-full bg-primary" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}
