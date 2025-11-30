"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import assets from "@/lib/assets.json";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";

type User = { id: string; name: string; email: string; password: string; subscription: string };
type Asset = { symbol: string; name: string; type: "stock" | "crypto" };

export default function WatchlistPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | "stock" | "crypto">("all");
  const [watchlist, setWatchlist] = React.useState<Asset[]>([]);

  React.useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("mp_user") : null;
    if (!raw) { router.replace("/signin"); return; }
    try {
      const parsed = JSON.parse(raw) as User;
      if (!parsed?.email) { router.replace("/signin"); return; }
      setUser(parsed);
    } catch { router.replace("/signin"); return; }
    setReady(true);
  }, [router]);

  React.useEffect(() => {
    if (!user) return;
    const key = `mp_watchlist_${user.email}`;
    try { const raw = localStorage.getItem(key); if (raw) setWatchlist(JSON.parse(raw) as Asset[]); } catch {}
  }, [user]);

  function saveWatchlist(next: Asset[]) {
    if (!user) return;
    const key = `mp_watchlist_${user.email}`;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }

  function addToWatchlist(asset: Asset) {
    const exists = watchlist.some(a => a.symbol === asset.symbol);
    if (exists) return;
    const next = [...watchlist, asset];
    setWatchlist(next);
    saveWatchlist(next);
  }

  function removeFromWatchlist(symbol: string) {
    const next = watchlist.filter(a => a.symbol !== symbol);
    setWatchlist(next);
    saveWatchlist(next);
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-screen items-center justify-center px-6 py-8">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 2xl:px-10 py-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Watchlist</h1>
          <p className="text-xs text-muted-foreground mt-1">Search and add stocks or crypto</p>
        </div>

        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle>Add Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search symbol or name"
                className="w-full rounded-lg border px-4 py-2"
              />
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "all" | "stock" | "crypto")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="stock">Stocks</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 rounded-lg border">
              {(
                (assets as Asset[])
                  .filter(a => (typeFilter === "all" ? true : a.type === typeFilter))
                  .filter(a => {
                    const q = query.trim().toLowerCase();
                    if (!q) return true;
                    return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
                  })
                  .slice(0, 10)
              ).map(a => (
                <div key={a.symbol} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{a.symbol}</div>
                    <div className="text-xs text-muted-foreground">{a.name} · {a.type}</div>
                  </div>
                  <Button size="sm" onClick={() => addToWatchlist(a)}>Add</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mt-4">
          <CardHeader>
            <CardTitle>Saved Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {watchlist.length === 0 ? (
              <div className="text-xs text-muted-foreground">No assets yet. Add from the search above.</div>
            ) : (
              watchlist.map(a => (
                <div key={a.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{a.symbol}</div>
                    <div className="text-xs text-muted-foreground">{a.name} · {a.type}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard?symbol=${a.symbol}`)}>Open</Button>
                    <Button variant="outline" size="sm" onClick={() => removeFromWatchlist(a.symbol)}>Remove</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
