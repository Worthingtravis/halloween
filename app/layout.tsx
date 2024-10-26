import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

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
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-100`}
        >
          <div className="min-h-screen flex flex-col items-center  space-y-4 justify-center p-4">
            <main className="w-full max-w-md  space-y-4">
              <div className="text-center mb-8">
                <Image
                  src="/spooky.png"
                  alt="Halloween Party Logo"
                  width={1000}
                  height={1000}
                  className="mx-auto mb-4 h-48 w-96  border-4 border-black"
                />
                <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-300 mb-2">
                  🎃 Halloween Party 🎃
                </h1>
              </div>

              <div className="bg-orange-200 dark:bg-orange-900 border border-orange-400 dark:border-orange-700 rounded-lg p-8 shadow-xl">
                <header>
                  <SignedOut>
                    <SignInButton mode="modal" />
                  </SignedOut>
                  <SignedIn>
                    <div className="flex gap-2 items-center !text-xl">
                      Welcome to the party! <UserButton showName={true} />
                    </div>
                  </SignedIn>
                </header>
              </div>
              <div className="bg-orange-200 animate-pulse dark:bg-orange-900 border border-orange-400 dark:border-orange-700 rounded-lg  shadow-xl">
                <Link
                  href={"/vote"}
                  className="text-orange-600 text-center flex justify-center w-full p-8 text-xl dark:text-orange-300 hover:underline"
                >
                  Vote for the best costume!
                </Link>
              </div>
              <footer className="mt-8 text-center text-sm text-orange-700 dark:text-orange-300">
                <p>🦇 Prepare for a night of thrills and chills! 🦇</p>
                <SignedOut>
                  <p>Don&apos;t have an account? Sign up to join the party!</p>
                </SignedOut>
              </footer>
            </main>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
