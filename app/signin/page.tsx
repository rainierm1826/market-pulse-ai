"use client";
import * as React from "react";
import users from "../../lib/users.json";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "../../components/footer";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  subscription: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [authedUser, setAuthedUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("mp_user") : null;
    if (raw) {
      try {
        const existing = JSON.parse(raw) as User;
        if (existing?.email) {
          setAuthedUser(existing);
          router.replace("/dashboard");
        }
      } catch {}
    }
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAuthedUser(null);
    const match = (users as User[]).find(u => u.email === email.trim());
    if (!match) {
      setError("No account found for this email.");
      return;
    }
    if (match.password !== password) {
      setError("Incorrect password.");
      return;
    }
    try {
      localStorage.setItem("mp_user", JSON.stringify(match));
    } catch {}
    setAuthedUser(match);
    router.push("/dashboard");
  }

  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[1920px] px-6 py-10 md:py-14">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">← Back to Home</Button>
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-8 items-stretch">
            {/* Left hero / brand panel */}
            <div className="relative col-span-12 lg:col-span-7 hidden md:block">
              <div className="h-full min-h-[520px] rounded-2xl border bg-muted p-8">
                <div className="max-w-lg">
                  <div className="mb-2 text-xs font-medium text-violet-600">Market Pulse AI</div>
                  <h1 className="mb-3 text-3xl font-bold tracking-tight">Sign in to your account</h1>
                  <p className="text-sm text-muted-foreground">Track live sentiment, AI insights, and price trends across assets — all in one streamlined dashboard.</p>
                </div>
                <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-card p-4 text-sm">
                    <div className="font-semibold">Live Sentiment</div>
                    <div className="text-muted-foreground">Monitor positive, neutral, and negative shifts.</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4 text-sm">
                    <div className="font-semibold">AI Insights</div>
                    <div className="text-muted-foreground">Digestible summaries and actionable signals.</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4 text-sm">
                    <div className="font-semibold">Price Trends</div>
                    <div className="text-muted-foreground">See movements at a glance.</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4 text-sm">
                    <div className="font-semibold">Watchlists</div>
                    <div className="text-muted-foreground">Focus on the assets you care about.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form panel */}
            <div className="col-span-12 lg:col-span-5 flex">
              <Card className="w-full max-w-lg mx-auto self-stretch">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border-2 bg-background px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="mb-1 block text-sm font-medium">Password</label>
                        <Link href="#" className="text-xs hover:underline">Forgot password?</Link>
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border-2 bg-background px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                    {error && (
                      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-sm">
                        {error}
                      </div>
                    )}
                    <Button className="w-full h-11" type="submit">Sign In</Button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="relative w-full h-11 justify-center gap-2">
                      <Image className="" src="/google.svg" alt="Google" width={16} height={16} />
                      <span>Sign In with Google</span>
                    </Button>
                    <Button variant="outline" className="relative w-full h-11 justify-center gap-2">
                      <Image className="" src="/facebook.svg" alt="GitHub" width={20} height={20} />
                      <span>Sign In with Facebook</span>
                    </Button>
                  </div>

                  {authedUser && (
                    <div className="mt-6 space-y-2 rounded-md border bg-muted/30 p-3 text-sm">
                      <div>Welcome, <span className="font-medium">{authedUser.name}</span>.</div>
                      <div>Subscription: <span className="font-medium">{authedUser.subscription}</span></div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground w-full justify-center text-center">
                  <span>
                    Don&apos;t have an account? <Link href="/signup" className="ml-1 underline">Sign Up</Link>
                  </span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
