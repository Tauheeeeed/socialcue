import { auth0 } from "@/lib/auth0";
import { AppContent } from "@/components/app-content";

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          SocialCue
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          Connect with people who share your interests. Sign in to get started.
        </p>
        <div className="flex gap-4">
          <a
            href="/auth/login?screen_hint=signup"
            className="rounded-2xl bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Sign Up
          </a>
          <a
            href="/auth/login"
            className="rounded-2xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  // Sanitize user name: If it looks like an email, try nickname or given_name, otherwise empty.
  const user = session.user;
  let displayName = user.name;

  if (!displayName || displayName.includes("@")) {
    if (user.nickname && !user.nickname.includes("@")) {
      displayName = user.nickname;
    } else if (user.given_name) {
      displayName = user.given_name;
    } else {
      displayName = ""; // Force user to enter name in ProfileSetup
    }
  }

  const sanitizedUser = {
    ...user,
    name: displayName,
    email: user.email
  };

  return <AppContent user={sanitizedUser} email={user.email} />;
}
