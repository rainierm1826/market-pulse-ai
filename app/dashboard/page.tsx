"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Footer } from "../../components/footer";
import { ThemeToggle } from "../../components/theme-toggle";
import assets from "@/lib/assets.json";
import priceChart from "@/lib/price_chart.json";
import sentimentDistribution from "@/lib/sentiment_distribution.json";
import sentimentOverTime from "@/lib/sentiment_over_time.json";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  subscription: string;
};

type Asset = {
  symbol: string;
  name: string;
  type: "stock" | "crypto";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<7 | 30>(30);
  const [sentimentRange, setSentimentRange] = React.useState<7 | 30>(7);
  const [source, setSource] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<"all" | "stock" | "crypto">("all");
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>({ symbol: "BTC", name: "Bitcoin", type: "crypto" });
  const [watchlist, setWatchlist] = React.useState<Asset[]>([]);
  const [priceData, setPriceData] = React.useState<Array<{ date: string; price: number }>>(priceChart as Array<{ date: string; price: number }>);
  const [sentimentData, setSentimentData] = React.useState<Array<{ date: string; positive: number; neutral: number; negative: number; sources?: Record<string, {positive:number;neutral:number;negative:number}> }>>(sentimentOverTime as Array<{ date: string; positive: number; neutral: number; negative: number; sources?: Record<string, {positive:number;neutral:number;negative:number}> }>);
  const [convAmount, setConvAmount] = React.useState<number>(1);
  const [convCurrency, setConvCurrency] = React.useState<string>("PHP");
    const plan = (user?.subscription || "").toLowerCase();
    const isFree = plan === "free";
  // const isPro = user?.subscription === "pro";
  // const isPremium = user?.subscription === "premium";

  React.useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("mp_user") : null;
    if (!raw) {
      router.replace("/signin");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as User;
      if (!parsed?.email) {
        router.replace("/signin");
        return;
      }
      setUser(parsed);
    } catch {
      router.replace("/signin");
      return;
    } finally {
      setReady(true);
    }
  }, [router]);

  React.useEffect(() => {
    if (!user) return;
    const key = `mp_watchlist_${user.email}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setWatchlist(JSON.parse(raw) as Asset[]);
    } catch {}
  }, [user]);

  React.useEffect(() => {
    async function load() {
      const symbol = selectedAsset?.symbol || "BTC";
      try {
        const pr = await fetch(`/data/${symbol}/price_chart.json`);
        if (pr.ok) {
          const pdata = await pr.json();
          setPriceData(pdata as Array<{ date: string; price: number }>);
        } else {
          setPriceData(priceChart as Array<{ date: string; price: number }>);
        }
      } catch { setPriceData(priceChart as Array<{ date: string; price: number }>); }
      try {
        const se = await fetch(`/data/${symbol}/sentiment_over_time.json`);
        if (se.ok) {
          const sdata = await se.json();
          setSentimentData(sdata as Array<{ date: string; positive: number; neutral: number; negative: number; sources?: Record<string, {positive:number;neutral:number;negative:number}> }>);
        } else {
          setSentimentData(sentimentOverTime as Array<{ date: string; positive: number; neutral: number; negative: number; sources?: Record<string, {positive:number;neutral:number;negative:number}> }>);
        }
      } catch { setSentimentData(sentimentOverTime as Array<{ date: string; positive: number; neutral: number; negative: number; sources?: Record<string, {positive:number;neutral:number;negative:number}> }>); }
    }
    load();
  }, [selectedAsset]);

  function getUsdPriceFor(symbol: string, type: "stock" | "crypto") {
    if (type === "crypto") return 50000;
    return 100;
  }
  function convertAmount(): number {
    const usdPrice = getUsdPriceFor(selectedAsset?.symbol || "BTC", selectedAsset?.type || "crypto");
    const usdValue = convAmount * usdPrice;
    if (convCurrency === "USD") return usdValue;
    if (convCurrency === "PHP") return usdValue * 56;
    return usdValue;
  }

  function saveWatchlist(next: Asset[]) {
    if (!user) return;
    const key = `mp_watchlist_${user.email}`;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }

  function addToWatchlist(asset: Asset) {
    const exists = watchlist.some((a) => a.symbol === asset.symbol);
    if (exists) return;
    const next = [...watchlist, asset];
    setWatchlist(next);
    saveWatchlist(next);
  }

  function removeFromWatchlist(symbol: string) {
    const next = watchlist.filter((a) => a.symbol !== symbol);
    setWatchlist(next);
    saveWatchlist(next);
  }

  function signOut() {
    try { localStorage.removeItem("mp_user"); } catch {}
    router.replace("/signin");
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-screen items-center justify-center px-6 py-8">
        <div className="text-sm text-muted-foreground">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="w-full min-h-screen px-6 2xl:px-10 py-8">
        {/* Top bar */}
        <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[1920px]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Market Pulse AI</h1>
              {user && (
                <p className="text-xs text-muted-foreground mt-1">Signed in as {user.email}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link href="/settings"><Button variant="ghost" size="sm">Settings</Button></Link>
              <Link href="#pricing"><Button variant="ghost" size="sm">Pricing</Button></Link>
              <Link href="#features"><Button variant="ghost" size="sm">Features</Button></Link>
              <Link href="#docs"><Button variant="ghost" size="sm">Documentation</Button></Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
            </div>
          </div>

          {/* Search + asset header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-1 max-w-xl relative">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
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
              {/* Suggestions dropdown */}
              {searchOpen && (
                <div className="absolute left-0 right-0 z-20 mt-2 rounded-lg border bg-background shadow">
                  {(
                    (assets as Asset[])
                      .filter(a => (typeFilter === "all" ? true : a.type === typeFilter))
                      .filter(a => {
                        const q = query.trim().toLowerCase();
                        if (!q) return true;
                        return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
                      })
                      .slice(0, 8)
                  ).map(a => (
                    <button
                      key={a.symbol}
                      className="flex w-full items-center justify-between px-3 py-2 hover:bg-muted"
                      onMouseDown={() => { setSelectedAsset(a); setQuery(""); setSearchOpen(false); }}
                    >
                      <div className="text-left">
                        <div className="text-sm font-medium">{a.symbol}</div>
                        <div className="text-xs text-muted-foreground">{a.name} · {a.type}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isFree}
                          onMouseDown={(e) => { e.preventDefault(); addToWatchlist(a); }}
                        >Star</Button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <h2 className="text-2xl font-bold">{selectedAsset ? `${selectedAsset.symbol} (${selectedAsset.name})` : "BTC (Bitcoin)"}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFree}
                  onClick={() => selectedAsset && addToWatchlist(selectedAsset)}
                  title="Add to Watchlist"
                >★</Button>
              </div>
              <p className="text-xs text-muted-foreground">Live sentiment and price overview</p>
            </div>
          </div>

          {/* Main grid, full width */}
          <div className="grid grid-cols-12 gap-4">
            {/* Main: Sentiment Over Time with filters */}
            <div className="col-span-12 xl:col-span-9">
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle>Sentiment Over Time</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select
                        value={String(sentimentRange)}
                        onValueChange={(v) => setSentimentRange(Number(v) as 7 | 30)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          {!isFree && (<SelectItem value="30">Last 30 days</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {!isFree && (
                        <Select
                          value={source}
                          onValueChange={(v) => setSource(v)}
                        >
                          <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All sources</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="reddit">Reddit</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="yahoo">Yahoo Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={560}>
                    <LineChart data={(sentimentData as Array<{ date: string; positive: number; neutral: number; negative: number; sources?: Record<string, {positive:number;neutral:number;negative:number}> }>)
                      .map(d => {
                        if (source === 'all' || !d.sources) return d;
                        const s = d.sources[source];
                        return s ? { ...d, positive: s.positive, neutral: s.neutral, negative: s.negative } : d;
                      })
                      .slice(-(sentimentRange))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#333', strokeWidth: 1 }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#333', strokeWidth: 1 }} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #8b5cf6', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      <Line type="monotone" dataKey="positive" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="neutral" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="negative" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 xl:col-span-3 space-y-4">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Watchlist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {watchlist.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No assets yet. Search and add to your watchlist.</div>
                  ) : (
                    watchlist.map((a) => (
                      <div key={a.symbol} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{a.symbol}</div>
                          <div className="text-xs text-muted-foreground">{a.name} · {a.type}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeFromWatchlist(a.symbol)}>Remove</Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>{selectedAsset ? `${selectedAsset.symbol} Historical Price` : `BTC Historical Price`}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">All-Time High</span>
                    <span className="font-medium">$126,080 <span className="text-red-500 text-xs">12.0%</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">All-Time Low</span>
                    <span className="font-medium">$67.81 <span className="text-green-500 text-xs">163.55%</span></span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>{selectedAsset ? `${selectedAsset.symbol} Converter` : `BTC Converter`}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      className="rounded-md border px-3 py-2"
                      value={String(convAmount)}
                      onChange={(e) => setConvAmount(Number(e.target.value) || 0)}
                    />
                    <input className="rounded-md border px-3 py-2" value={String(convertAmount())} readOnly />
                    <Select value={convCurrency} onValueChange={(v) => setConvCurrency(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHP">PHP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <div className="">
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <div className="flex items-center gap-2">
                      {!isFree && (
                        <Select
                          value={source}
                          onValueChange={(v) => setSource(v)}
                        >
                          <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All sources</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="reddit">Reddit</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="yahoo">Yahoo Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const sd = sentimentDistribution as {
                      total?: { positive: number; neutral: number; negative: number };
                      sources?: Record<string, { positive: number; neutral: number; negative: number }>;
                      positive?: number; neutral?: number; negative?: number;
                    };
                    const base = source === 'all'
                      ? (sd.total ?? { positive: sd.positive ?? 0, neutral: sd.neutral ?? 0, negative: sd.negative ?? 0 })
                      : (sd.sources?.[source] ?? sd.total ?? { positive: sd.positive ?? 0, neutral: sd.neutral ?? 0, negative: sd.negative ?? 0 });
                    const items = [
                      { label: 'Positive', value: base.positive, color: 'bg-violet-500' },
                      { label: 'Neutral', value: base.neutral, color: 'bg-violet-400' },
                      { label: 'Negative', value: base.negative, color: 'bg-violet-700' }
                    ];
                    return (
                      <>
                        {items.map((i) => (
                          <div key={i.label}>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>{i.label}</span>
                              <span className="font-semibold">{i.value}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className={`h-full ${i.color}`} style={{ width: `${i.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </CardContent>
                </Card>

              </div>
              {/* Close main grid */}
              </div>

              {/* Full-width Market Summary row */}
          <div className="mt-4">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Market Summary</CardTitle>
                  <Select
                    value={String(dateRange)}
                    onValueChange={(v) => setDateRange(Number(v) as 7 | 30)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={(priceData as Array<{ date: string; price: number }>).slice(-(dateRange))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#333', strokeWidth: 1 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#333', strokeWidth: 1 }} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #8b5cf6', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
