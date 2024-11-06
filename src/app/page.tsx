import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

// At the top of the file, add this type
type IconProps = React.SVGProps<SVGSVGElement>

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">
              Chatbase Clone
            </Link>
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col gap-4 pt-10">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      Pricing
                    </Link>
                    <Link href="#docs" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      Documentation
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {/* Desktop Menu */}
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Pricing
              </Link>
              <Link href="#docs" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/80 to-indigo-50 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900" />
        
        <div className="container relative">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center py-20 md:py-32">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Build Custom ChatGPT for<br className="hidden sm:inline" />your Knowledge Base
            </h1>
            <p className="max-w-[750px] text-base sm:text-lg text-muted-foreground md:text-xl px-4">
              Train ChatGPT on your data. Add your documents, websites, PDFs, and more. 
              Create a custom ChatGPT that knows everything about your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                  Start Building Now
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 space-y-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Key Features
          </h2>
          <p className="text-muted-foreground">
            Everything you need to build custom AI chatbots
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary">
              <div className="flex flex-col gap-4">
                <feature.icon className="h-8 w-8" />
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-20 space-y-16 bg-secondary/50">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Get started in minutes with these simple steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container py-20 space-y-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground">
            Start for free, upgrade when you need more
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={cn(
              "rounded-lg border p-8",
              plan.featured && "border-primary bg-primary/5 shadow-lg"
            )}>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn(
                    "mt-4",
                    plan.featured && "bg-primary text-primary-foreground"
                  )}
                  variant={plan.featured ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container py-20 space-y-16 bg-secondary/50">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Loved by Businesses Worldwide
          </h2>
          <p className="text-muted-foreground">
            See what our customers have to say
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="font-bold">
              Chatbase Clone
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2024 Chatbase Clone. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Train on Your Data",
    description: "Upload documents, connect websites, or add text to train your custom ChatGPT.",
    icon: function DocumentIcon(props: IconProps) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      )
    }
  },
  {
    title: "Instant Deployment",
    description: "Get a chatbot that's ready to use in minutes. No coding required.",
    icon: function RocketIcon(props: IconProps) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          />
        </svg>
      )
    }
  },
  {
    title: "Advanced Analytics",
    description: "Track usage, monitor performance, and optimize your chatbot with detailed analytics.",
    icon: function ChartIcon(props: IconProps) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      )
    }
  },
]

const steps = [
  {
    title: "Upload Your Data",
    description: "Upload your documents, connect your website, or paste your text directly.",
  },
  {
    title: "Train Your Bot",
    description: "Our AI will process your data and create a custom knowledge base.",
  },
  {
    title: "Deploy & Share",
    description: "Get an embeddable widget or share your chatbot's unique URL.",
  },
]

const pricingPlans = [
  {
    name: "Free",
    description: "Perfect for trying out our service",
    price: "0",
    featured: false,
    buttonText: "Get Started",
    features: [
      "1,000 messages/month",
      "2 chatbots",
      "Basic analytics",
      "48-hour support response time",
      "Standard rate limits",
      "Community support",
    ],
  },
  {
    name: "Pro",
    description: "Best for growing businesses",
    price: "49",
    featured: true,
    buttonText: "Start Free Trial",
    features: [
      "10,000 messages/month",
      "Unlimited chatbots",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Webhook integration",
      "Custom domains",
      "Team collaboration",
    ],
  },
  {
    name: "Enterprise",
    description: "For large-scale deployments",
    price: "199",
    featured: false,
    buttonText: "Contact Sales",
    features: [
      "Unlimited messages",
      "Unlimited chatbots",
      "Enterprise analytics",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security features",
      "SSO authentication",
      "Custom AI model training",
      "Multi-language support",
      "Advanced role management",
      "Custom data retention",
      "Dedicated account manager",
      "Priority feature requests",
      "Custom API rate limits",
      "Advanced data encryption",
      "Compliance certifications",
      "Private cloud deployment",
      "Custom webhook endpoints",
      "Advanced team permissions",
      "Audit logs",
      "Custom training data",
      "Enterprise SLA",
      "Custom reporting",
      "White-label solution",
    ],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "This platform has transformed how we handle customer support. Our response times have improved by 80%.",
  },
  {
    name: "Michael Chen",
    role: "CEO at StartupX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "The ease of setup and quality of responses has exceeded our expectations. A game-changer for our business.",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Success at SaaS Inc",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "Our customers love the instant, accurate responses. It's like having a 24/7 support team.",
  },
]
