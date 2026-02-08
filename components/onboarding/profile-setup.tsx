"use client"

import { useState } from "react"
import { ArrowRight, User } from "lucide-react"

interface ProfileSetupProps {
    onNext: (data: { name: string; age: string; location: string; acceptedGuidelines: boolean }) => void
    initialName?: string
    email?: string
}

export function ProfileSetup({ onNext, initialName, email }: ProfileSetupProps) {
    const [name, setName] = useState(initialName || "")
    const [age, setAge] = useState("")
    const [location, setLocation] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && age && location) {
            onNext({ name, age, location, acceptedGuidelines: true })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Create Profile</h1>
                    <p className="mt-2 text-muted-foreground">
                        Let's get to know you better
                    </p>
                    {email && <p className="text-xs text-muted-foreground mt-1">Signed in as {email}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Display Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            placeholder="How should we call you?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Age</label>
                            <input
                                type="number"
                                required
                                min="18"
                                max="100"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="24"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="City"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98] mt-8 flex items-center justify-center gap-2"
                    >
                        Continue
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
