import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import {ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs"
import { SignIn } from "@clerk/nextjs"
import Image from "next/image"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Halloween Party Login",
  description: "Sign in to join the spookiest party of the year!",
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-100`}
        >
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-md">
              <div className="text-center mb-8">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Halloween Party Logo"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-300 mb-2">
                  🎃 Halloween Party 🎃
                </h1>
                <p className="text-lg text-orange-800 dark:text-orange-200">
                  Sign in to join the spookiest night of the year!
                </p>
              </div>
              <div className="bg-orange-200 dark:bg-orange-900 border border-orange-400 dark:border-orange-700 rounded-lg p-8 shadow-xl">
                <header>
                  <SignedOut>
                    <SignInButton mode="modal" />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </header>
                {/*<SignIn*/}
                {/*  appearance={{*/}
                {/*    elements: {*/}
                {/*      formButtonPrimary:*/}
                {/*        "bg-purple-600 hover:bg-purple-700 text-white",*/}
                {/*      formFieldInput:*/}
                {/*        "bg-orange-50 dark:bg-orange-800 border-orange-300 dark:border-orange-600",*/}
                {/*      formFieldLabel: "text-orange-800 dark:text-orange-200",*/}
                {/*    },*/}
                {/*  }}*/}
                {/*/>*/}
              </div>
              <footer className="mt-8 text-center text-sm text-orange-700 dark:text-orange-300">
                <p>🦇 Prepare for a night of thrills and chills! 🦇</p>
                <p>Don&apos;t have an account? Sign up to join the party!</p>
              </footer>
            </main>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
