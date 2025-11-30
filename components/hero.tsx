import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function Hero({ className }: { className?: string }) {
  return (
    <section className={cn("mx-auto max-w-5xl px-6 py-24 text-center", className)}>
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        AI-Powered Market Sentiment for Smarter Crypto & Stock Decisions
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
        Market Pulse AI analyzes millions of social media posts, news articles, and market signals to give you real-time insights into trader emotions and market trends — helping you stay ahead of every move.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button variant="outline" size="lg">Sign Up</Button>
        <Button size="lg">Start Now</Button>
      </div>
    </section>
  );
}
