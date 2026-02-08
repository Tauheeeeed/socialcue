"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileSetup } from "@/components/onboarding/profile-setup"

interface AppContentProps {
    user?: any
    email?: string
}

export function AppContent({ user, email }: AppContentProps) {
    const router = useRouter()

    useEffect(() => {
        // Check if user has already set up their profile
        const hasProfile = localStorage.getItem("socialcue_user_id")
        if (hasProfile) {
            router.replace("/categories")
        }
    }, [router])

    // We only need to handle the profile setup step here.
    // After setup, we redirect to the main app flow (/categories).

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
                router.push("/categories")
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
