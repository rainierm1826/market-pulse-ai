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
  const plan = (user?.subscription || "").toLowerCase();
  const isFree = plan === "free";
  // const isPro = plan === "pro";
  const isPremium = plan === "premium";
  // Usage caps (mock). Free has limits, Pro/Premium are effectively unlimited.
  const FREE_SEARCH_LIMIT = 5;
  const FREE_WATCHLIST_LIMIT = 5;

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
    } catch { router.replace("/signin"); return; }
    setReady(true);
  }, [router, isFree]);

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
                {isFree ? (
                  <span className="text-xs text-muted-foreground">{usage.watchlistCount} / {FREE_WATCHLIST_LIMIT}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Unlimited</span>
                )}
              </div>
              {isFree ? (
                <Slider value={[Math.min(usage.watchlistCount, FREE_WATCHLIST_LIMIT)]} max={FREE_WATCHLIST_LIMIT} disabled className="w-full" />
              ) : (
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
                  <span className="text-xs text-muted-foreground">No key generated</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button onClick={() => alert("Key generation not implemented")}>Generate</Button>
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
