'use client'

import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Notifications } from "@/components/notifications"
import { CommandMenu } from "@/components/command-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardFooter } from "@/components/dashboard-footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <span>AI Chatbase</span>
          </Link>
        </div>
        <div className="flex-1 px-4">
          <DashboardNav />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="px-2 py-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl mb-6">
                      <span>AI Chatbase</span>
                    </Link>
                    <DashboardNav />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex-1 flex items-center gap-4 md:gap-8">
              <CommandMenu />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Notifications />
              <UserNav />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container py-6">
            {children}
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
} 