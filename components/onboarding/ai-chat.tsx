"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Sparkles } from "lucide-react"

interface AIChatProps {
  userName: string
  onComplete: (interests: string[]) => void
}

interface Message {
  id: number
  text: string
  sender: "ai" | "user"
}

const AI_QUESTIONS = [
  {
    question: "Hey {name}! I'm Cue, your connection assistant. Let's find your people. Do you enjoy outdoor activities?",
    options: ["Hiking & Trails", "Beach & Water", "Parks & Gardens", "Not really"],
  },
  {
    question: "Great choice! What about food and dining? What's your vibe?",
    options: ["Trying new restaurants", "Cooking together", "Food festivals", "Coffee & cafes"],
  },
  {
    question: "Almost done! Are you into any sports or fitness?",
    options: ["Team sports", "Gym & weights", "Yoga & wellness", "Casual games"],
  },
]

export function AIChat({ userName, onComplete }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [interests, setInterests] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Show first AI message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false)
      setMessages([
        {
          id: 1,
          text: AI_QUESTIONS[0].question.replace("{name}", userName),
          sender: "ai",
        },
      ])
    }, 1200)
    return () => clearTimeout(timer)
  }, [userName])

  const handleOptionSelect = (option: string) => {
    if (isProcessing) return

    const newInterests = [...interests, option]
    setInterests(newInterests)

    // Add user message
    const userMsg: Message = {
      id: messages.length + 1,
      text: option,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMsg])

    const nextQ = currentQuestion + 1

    if (nextQ < AI_QUESTIONS.length) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const aiMsg: Message = {
          id: messages.length + 2,
          text: AI_QUESTIONS[nextQ].question,
          sender: "ai",
        }
        setMessages((prev) => [...prev, aiMsg])
        setCurrentQuestion(nextQ)
      }, 1000)
    } else {
      // All questions answered, show processing
      setIsProcessing(true)
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const finalMsg: Message = {
          id: messages.length + 2,
          text: `Perfect, ${userName}! I've got a great picture of your interests. Let me build your profile...`,
          sender: "ai",
        }
        setMessages((prev) => [...prev, finalMsg])

        // Start progress animation
        let p = 0
        const interval = setInterval(() => {
          p += 2
          setProgress(p)
          if (p >= 100) {
            clearInterval(interval)
            setTimeout(() => onComplete(newInterests), 500)
          }
        }, 40)
      }, 800)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Cue AI</h2>
          <p className="text-xs text-muted-foreground">
            {isTyping ? "typing..." : "online"}
          </p>
        </div>
        <div className="ml-auto">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                msg.sender === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-card text-card-foreground shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Options / Input Area */}
      <div className="border-t border-border bg-background px-4 pb-6 pt-4">
        {isProcessing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-spin text-primary" />
              <span>Building your interest profile...</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="animate-glow-pulse h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {progress}% complete
            </p>
          </div>
        ) : !isTyping && currentQuestion < AI_QUESTIONS.length ? (
          <div className="flex flex-wrap gap-2">
            {AI_QUESTIONS[currentQuestion].options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
            <span className="flex-1 text-sm text-muted-foreground">
              Waiting for Cue...
            </span>
            <Send className="h-4 w-4 text-muted-foreground/40" />
          </div>
        )}
      </div>
    </div>
  )
}
