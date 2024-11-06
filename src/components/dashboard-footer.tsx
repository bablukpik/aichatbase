import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function DashboardFooter() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 md:h-14">
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <Link
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            your-name
          </Link>
          . The source code is available on{" "}
          <Link
            href="https://github.com/yourusername/chatbase-clone"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
} 