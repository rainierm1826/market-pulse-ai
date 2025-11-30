"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("w-full border-b", className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight group">
          <div className="relative bg-primary text-primary-foreground rounded-lg p-1.5 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
              <circle cx="19" cy="9" r="2"/>
            </svg>
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Market Pulse <span className="text-primary">AI</span>
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/signup"><Button variant="outline" size="sm">Sign Up</Button></Link>
          <Link href="/signin"><Button size="sm">Sign In</Button></Link>
        </div>
      </div>
    </header>
  );
}
