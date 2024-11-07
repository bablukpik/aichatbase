'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const tiers = [
  {
    name: "Free",
    id: "free",
    price: { monthly: "$0", annually: "$0" },
    description: "Perfect for trying out our service",
    features: [
      "1 Chatbot",
      "1,000 messages/month",
      "Basic analytics",
      "Community support",
      "Basic customization",
      "File upload up to 5MB",
      "Standard response time",
      "Basic document training",
    ],
    limitations: [
      "No team members",
      "No API access",
      "Limited integrations",
      "Basic templates only",
    ]
  },
  {
    name: "Pro",
    id: "pro",
    price: { monthly: "$49", annually: "$470" },
    description: "For growing businesses and teams",
    features: [
      "Unlimited chatbots",
      "50,000 messages/month",
      "Advanced analytics",
      "Priority support",
      "Full customization",
      "File upload up to 50MB",
      "Faster response time",
      "Advanced document training",
      "Team collaboration (up to 5)",
      "API access",
      "All integrations",
      "Custom templates",
      "Custom branding",
      "Audit logs",
      "Multi-language support",
      "Export capabilities",
      "Webhook support",
      "Enhanced security",
    ],
    limitations: [
      "Limited team size",
      "Standard SLA",
    ]
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: { monthly: "Custom", annually: "Custom" },
    description: "For large organizations with custom needs",
    features: [
      "Everything in Pro",
      "Unlimited messages",
      "Unlimited team members",
      "24/7 dedicated support",
      "Custom SLA",
      "File upload up to 500MB",
      "Fastest response time",
      "Custom AI model training",
      "Enterprise SSO",
      "Advanced security features",
      "Custom analytics",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise deployment option",
      "Custom contracts",
      "Training sessions",
      "Priority feature requests",
      "Compliance support",
    ],
    limitations: [],
  }
]

export default function PricingPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleUpgrade = (tierId: string) => {
    if (!session) {
      router.push('/login')
      return
    }
    if (tierId === 'enterprise') {
      router.push('/contact-sales')
      return
    }
    router.push(`/dashboard/billing?plan=${tierId}`)
  }

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.id} className={tier.name === "Pro" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{tier.price.monthly}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                or {tier.price.annually} billed annually
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Features included:</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tier.limitations.length > 0 && (
                  <div>
                    <p className="font-medium mb-2 text-muted-foreground">Limitations:</p>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation) => (
                        <li key={limitation} className="text-sm text-muted-foreground">
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={tier.name === "Pro" ? "default" : "outline"}
                onClick={() => handleUpgrade(tier.id)}
              >
                {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Enterprise Features</h2>
        <p className="text-muted-foreground mb-8">
          Need something more tailored to your business?
        </p>
        <Button size="lg" onClick={() => router.push('/contact-sales')}>
          Contact our Sales Team
        </Button>
      </div>
    </div>
  )
} 