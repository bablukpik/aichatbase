'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EmbedCodeGeneratorProps {
  apiKey: string
  chatbotId: string
}

export function EmbedCodeGenerator({ apiKey, chatbotId }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState({
    position: 'right',
    primaryColor: '#2563eb',
    title: 'Customer Support',
    subtitle: 'Ask me anything!',
    initialMessage: 'Hello! How can I help you today?',
  })

  const scriptCode = `<script>
  (function(w,d,s,o,f,js,fjs){
    w['ChatWidget']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','cw','https://your-domain.com/widget.js'));
  cw('init', { 
    apiKey: '${apiKey}',
    chatbotId: '${chatbotId}',
    theme: {
      position: '${settings.position}',
      primaryColor: '${settings.primaryColor}',
      title: '${settings.title}',
      subtitle: '${settings.subtitle}',
      initialMessage: '${settings.initialMessage}'
    }
  });
</script>`

  const npmCode = `npm install @your-domain/chat-widget

import { ChatWidget } from '@your-domain/chat-widget'

export default function App() {
  return (
    <ChatWidget
      apiKey="${apiKey}"
      chatbotId="${chatbotId}"
      theme={{
        position: "${settings.position}",
        primaryColor: "${settings.primaryColor}",
        title: "${settings.title}",
        subtitle: "${settings.subtitle}",
        initialMessage: "${settings.initialMessage}"
      }}
    />
  )
}`

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Your Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Position</Label>
            <Select
              value={settings.position}
              onValueChange={(value) => setSettings({ ...settings, position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-20"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              placeholder="Customer Support"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
              placeholder="Ask me anything!"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Initial Message</Label>
            <Input
              value={settings.initialMessage}
              onChange={(e) => setSettings({ ...settings, initialMessage: e.target.value })}
              placeholder="Hello! How can I help you today?"
            />
          </div>
        </div>

        {/* Code Preview */}
        <Tabs defaultValue="script" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="script">Script Tag</TabsTrigger>
            <TabsTrigger value="npm">NPM Package</TabsTrigger>
          </TabsList>
          <TabsContent value="script">
            <div className="relative">
              <pre className="mt-4 p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-sm">{scriptCode}</code>
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-6 right-6"
                onClick={() => handleCopy(scriptCode)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="npm">
            <div className="relative">
              <pre className="mt-4 p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-sm">{npmCode}</code>
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-6 right-6"
                onClick={() => handleCopy(npmCode)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setSettings({
              position: 'right',
              primaryColor: '#2563eb',
              title: 'Customer Support',
              subtitle: 'Ask me anything!',
              initialMessage: 'Hello! How can I help you today?',
            })}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 