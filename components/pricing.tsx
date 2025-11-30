import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import plans from "../lib/plans.json";
import {Badge} from "./ui/badge";

interface TierMeta {
  id: keyof typeof plans;
  name: string;
  price: string; // display price
  badge?: string;
  blurb: string;
}

const tiers: TierMeta[] = [
  {
    id: "free",
    name: "Starter Plan",
    price: "₱0 / free",
    badge: "Best for newcomers",
    blurb: "New traders, students, and casual users"
  },
  {
    id: "pro",
    name: "Trader Plan",
    price: "₱399/mo.",
    badge: "Most popular",
    blurb: "Retail traders and small investors"
  },
  {
    id: "premium",
    name: "AI Analyst Plan",
    price: "₱1,299/mo.",
    badge: "Premium",
    blurb: "Professionals, funds, and research teams"
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
        <p className="mt-3 text-muted-foreground">Choose the plan that fits your workflow.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <Card
            key={t.id}
            className={[
              "flex flex-col border-2 transition-colors",
              t.id === "pro"
                ? "border-violet-500/60 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/30"
                : "hover:border-violet-500/40"
            ].join(" ")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.price} <span className="sr-only">{t.name}</span></CardTitle>
                {t.badge && (
                  <Badge
                    variant="outline"
                    className={t.id === "pro"
                      ? "rounded-full bg-violet-600/10 px-2 py-1 text-xs font-medium text-violet-700 border-violet-500/40"
                      : "rounded-full px-2 py-1 text-xs font-medium"}
                  >
                    {t.badge}
                  </Badge>
                )}
              </div>
              
              <p className="mt-1 text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.blurb}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm">
                {plans[t.id].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={t.id === "pro" ? "w-full bg-violet-600 hover:bg-violet-600/90" : "w-full"}>Get Started</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
