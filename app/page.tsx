import { Navbar } from "../components/navbar";
import { Hero } from "../components/hero";
import SentimentPreview from "../components/sentiment-preview";
import { PricingSection } from "../components/pricing";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SentimentPreview />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
