"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "../../components/footer";

export default function SignUpPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Non-functional sign up per requirements
    alert("Sign Up is a placeholder in this demo.");
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
                  <h1 className="mb-3 text-3xl font-bold tracking-tight">Create your account</h1>
                  <p className="text-sm text-muted-foreground">Join to access live sentiment, AI insights, and customizable dashboards.</p>
                </div>
                <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-card p-4 text-sm">
                    <div className="font-semibold">Get Started Fast</div>
                    <div className="text-muted-foreground">No credit card required on Free.</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4 text-sm">
                    <div className="font-semibold">Upgrade Anytime</div>
                    <div className="text-muted-foreground">Advanced and Pro tiers available.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form panel */}
            <div className="col-span-12 lg:col-span-5 flex">
              <Card className="w-full max-w-lg mx-auto self-stretch">
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
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
                      <label className="mb-1 block text-sm font-medium">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border-2 bg-background px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Confirm your password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full rounded-lg border-2 bg-background px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                    <Button className="w-full h-11" type="submit">Create Account</Button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="relative w-full h-11 justify-center gap-2">
                      <Image src="/google.svg" alt="Google" width={16} height={16} />
                      <span>Sign Up with Google</span>
                    </Button>
                    <Button variant="outline" className="relative w-full h-11 justify-center gap-2">
                      <Image src="/facebook.svg" alt="Facebook" width={16} height={16} />
                      <span>Sign Up with Facebook</span>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground w-full justify-center text-center">
                  <span>
                    Already have an account? <Link href="/signin" className="ml-1 underline">Sign In</Link>
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
