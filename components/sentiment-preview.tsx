"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import allAssets from "@/lib/assets.json";
import defaultDistribution from "@/lib/sentiment_distribution.json";
import defaultSentimentOverTime from "@/lib/sentiment_over_time.json";

// UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface AssetRecord {
  symbol: string;
  name: string;
  type: "stock" | "crypto" | string;
}

type SentimentPoint = { date: string; positive: number; neutral: number; negative: number; sources?: Record<string, { positive: number; neutral: number; negative: number }> };
type Distribution = { total?: { positive: number; neutral: number; negative: number }; sources?: Record<string, { positive: number; neutral: number; negative: number }>; positive?: number; neutral?: number; negative?: number };

export default function SentimentPreview({ className }: { className?: string }) {
  // Pick 3 random assets from global list
  const baseAssets = (allAssets as Array<{ symbol: string; name: string; type: "stock" | "crypto" }>);
  const [assetList] = React.useState<AssetRecord[]>(() => {
    const shuffled = [...baseAssets].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [selected, setSelected] = React.useState<AssetRecord>(assetList[0]);
  const [hoveredSentiment, setHoveredSentiment] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<string>("all");
  const [sentimentData, setSentimentData] = React.useState<SentimentPoint[]>(defaultSentimentOverTime as SentimentPoint[]);
  const [distribution, setDistribution] = React.useState<Distribution>(defaultDistribution as Distribution);

  React.useEffect(() => {
    async function load() {
      const symbol = selected?.symbol || "BTC";
      try {
        const se = await fetch(`/data/${symbol}/sentiment_over_time.json`);
        if (se.ok) {
          const sdata = await se.json();
          setSentimentData(sdata as SentimentPoint[]);
        } else {
          setSentimentData(defaultSentimentOverTime as SentimentPoint[]);
        }
      } catch {
        setSentimentData(defaultSentimentOverTime as SentimentPoint[]);
      }
      try {
        const sd = await fetch(`/data/${symbol}/sentiment_distribution.json`);
        if (sd.ok) {
          const ddata = await sd.json();
          setDistribution(ddata as Distribution);
        } else {
          setDistribution(defaultDistribution as Distribution);
        }
      } catch {
        setDistribution(defaultDistribution as Distribution);
      }
    }
    load();
  }, [selected]);

  const totals = source === "all"
    ? (distribution.total ?? { positive: distribution.positive ?? 0, neutral: distribution.neutral ?? 0, negative: distribution.negative ?? 0 })
    : (distribution.sources?.[source] ?? distribution.total ?? { positive: distribution.positive ?? 0, neutral: distribution.neutral ?? 0, negative: distribution.negative ?? 0 });

  const chartData = (sentimentData as SentimentPoint[])
    .slice(-7)
    .map((item) => {
      if (source !== "all" && item.sources && item.sources[source]) {
        const s = item.sources[source];
        return {
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          Positive: s.positive,
          Neutral: s.neutral,
          Negative: s.negative,
        };
      }
      return {
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Positive: item.positive,
        Neutral: item.neutral,
        Negative: item.negative,
      };
    });

  const totalMentions = (totals.positive ?? 0) + (totals.neutral ?? 0) + (totals.negative ?? 0);

  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-16", className)}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Live Sentiment Analysis</h2>
        <p className="text-gray-600">Real-time market sentiment tracking across assets</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sentiment Trend Chart */}
        <Card className="border-2 hover:border-violet-500/50 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Sentiment Trend</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-gray-500">Last 7 Days</span>
                <Select value={source} onValueChange={(v) => setSource(v)}>
                  <SelectTrigger className="w-[160px]">
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
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pr-4 py-3">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#888' }}
                  axisLine={{ stroke: '#333', strokeWidth: 1 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#888' }}
                  axisLine={{ stroke: '#333', strokeWidth: 1 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#fff', fontWeight: 600 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="Positive" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Line 
                  type="monotone" 
                  dataKey="Neutral" 
                  stroke="#a78bfa" 
                  strokeWidth={3}
                  dot={{ fill: '#a78bfa', r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Line 
                  type="monotone" 
                  dataKey="Negative" 
                  stroke="#7c3aed" 
                  strokeWidth={3}
                  dot={{ fill: '#7c3aed', r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Sentiment Distribution */}
        <Card className="border-2 hover:border-violet-500/50 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle>Asset Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">Select Asset</label>
              <Select
                value={selected.symbol}
                onValueChange={(value) => {
                  const next = assetList.find(a => a.symbol === value);
                  if (next) setSelected(next);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assetList.map(a => (
                    <SelectItem key={a.symbol} value={a.symbol}>
                      {a.symbol} – {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-gray-500">
                {totalMentions.toLocaleString()} total mentions analyzed
              </p>
            </div>

            <div className="space-y-5">
              {[
                { label: 'Positive', value: totals.positive ?? 0, color: 'bg-violet-500', hoverColor: 'hover:bg-violet-400' },
                { label: 'Neutral', value: totals.neutral ?? 0, color: 'bg-violet-400', hoverColor: 'hover:bg-violet-300' },
                { label: 'Negative', value: totals.negative ?? 0, color: 'bg-violet-700', hoverColor: 'hover:bg-violet-600' }
              ].map(({ label, value, color, hoverColor }) => (
                <div 
                  key={label}
                  onMouseEnter={() => setHoveredSentiment(label)}
                  onMouseLeave={() => setHoveredSentiment(null)}
                  className="transition-transform duration-200"
                  style={{ transform: hoveredSentiment === label ? 'scale(1.02)' : 'scale(1)' }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-sm font-bold">{value}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out",
                        color,
                        hoverColor
                      )}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}