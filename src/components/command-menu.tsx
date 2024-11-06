'use client'

import * as React from "react"
import {
  Bot,
  MessageSquare,
  FileText,
  BarChart,
  Users,
  ClipboardList,
  Code,
  Settings,
  User,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/chatbots'))}>
              <Bot className="mr-2 h-4 w-4" />
              Chatbots
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/messages'))}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/documents'))}>
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/profile'))}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/team'))}>
              <Users className="mr-2 h-4 w-4" />
              Team
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Developer">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/api'))}>
              <Code className="mr-2 h-4 w-4" />
              API Documentation
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/audit-logs'))}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Audit Logs
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 