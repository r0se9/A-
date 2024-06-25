import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import Head from 'next/head';
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {/* Use <Head /> here for adding elements within the head of the document */}
      <Head>
        {/* Example: Set the default title of the website */}
        <title>{siteConfig.name}</title>
        {/* Further <Head /> usage like meta tags could go here */}
      </Head>
      {/* Direct usage of <body> attributes should be moved to _document.js or managed via <Script /> component */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
          {/* <SiteHeader /> Uncomment or replace with actual component */}
          <div className="flex-1">{children}</div>
          {/* TailwindIndicator at the bottom */}
          <TailwindIndicator />
        </div>
      </ThemeProvider>
    </>
  );
}
