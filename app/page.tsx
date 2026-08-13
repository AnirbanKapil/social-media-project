
import LandingPage from "./src/pages/LandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inkwell — Where Words Take Flight",
  description: "Inkwell is the creative space for writers, thinkers, and visual storytellers. Share your thoughts, discover new perspectives, and build your audience.",
  keywords: ["social network", "writing", "blogging", "creators", "inkwell", "twitter alternative"],
  openGraph: {
    title: "Inkwell — Where Words Take Flight",
    description: "The creative space for writers, thinkers, and visual storytellers.",
    type: "website",
    url: "https://inkwell.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkwell — Where Words Take Flight",
    description: "Join millions of writers and creators.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <LandingPage />;
}
