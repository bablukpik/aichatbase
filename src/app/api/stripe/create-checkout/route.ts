import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const PLANS = {
  pro: {
    name: 'Pro Plan',
    description: 'Unlimited chatbots and advanced features',
    price: 'price_H5ggYwtDq4fbrJ', // Replace with your Stripe price ID
  },
  enterprise: {
    name: 'Enterprise Plan',
    description: 'Custom solutions for large organizations',
    price: 'price_H5ggYwtDq4fbrK', // Replace with your Stripe price ID
  },
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { planId } = await req.json()
    const plan = PLANS[planId as keyof typeof PLANS]

    if (!plan) {
      return new NextResponse("Invalid plan", { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId

    if (!stripeCustomerId) {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      stripeCustomerId = customer.id

      // Create or update subscription record
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
        update: {
          stripeCustomerId: customer.id,
        },
      })
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: plan.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 