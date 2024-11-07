'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmbedCodeGeneratorProps {
  chatbotId: string
}

export function EmbedCodeGenerator({ chatbotId }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()
  const [config, setConfig] = useState({
    position: 'bottom-right',
    theme: 'light',
    primaryColor: '#000000',
  })

  const scriptCode = `<script>
  window.chatbaseConfig = {
    chatbotId: "${chatbotId}",
    position: "${config.position}",
    theme: "${config.theme}",
    primaryColor: "${config.primaryColor}"
  }
</script>
<script
  src="https://chatbase-clone.vercel.app/embed.js"
  defer>
</script>`

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Position</Label>
        <select
          className="w-full rounded-md border p-2"
          value={config.position}
          onChange={(e) => setConfig({ ...config, position: e.target.value })}
        >
          <option value="bottom-right">Bottom Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="top-right">Top Right</option>
          <option value="top-left">Top Left</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        <select
          className="w-full rounded-md border p-2"
          value={config.theme}
          onChange={(e) => setConfig({ ...config, theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={config.primaryColor}
            onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
            className="w-20"
          />
          <Input
            value={config.primaryColor}
            onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Embed Code</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(scriptCode, 'script')}
          >
            {copied === 'script' ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Textarea
          readOnly
          value={scriptCode}
          className="font-mono text-sm"
          rows={10}
        />
      </div>

      <div className="rounded-md bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Add this code to your website&apos;s HTML, just before the closing
          <code className="mx-1 rounded bg-primary/20 px-1">&lt;/body&gt;</code>
          tag.
        </p>
      </div>
    </div>
  )
} 