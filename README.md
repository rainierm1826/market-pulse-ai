Market Pulse AI – an example landing + live sentiment preview built with Next.js 16, Tailwind CSS v4 and shadcn-style components (Button, Card, Progress). It consumes static JSON datasets in `lib/` for pricing tiers, sentiment distribution, assets, and a sample price trend chart.

## Getting Started

Install dependencies (if you just cloned and have no modules yet):

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key files to explore:

- `app/page.tsx` – assembles `Navbar`, `Hero`, `SentimentPreview`, `PricingSection`.
- `components/ui/*` – lightweight shadcn-inspired primitives.
- `components/sentiment-preview.tsx` – SVG line chart + sentiment bars.
- `lib/*.json` – data sources (sentiment, price, plans, assets).

No external charting lib is used; the line chart path is generated manually for clarity and zero overhead.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Customization

- Add more UI primitives following the pattern in `components/ui/button.tsx`.
- Replace static JSON with API calls or a database when ready.
- Enhance the chart using a library like `recharts` or `visx` for richer visuals.

## Next Steps

1. Add authentication for Sign Up / Sign In buttons.
2. Integrate real-time sentiment streaming (WebSockets or polling API).
3. Expand pricing features & connect to a billing provider.

## License

Educational / example use. Adapt freely within your project.
