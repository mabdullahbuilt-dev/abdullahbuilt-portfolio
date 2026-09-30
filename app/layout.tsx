/* eslint-disable @next/next/no-css-tags -- the migrated homepage stylesheets are intentionally preserved */
import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";
import ClientScript from "./ClientScript";

// Self-hosted at build time; stylesheets reference these variables ahead of the named families.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

const origin = "https://abdullahbuilt.top";
const isVercelPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: "AbdullahBuilt | Muhammad Abdullah, Full-Stack Engineer",
  description:
    "AbdullahBuilt is the independent practice of Muhammad Abdullah, a full-stack engineer building SaaS, AI applications, web apps, API integrations and custom software.",
  applicationName: "AbdullahBuilt",
  authors: [{ name: "Muhammad Abdullah", url: "https://abdullahbuilt.top/about/" }],
  creator: "Muhammad Abdullah",
  publisher: "AbdullahBuilt",
  alternates: { canonical: "/", languages: { en: "/", "x-default": "/" }, types: { "application/rss+xml": "/feed.xml" } },
  verification: { google: "ryoPIPXUpxdzz9qHStXI55HveXc16vlcb-vnil4TshQ" },
  robots: isVercelPreview
    ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { siteName: "AbdullahBuilt", title: "AbdullahBuilt | Muhammad Abdullah, Full-Stack Engineer", description: "Custom software, SaaS, web application, API integration, automation, and MVP development by Muhammad Abdullah (AbdullahBuilt) for clients worldwide.", url: origin, type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Muhammad Abdullah, independent product builder and full-stack engineer" }] },
  twitter: { card: "summary_large_image", title: "AbdullahBuilt | Muhammad Abdullah, Full-Stack Engineer", description: "Custom software and product development by Muhammad Abdullah (AbdullahBuilt) for clients worldwide.", images: ["/og.png"] },
  icons: {
    icon: [{ url: "/favicon-profile.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon-profile.png",
    apple: [{ url: "/favicon-profile.png", type: "image/png", sizes: "512x512" }],
  },
};

const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": `${origin}/#person`, name: "Muhammad Abdullah", url: `${origin}/`, image: `${origin}/assets/abdullah-editorial.webp`, jobTitle: "Full-Stack Engineer", brand: { "@id": `${origin}/#business` }, worksFor: { "@id": `${origin}/#business` }, email: "mailto:mabdullah.built@gmail.com", sameAs: ["https://www.linkedin.com/in/muhammad-abdullah-builder", "https://github.com/velz-cmd", "https://www.facebook.com/mabdullah.built/"], knowsAbout: ["Custom software development", "SaaS development", "Web application development", "API integration", "Business automation", "MVP development", "AI application development", "Software product rescue", "Blockchain integrations"] },
    { "@type": "ProfessionalService", "@id": `${origin}/#business`, name: "AbdullahBuilt", alternateName: "Abdullah Built", url: `${origin}/`, image: `${origin}/og.png`, logo: `${origin}/favicon-profile.png`, email: "mailto:mabdullah.built@gmail.com", description: "Independent product engineering for custom software, SaaS, web applications, integrations, automation, MVPs, AI applications, and product rescue.", provider: { "@id": `${origin}/#person` }, founder: { "@id": `${origin}/#person` }, areaServed: "Worldwide", availableLanguage: "English", contactPoint: { "@type": "ContactPoint", email: "mabdullah.built@gmail.com", contactType: "project inquiries", availableLanguage: "English" } },
    { "@type": "WebSite", "@id": `${origin}/#website`, name: "AbdullahBuilt", alternateName: ["Abdullah Built", "abdullahbuilt.top"], url: `${origin}/`, publisher: { "@id": `${origin}/#business` }, inLanguage: "en" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0d0e11" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/seo-pages.css" />
        <link rel="stylesheet" href="/seo-enhancements.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }} />
      </head>
      <body>
        {children}
        <ClientScript />
      </body>
    </html>
  );
}
