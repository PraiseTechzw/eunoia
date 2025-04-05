import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Brain, Lock, BarChart3, Search } from "lucide-react"
import { HeroAnimation } from "@/components/hero-animation"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialCarousel } from "@/components/testimonial-carousel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Eunoia Journal
            </span>
          </h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-teal-50 to-transparent dark:from-teal-950/30 dark:to-transparent">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  Journaling Experience
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Discover insights, track emotional patterns, and grow with our AI-powered journaling platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Start Your Journey <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
              <p className="text-muted-foreground text-lg">
                Eunoia Journal combines cutting-edge technology with intuitive design to provide an unparalleled
                journaling experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Lock className="h-10 w-10 text-teal-500" />}
                title="Advanced Security"
                description="Multi-factor authentication, role-based access control, and end-to-end encryption keep your most personal thoughts secure."
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-teal-500" />}
                title="AI-Powered Insights"
                description="Our advanced NLP algorithms analyze your entries to provide emotional insights and personalized recommendations."
              />
              <FeatureCard
                icon={<Search className="h-10 w-10 text-teal-500" />}
                title="Intelligent Search"
                description="Find exactly what you're looking for with our semantic search engine that understands context and meaning."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-teal-500" />}
                title="Data Visualization"
                description="Track your emotional journey with interactive charts and graphs that reveal patterns and progress."
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-teal-500" />}
                title="Rich Text Editor"
                description="Express yourself fully with our advanced editor supporting tables, media embedding, and custom formatting."
              />
              <FeatureCard
                icon={<ArrowRight className="h-10 w-10 text-teal-500" />}
                title="Personalized Growth"
                description="Receive tailored reminders and insights based on your emotional state and journaling patterns."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of users who have transformed their journaling practice with Eunoia.
              </p>
            </div>

            <TestimonialCarousel />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Begin Your Journaling Journey Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of mindful journalers and discover the power of AI-enhanced reflection.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Your Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Eunoia Journal</h3>
              <p className="text-muted-foreground">Transforming personal reflection through technology.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/gdpr" className="text-muted-foreground hover:text-foreground">
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Eunoia Journal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

