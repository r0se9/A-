import "@/styles/globals.css"
// Correct usage does not require importing Html, Head, or Main directly in page components
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
// No need to import Html or Body for page or app components, only in _document.js

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
      <html>
        <head>
          {/* Set the default title and any essential meta tags that aren't page-specific */}
          <title>{siteConfig.name}</title>
          <meta name="description" content={siteConfig.description} />
          {/* Link to favicon and apple-touch-icon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          {/* You can also include third-party scripts or CSS files here */}
        </head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
              {/* Insert SiteHeader or any components as needed */}
              <main className="flex-1">
                {children}
              </main>
              <TailwindIndicator />
            </div>
          </ThemeProvider>
        </body>
      </html>      
    </>
  );
}