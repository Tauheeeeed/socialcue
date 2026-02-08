"use client"

import { useState } from "react"
import { Send, ArrowLeft, User, Phone, Video, MoreVertical } from "lucide-react"

interface ChatRoomProps {
    userName: string
    matchName: string
    onBack: () => void
}

interface Message {
    id: string
    text: string
    sender: "me" | "them"
    timestamp: string
}

export function ChatRoom({ userName, matchName, onBack }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: `Hi ${userName}! I see you're interested in ${matchName} too!`,
            sender: "them",
            timestamp: "Just now",
        },
    ])
    const [inputText, setInputText] = useState("")

    const handleSend = () => {
        if (!inputText.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "me",
            timestamp: "Just now",
        }

        setMessages((prev) => [...prev, newMessage])
        setInputText("")

        // Simulate reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "That sounds great! When were you thinking of going?",
                sender: "them",
                timestamp: "Just now",
            }
            setMessages((prev) => [...prev, reply])
        }, 2000)
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                                <User className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-none text-foreground">
                                Match Participant
                            </h1>
                            <p className="text-xs text-muted-foreground">Online now</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
                <div className="mb-4 text-center">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        Matched on {matchName}
                    </span>
                </div>

                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === "me"
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-card text-foreground rounded-bl-none shadow-sm"
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <span className="mt-1 block text-[10px] opacity-70">
                                    {msg.timestamp}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-card p-4">
                <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
