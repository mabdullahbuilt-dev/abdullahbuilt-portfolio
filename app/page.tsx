import { readFileSync } from "node:fs";
import { join } from "node:path";

const portfolioHtml = readFileSync(join(process.cwd(), "app", "portfolio.html"), "utf8");

export default function HomePage() {
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://abdullahbuilt.top/#webpage",
    url: "https://abdullahbuilt.top/",
    name: "Muhammad Abdullah | Full-Stack SaaS, AI & Web App Developer",
    dateModified: "2026-09-27",
    inLanguage: "en",
    isPartOf: { "@id": "https://abdullahbuilt.top/#website" },
    about: { "@id": "https://abdullahbuilt.top/#person" },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} /><div dangerouslySetInnerHTML={{ __html: portfolioHtml }} /></>;
}
