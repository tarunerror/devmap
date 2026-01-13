import DSAWebsite from "@/components/DSAWebsite";
import ultimateData from "@/data/ultimateData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  alternates: {
    canonical: "https://devmap.com",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "DevMap",
            alternateName: "DevMap - Your DSA Journey",
            url: "https://devmap.com",
            description:
              "A comprehensive learning platform for mastering Data Structures and Algorithms with progress tracking, achievements, and interactive tutorials.",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "1250",
              bestRating: "5",
              worstRating: "1",
            },
            featureList: [
              "Progress Tracking",
              "Achievement System",
              "Interactive Learning",
              "Dark Mode Support",
              "Keyboard Shortcuts",
              "Personal Notes",
              "Statistics Dashboard",
            ],
          }),
        }}
      />
      <DSAWebsite data={ultimateData} />
    </>
  );
}
