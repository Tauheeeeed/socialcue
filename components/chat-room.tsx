"use client"

import { useState } from "react"
import { ChevronLeft, Send, Phone, Video, MoreVertical } from "lucide-react"

interface ChatRoomProps {
    userName: string
    matchName: string
    onBack: () => void
}

export function ChatRoom({ userName, matchName, onBack }: ChatRoomProps) {
    const [messages, setMessages] = useState([
        { id: 1, sender: matchName, text: "Hey! I saw you're interested in hiking too.", time: "10:30 AM" },
        { id: 2, sender: matchName, text: "Have you been to Land's End?", time: "10:31 AM" },
    ])
    const [inputText, setInputText] = useState("")

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputText.trim()) return

        const newMessage = {
            id: messages.length + 1,
            sender: userName,
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages([...messages, newMessage])
        setInputText("")
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {matchName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-semibold leading-tight">{matchName}</h2>
                            <span className="text-xs text-muted-foreground">Active now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center text-xs text-muted-foreground my-4">
                    Today
                </div>
                {messages.map((msg) => {
                    const isMe = msg.sender === userName
                    return (
                        <div
                            key={msg.id}
                            className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted text-foreground rounded-tl-none"
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <span className={`text-[10px] mt-1 block ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <div className="sticky bottom-0 border-t border-border bg-background p-4 safe-area-bottom">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
