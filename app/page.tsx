import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/db";
import { AppContent } from "@/components/app-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth0.getSession();

  if (session) {
    const user = await prisma.user.findUnique({
      where: { auth0Sub: session.user.sub },
    });

    if (user) {
      redirect("/categories");
    }

    return <AppContent user={session.user} email={session.user.email} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.svg"
                alt="SocialCue"
                className="h-56 w-auto object-contain drop-shadow-lg"
              />
            </div>
            {/* 
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl shadow-violet-500/30 mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              SocialCue
            </h1> 
            */}
            <p className="text-lg text-muted-foreground">
              Connect offline. Make real friendships. Live life together.
            </p>
          </div>

          <Card className="border-2 border-violet-100 shadow-xl shadow-violet-500/10 overflow-hidden">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Ready to connect?</CardTitle>
              <CardDescription>
                Get started with a quick intro. It only takes a minute.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30"
              >
                <a href="/auth/login?screen_hint=signup">Get Started</a>
              </Button>
              <div className="mt-4 text-center">
                <a href="/auth/login" className="text-sm text-violet-600 hover:underline">
                  Already have an account? Login
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

