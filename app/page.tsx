"use client"

import { useState } from "react"
import { ProfileSetup } from "@/components/onboarding/profile-setup"
import { AIChat } from "@/components/onboarding/ai-chat"
import { CategorySelection } from "@/components/category-selection"
import { MatchDeck } from "@/components/match-deck"

type Screen = "profile" | "chat" | "categories" | "matches"

export default function Page() {
  const [screen, setScreen] = useState<Screen>("profile")
  const [userName, setUserName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const transitionTo = (next: Screen) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setScreen(next)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 400)
  }

  const handleProfileNext = (data: {
    name: string
    age: string
    location: string
  }) => {
    setUserName(data.name)
    transitionTo("chat")
  }

  const handleChatComplete = () => {
    transitionTo("categories")
  }

  const handleCategoriesNext = (category: string) => {
    setSelectedCategory(category)
    transitionTo("matches")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className={`transition-all duration-400 ease-in-out ${isTransitioning
          ? "scale-95 opacity-0"
          : "scale-100 opacity-100"
          }`}
      >
        {screen === "profile" && <ProfileSetup onNext={handleProfileNext} />}
        {screen === "chat" && (
          <AIChat userName={userName} onComplete={handleChatComplete} />
        )}
        {screen === "categories" && (
          <CategorySelection onNext={handleCategoriesNext} />
        )}
        {screen === "matches" && (
          <MatchDeck
            userName={userName}
            category={selectedCategory}
            onBack={() => transitionTo("categories")}
          />
        )}
      </div>
    </main>
  )
}
