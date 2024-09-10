import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Chrome, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Enhance Your Writing of Pidgin English
            </h1>
            <p className="mx-auto max-w-[700px] md:text-xl">
              Improve your writing with our Chrome extension. Get real-time
              grammar, spelling, and style suggestions as you type.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link href="#get-started">
                <Chrome className="mr-2 h-4 w-4" />
                Add to Chrome
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="w-full px-6 py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary text-center mb-12">
          Features
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 mb-2 text-green" />
              <CardTitle>Real-time Corrections</CardTitle>
            </CardHeader>
            <CardContent>
              Get instant feedback on your writing with our advanced language
              processing algorithms.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-yellow" />
              <CardTitle>Easy Integration</CardTitle>
            </CardHeader>
            <CardContent>
              Works with popular websites and text editors in your browser.
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl text-primary font-bold tracking-tighter sm:text-5xl">
              Get Started Today
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Install Naija Spell Checker now and start improving your writing
              in Pidgin English.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Add to Chrome
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>
      <section
        id="demo"
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl text-primary font-bold tracking-tighter sm:text-5xl">
              See It in Action
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Try our interactive demo of the spell checker.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/demo">Try Demo</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
