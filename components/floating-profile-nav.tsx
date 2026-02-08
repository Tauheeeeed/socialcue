"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { User } from "lucide-react"

export function FloatingProfileNav() {
    const pathname = usePathname()

    // Hide on landing page (setup) and auth pages
    if (pathname === "/" || pathname.startsWith("/auth")) return null

    return (
        <Link
            href="/profile"
            className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 transition-transform hover:scale-105 active:scale-95"
        >
            <User className="h-5 w-5 text-gray-700" />
        </Link>
    )
}
