"use client"

import { useRouter } from "next/navigation"
import { ProfileSetup } from "@/components/onboarding/profile-setup"

interface AppContentProps {
    user?: any
    email?: string
}

export function AppContent({ user, email }: AppContentProps) {
    const router = useRouter()

    // After form submit we go to chat; server handles redirect to categories when onboarding is complete.

    const handleProfileNext = async (data: {
        name: string
        age: string
        location: string
    }) => {
        try {
            const response = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const { id } = await response.json()
                localStorage.setItem("socialcue_user_id", id)
                router.push("/chat")
            } else {
                console.error("Failed to save profile")
            }
        } catch (error) {
            console.error("Error saving profile:", error)
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            <ProfileSetup onNext={handleProfileNext} initialName={user?.name} email={email} />
        </main>
    )
}
