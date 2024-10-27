import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { QrCodeButton, QrCodeWebsite } from "@/app/QrCodeWebsite";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Halloween Party Login",
  description: "Sign in to join the spookiest party of the year!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-500/80 min-h-screen flex flex-col`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="sticky top-0 z-50 w-full border-b border-orange-400 dark:border-orange-700 bg-orange-200/80 dark:bg-orange-900/80 backdrop-blur supports-[backdrop-filter]:bg-orange-200/60 dark:supports-[backdrop-filter]:bg-orange-900/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 hidden md:flex">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="hidden font-bold px-2 sm:inline-block">
                      🎃 Halloween Party 🎃
                    </span>
                  </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                  <nav className="flex items-center space-x-2">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button variant="outline" size="sm">
                          Sign In
                        </Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm hidden sm:inline-block">
                          Welcome to the party!
                        </span>
                        <UserButton afterSignOutUrl="/" />
                        <SignOutButton>
                          <Button variant="ghost" size="sm">
                            Sign Out
                          </Button>
                        </SignOutButton>
                      </div>
                    </SignedIn>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <QrCodeButton />
              <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <SignedIn> {children}</SignedIn>
                <SignedOut>
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                      Welcome to the Halloween Party!
                    </h1>
                    <p className="mb-4">
                      Sign in to join the spookiest party of the year!
                    </p>
                    <SignInButton>
                      <Button variant="outline">Sign In / Register</Button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </div>
            </main>
            <footer className="border-t border-orange-400 dark:border-orange-700 bg-orange-200 dark:bg-orange-900">
              <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-orange-700 dark:text-orange-300">
                <p>🦇 Prepare for a night of thrills and chills! 🦇</p>
                <p>🦇 When you see a bug - refresh the page. fuck you.🦇</p>
                <p className="sr-only">
                  {" "}
                  above you will see a joke... jokes are fun.{" "}
                </p>
                <SignedOut>
                  <p className="mt-2">
                    Don&apos;t have an account? Sign up to join the party!
                  </p>
                </SignedOut>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
