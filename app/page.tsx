import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        </Card>
      </main>

      <footer className="mt-12 text-center">
        <p>🦇 Beware of the creatures that lurk in the night! 🦇</p>
      </footer>
    </div>
  );
}
