"use client"

import { useState } from "react"
import { User, Camera, ArrowRight } from "lucide-react"

interface ProfileSetupProps {
  onNext: (data: { name: string; age: string; location: string }) => void
  initialName?: string
  email?: string
}

export function ProfileSetup({ onNext, initialName = "", email }: ProfileSetupProps) {
  const [name, setName] = useState(initialName)
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = () => {
    if (name && age && location) {
      onNext({ name, age, location })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Welcome to SocialCue
          </h1>
          <p className="text-base text-muted-foreground">
            {"Let's set up your profile to get started"}
          </p>
          {email && (
            <div className="mt-4 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Signed in as {email}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="mb-10 flex justify-center">
          <button
            type="button"
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-secondary transition-all hover:bg-muted"
            aria-label="Upload profile photo"
          >
            <User className="h-10 w-10 text-muted-foreground" />
            <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Camera className="h-4 w-4" />
            </div>
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border-b-2 border-border bg-transparent py-3 text-lg text-foreground placeholder-muted-foreground/50 outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Age
            </label>
            <input
              id="age"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="How old are you?"
              className="w-full border-b-2 border-border bg-transparent py-3 text-lg text-foreground placeholder-muted-foreground/50 outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your city or neighborhood"
              className="w-full border-b-2 border-border bg-transparent py-3 text-lg text-foreground placeholder-muted-foreground/50 outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name || !age || !location}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          Next
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-2.5 w-8 rounded-full bg-primary" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}
