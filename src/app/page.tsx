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
import {
  Bot,
  FileText,
  Users,
  BarChart2,
  Globe,
  Palette,
  Code,
  Shield,
  RefreshCcw,
} from "lucide-react"

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
            Powerful Features for Your AI Chatbots
          </h2>
          <p className="text-muted-foreground">
            Everything you need to create, train, and manage intelligent chatbots
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="flex flex-col gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
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
    title: "AI-Powered Chatbots",
    description: "Create custom ChatGPT bots trained on your specific data and knowledge base.",
    icon: Bot
  },
  {
    title: "Document Training",
    description: "Upload PDFs, DOCs, or connect websites to train your chatbot with your content.",
    icon: FileText
  },
  {
    title: "Team Collaboration",
    description: "Work together with your team to manage and improve your chatbots.",
    icon: Users
  },
  {
    title: "Advanced Analytics",
    description: "Track performance, usage patterns, and user engagement with detailed metrics.",
    icon: BarChart2
  },
  {
    title: "Multi-Language Support",
    description: "Create chatbots that can communicate in multiple languages.",
    icon: Globe
  },
  {
    title: "Custom Branding",
    description: "Customize the look and feel to match your brand identity.",
    icon: Palette
  },
  {
    title: "API Access",
    description: "Integrate chatbots into your applications with our comprehensive API.",
    icon: Code
  },
  {
    title: "Enterprise Security",
    description: "Advanced security features including SSO and audit logs.",
    icon: Shield
  },
  {
    title: "Real-time Training",
    description: "Train and improve your chatbot's responses in real-time.",
    icon: RefreshCcw
  }
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
    price: "0",
    description: "Perfect for trying out our service",
    features: [
      "1 Chatbot",
      "1,000 messages/month",
      "Basic analytics",
      "Community support",
      "Basic customization",
      "File upload up to 5MB",
      "Standard response time",
    ],
  },
  {
    name: "Pro",
    price: "49",
    description: "Best for growing businesses",
    featured: true,
    features: [
      "Unlimited chatbots",
      "50,000 messages/month",
      "Advanced analytics",
      "Priority support",
      "Full customization",
      "File upload up to 50MB",
      "Team collaboration (up to 5)",
      "API access",
      "Custom branding",
      "Audit logs",
      "Multi-language support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale deployments",
    features: [
      "Everything in Pro",
      "Unlimited messages",
      "Unlimited team members",
      "24/7 dedicated support",
      "Custom SLA",
      "Custom AI model training",
      "Enterprise SSO",
      "Advanced security",
      "Custom analytics",
      "Dedicated manager",
      "On-premise deployment",
    ],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Customer Success Manager",
    company: "TechCorp",
    content: "This platform has transformed how we handle customer support. Our response times improved by 80% and customer satisfaction is at an all-time high.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    company: "StartupX",
    content: "The ease of setup and quality of responses exceeded our expectations. The ability to train on our documentation made it invaluable for both customer support and internal use.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Support",
    company: "SaaS Inc",
    content: "The multi-language support and custom branding options helped us expand globally. Our customers love getting instant, accurate responses 24/7.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
]
