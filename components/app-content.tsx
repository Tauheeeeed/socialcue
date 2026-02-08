"use client"

import { useState, useEffect } from "react"
import { ProfileSetup } from "@/components/onboarding/profile-setup"
import { AIChat } from "@/components/onboarding/ai-chat"
import { CategorySelection } from "@/components/category-selection"
import { MatchDeck } from "@/components/match-deck"
import { ProfileView } from "@/components/profile-view"
import { ChatRoom } from "@/components/chat-room"
import { BadgeCollection } from "@/components/badge-collection"
import { getUserAchievements, INITIAL_PROGRESS, UserAchievement } from "@/lib/achievements"
import { NotificationToast } from "@/components/notification-toast"

type Screen = "profile" | "chat" | "categories" | "matches" | "profile-view" | "chat-room" | "badges"

interface AppContentProps {
  user?: any
  email?: string
}

export function AppContent({ user, email }: AppContentProps) {
  const [screen, setScreen] = useState<Screen>("profile")
  const [previousScreen, setPreviousScreen] = useState<Screen>("profile")
  const [userName, setUserName] = useState(user?.name || "")
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [currentMatchName, setCurrentMatchName] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userStats, setUserStats] = useState(INITIAL_PROGRESS)
  const [unlockedBadge, setUnlockedBadge] = useState<UserAchievement | null>(null)

  const achievements = getUserAchievements(userStats)

  // Track unlocks
  useEffect(() => {
    const newUnlock = achievements.find(a => a.unlocked && a.progress === a.total)
    // In a real app, we'd compare with previous state to avoid duplicates
    // For now, we'll just check if it's the specific interaction we just did
  }, [achievements])

  const transitionTo = (next: Screen) => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (next === "profile-view") {
        setPreviousScreen(screen)
      }
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
    setAge(data.age)
    setLocation(data.location)
    transitionTo("chat")
  }

  const handleChatComplete = () => {
    transitionTo("categories")
  }

  const handleCategoriesNext = (category: string) => {
    setSelectedCategory(category)
    transitionTo("matches")
  }

  const handleMatchFound = (matchName: string) => {
    setCurrentMatchName(matchName)

    // Increment social stats
    const newStats = {
      ...userStats,
      peopleMet: userStats.peopleMet + 1
    }
    setUserStats(newStats)

    // Check for NEW unlocks
    const prevAchievements = getUserAchievements(userStats)
    const newAchievements = getUserAchievements(newStats)

    const newUnlock = newAchievements.find(newBadge =>
      newBadge.unlocked && !prevAchievements.find(p => p.id === newBadge.id)?.unlocked
    )

    if (newUnlock) {
      setTimeout(() => setUnlockedBadge(newUnlock), 1500) // Delay to show after match animation
    }

    transitionTo("chat-room")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className={`transition-all duration-400 ease-in-out ${isTransitioning
          ? "scale-95 opacity-0"
          : "scale-100 opacity-100"
          }`}
      >
        {screen === "profile" && <ProfileSetup onNext={handleProfileNext} initialName={user?.name} email={email} />}
        {screen === "chat" && (
          <AIChat
            userName={userName}
            onComplete={handleChatComplete}
            onProfile={() => transitionTo("profile-view")}
          />
        )}
        {screen === "categories" && (
          <CategorySelection
            onNext={handleCategoriesNext}
            onProfile={() => transitionTo("profile-view")}
          />
        )}
        {screen === "matches" && (
          <MatchDeck
            userName={userName}
            age={age}
            location={location}
            category={selectedCategory}
            onBack={() => transitionTo("categories")}
            onProfile={() => transitionTo("profile-view")}
            onMatchFound={handleMatchFound}
          />
        )}
        {screen === "profile-view" && (
          <ProfileView
            userName={userName}
            age={age}
            location={location}
            category={selectedCategory}
            achievements={achievements}
            onBack={() => transitionTo(previousScreen)}
            onViewBadges={() => transitionTo("badges")}
          />
        )}
        {screen === "chat-room" && (
          <ChatRoom
            userName={userName}
            matchName={currentMatchName}
            onBack={() => transitionTo("matches")}
          />
        )}
        {screen === "badges" && (
          <BadgeCollection
            achievements={achievements}
            onBack={() => transitionTo("profile-view")}
          />
        )}

        {unlockedBadge && (
          <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
            <NotificationToast
              badge={unlockedBadge}
              onClose={() => setUnlockedBadge(null)}
            />
          </div>
        )}
      </div>
    </main>
  )
}
