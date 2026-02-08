"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Dumbbell, HeartHandshake, User } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const router = useRouter();

  useEffect(() => {
    // const hasProfile = localStorage.getItem("socialcue_user_id");
    // if (!hasProfile) {
    //   router.replace("/");
    // }
  }, [router]);

  const categories = [
    {
      title: "Meet New People",
      description: "Connect with strangers nearby—similar interests or surprise me for a random match",
      icon: Users,
      href: "/meet",
      gradient: "from-violet-500 to-fuchsia-500",
      shadow: "shadow-violet-500/30",
    },
    {
      title: "Activities",
      description: "Find people who want to play tennis, basketball, or any sport right now",
      icon: Dumbbell,
      href: "/activities",
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/30",
    },
    {
      title: "Community Service",
      description: "Volunteer and make a difference together with like-minded people",
      icon: HeartHandshake,
      href: "/community",
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Explore
              </h1>
              <p className="text-muted-foreground text-sm">
                Choose a category
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href}>
                <Card
                  className={`border-2 overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer group`}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg ${cat.shadow} group-hover:scale-110 transition-transform`}
                    >
                      <cat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{cat.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {cat.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
