"use client"

import { useEffect, useState } from "react"
import { X, Trophy } from "lucide-react"
import { UserAchievement } from "@/lib/achievements"

interface NotificationToastProps {
    badge: UserAchievement
    onClose: () => void
}

export function NotificationToast({ badge, onClose }: NotificationToastProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setIsVisible(true))

        // Auto-dismiss
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300) // Wait for exit animation
        }, 4000)

        return () => clearTimeout(timer)
    }, [onClose])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300)
    }

    return (
        <div
            className={`fixed inset-x-0 bottom-24 z-50 mx-auto flex w-full max-w-sm flex-col items-center justify-center px-4 transition-all duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
        >
            <div className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xl">
                {/* Glow effect */}
                <div className={`absolute -left-4 top-0 h-full w-2 rotate-12 blur-xl ${badge.color.split(' ')[0].replace('text-', 'bg-')}`} />

                <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${badge.color
                        }`}
                >
                    <badge.icon className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Badge Unlocked!
                    </p>
                    <h3 className="font-bold text-foreground truncate">{badge.name}</h3>
                </div>

                <button
                    onClick={handleClose}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-muted"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>
        </div>
    )
}
