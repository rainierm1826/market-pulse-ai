"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { ThemeToggle } from "../../components/theme-toggle";

type User = { id: string; name: string; email: string; password: string; subscription: "free" | "pro" | "premium" };

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState(false);
  const [renewalDate, setRenewalDate] = React.useState<string>("");
  const [usage, setUsage] = React.useState<{ searchesToday: number; watchlistCount: number }>({ searchesToday: 0, watchlistCount: 0 });
  const [apiKey, setApiKey] = React.useState<string>("");
  const [showKey, setShowKey] = React.useState<boolean>(false);
  const plan = (user?.subscription || "").toLowerCase();
  const isFree = plan === "free";
  const isPro = plan === "pro";
  const isPremium = plan === "premium";
  // Usage caps aligned to `lib/plans.json`.
  const FREE_SEARCH_LIMIT = 3;
  // Free users have no watchlist
  // Note: using conditional UI instead of numeric limit
  const PRO_WATCHLIST_LIMIT = 20;

  React.useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("mp_user") : null;
    if (!raw) { router.replace("/signin"); return; }
    try {
      const parsed = JSON.parse(raw) as User;
      setUser(parsed);
      // demo renewal in 30 days
      const now = new Date();
      now.setDate(now.getDate() + 30);
      setRenewalDate(now.toISOString().slice(0, 10));
      // mock usage
      const wlKey = parsed?.email ? `mp_watchlist_${parsed.email}` : "";
      let wlCount = 0;
      try {
        const rawWL = wlKey ? localStorage.getItem(wlKey) : null;
        if (rawWL) {
          const parsedWL: unknown = JSON.parse(rawWL);
          wlCount = Array.isArray(parsedWL) ? parsedWL.length : 0;
        }
      } catch {}
      setUsage({ searchesToday: isFree ? 1 : 10, watchlistCount: wlCount });
      // load API key if any
      const keyName = parsed?.email ? `mp_api_key_${parsed.email}` : "";
      if (keyName) {
        try { const k = localStorage.getItem(keyName); if (k) setApiKey(k); } catch {}
      }
    } catch { router.replace("/signin"); return; }
    setReady(true);
  }, [router, isFree]);

  function randomKey(len = 32): string {
    const bytes = new Uint8Array(len);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
    return `mp_live_${hex.slice(0, len * 2)}`;
  }

  function persistKey(next: string) {
    if (!user?.email) return;
    try { localStorage.setItem(`mp_api_key_${user.email}`, next); } catch {}
    setApiKey(next);
  }

  function handleGenerate() {
    const key = randomKey(24);
    persistKey(key);
  }

  function handleRotate() { handleGenerate(); }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(apiKey); } catch {}
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-screen items-center justify-center px-6 py-8">
        <div className="text-sm text-muted-foreground">Loading settings…</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 2xl:px-10 py-8">
      <div className="mx-auto w-full max-w-[1000px]">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Plan</span>
              <span className="font-medium capitalize">{user?.subscription}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Renewal Date</span>
              <span className="font-medium">{renewalDate}</span>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button>Renew</Button>
              {!isPremium && (<Button variant="outline" onClick={() => alert("Upgrade flow not implemented")}>Upgrade</Button>)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mt-4">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="text-xs text-muted-foreground">
              {isFree && (
                <span>Free plan: 3 searches/day, no watchlist.</span>
              )}
              {isPro && (
                <span>Pro plan: Unlimited searches, watchlist up to 20.</span>
              )}
              {isPremium && (
                <span>Premium plan: Unlimited searches and watchlist.</span>
              )}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground">Sentiment searches today</span>
                {isFree ? (
                  <span className="text-xs text-muted-foreground">{usage.searchesToday} / {FREE_SEARCH_LIMIT}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Unlimited</span>
                )}
              </div>
              {isFree ? (
                <Slider value={[Math.min(usage.searchesToday, FREE_SEARCH_LIMIT)]} max={FREE_SEARCH_LIMIT} disabled className="w-full" />
              ) : (
                <Slider value={[0]} max={1} disabled className="w-full" />
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground">Watchlist count</span>
                {isFree && (
                  <span className="text-xs text-muted-foreground">No watchlist on Free</span>
                )}
                {isPro && (
                  <span className="text-xs text-muted-foreground">{usage.watchlistCount} / {PRO_WATCHLIST_LIMIT}</span>
                )}
                {isPremium && (
                  <span className="text-xs text-muted-foreground">Unlimited</span>
                )}
              </div>
              {isFree && (
                <Slider value={[0]} max={1} disabled className="w-full" />
              )}
              {isPro && (
                <Slider value={[Math.min(usage.watchlistCount, PRO_WATCHLIST_LIMIT)]} max={PRO_WATCHLIST_LIMIT} disabled className="w-full" />
              )}
              {isPremium && (
                <Slider value={[0]} max={1} disabled className="w-full" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mt-4">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email alerts</span>
              <div>
                {isFree ? (
                  <span className="text-xs text-muted-foreground">Available on Pro & Premium</span>
                ) : (
                  <Select defaultValue="on" onValueChange={() => {}}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Email" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mt-4">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isPremium ? (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Primary Key</span>
                  {apiKey ? (
                    <code className="rounded bg-muted px-2 py-1 text-xs">
                      {showKey ? apiKey : `${apiKey.slice(0, 8)}••••••••••••${apiKey.slice(-4)}`}
                    </code>
                  ) : (
                    <span className="text-xs text-muted-foreground">No key generated</span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  {!apiKey && <Button onClick={handleGenerate}>Generate</Button>}
                  {apiKey && (
                    <>
                      <Button variant="outline" onClick={() => setShowKey(v => !v)}>{showKey ? "Hide" : "Reveal"}</Button>
                      <Button variant="outline" onClick={handleCopy}>Copy</Button>
                      <Button onClick={handleRotate}>Rotate</Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">API access is available on Premium</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
