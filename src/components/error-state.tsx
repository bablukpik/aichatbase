import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  retry?: () => void
}

export function ErrorState({ 
  message = "Something went wrong. Please try again.", 
  retry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {retry && (
        <Button variant="outline" onClick={retry}>
          Try Again
        </Button>
      )}
    </div>
  )
} 