"use client"

import { useState } from "react"
import { ArrowRight, User } from "lucide-react"

interface ProfileSetupProps {
    onNext: (data: { name: string; age: string; location: string; gender: string; acceptedGuidelines: boolean }) => void
    initialName?: string
    email?: string
}

export function ProfileSetup({ onNext, initialName, email }: ProfileSetupProps) {
    const [name, setName] = useState(initialName || "")
    const [age, setAge] = useState("")
    const [location, setLocation] = useState("")
    const [gender, setGender] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && age && location && gender) {
            onNext({ name, age, location, gender, acceptedGuidelines: true })
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
                        <label className="text-sm font-medium">Display Name <span className="text-red-500">*</span></label>
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
                            <label className="text-sm font-medium">Age <span className="text-red-500">*</span></label>
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
                            <label className="text-sm font-medium">Gender <span className="text-red-500">*</span></label>
                            <select
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="" disabled>Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Self-describe">Self-describe</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            placeholder="City"
                        />
                    </div>

                    <div className="pt-4">
                        <label className="flex items-start gap-3 p-4 rounded-xl border border-input bg-card/50 cursor-pointer hover:bg-card hover:border-violet-200 transition-all">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <div className="space-y-1">
                                <span className="font-semibold text-sm block">I agree to the Community Guidelines <span className="text-red-500">*</span></span>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    I will treat everyone with respect, prioritize safety, and ensure SocialCue remains a harassment-free space.
                                </p>
                            </div>
                        </label>
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
