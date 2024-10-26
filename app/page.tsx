
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {

  return (
      <div className="min-h-screen bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-100 flex flex-col items-center justify-center p-8">
        <main className="w-full max-w-4xl">
          <Card className="bg-orange-200 dark:bg-orange-900 border-orange-400 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-center text-orange-600 dark:text-orange-300">
                🎃 Spooktacular Halloween Party 🎃
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Join us for a night of thrills and chills!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
        Get Started
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-orange-200 dark:bg-orange-900 border-orange-400 dark:border-orange-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                  🕸️ Event Details 🕸️
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Date: October 31st, 2024</li>
                  <li>Time: 8:00 PM - Midnight</li>
                  <li>Location: Haunted Mansion</li>
                  <li>Dress Code: Costumes Required</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-orange-200 dark:bg-orange-900 border-orange-400 dark:border-orange-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                  🧛 Activities 🧛
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Costume Contest</li>
                  <li>Haunted House Tour</li>
                  <li>Pumpkin Carving</li>
                  <li>Spooky Dance Floor</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="mt-12 text-center">
          <p>🦇 Beware of the creatures that lurk in the night! 🦇</p>
        </footer>
      </div>
  )
}
