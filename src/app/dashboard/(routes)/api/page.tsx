'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Code, 
  Key, 
  Webhook,
  RefreshCw,
  Clock,
  Shield,
  Copy,
  Check,
  Terminal,
  FileJson,
  Cpu
} from "lucide-react"
import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function APIPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [apiKey] = useState("sk_live_example_key_123...")

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const codeExamples = {
    curl: `curl -X POST 'https://api.chatbase-clone.com/v1/chat' \\
  -H 'Authorization: Bearer ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "chatbotId": "bot_123",
    "message": "Hello, how can I help?",
    "context": {
      "previousMessages": []
    }
  }'`,
    python: `import requests

response = requests.post(
    'https://api.chatbase-clone.com/v1/chat',
    headers={
        'Authorization': f'Bearer ${apiKey}',
        'Content-Type': 'application/json'
    },
    json={
        'chatbotId': 'bot_123',
        'message': 'Hello, how can I help?',
        'context': {
            'previousMessages': []
        }
    }
)

print(response.json())`,
    node: `const response = await fetch('https://api.chatbase-clone.com/v1/chat', {
    method: 'POST',
    headers: {
        'Authorization': \`Bearer ${apiKey}\`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        chatbotId: 'bot_123',
        message: 'Hello, how can I help?',
        context: {
            previousMessages: []
        }
    })
});

const data = await response.json();
console.log(data);`
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Integrate chatbots into your applications
        </p>
      </div>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={apiKey} readOnly className="font-mono" />
            <Button 
              variant="outline"
              onClick={() => handleCopy(apiKey, 'apiKey')}
            >
              {copied === 'apiKey' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Key
          </Button>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Rate Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label>Requests per minute</Label>
                <p className="text-sm text-muted-foreground">Current limit: 1000</p>
              </div>
              <Button variant="outline">Increase Limit</Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label>Concurrent requests</Label>
                <p className="text-sm text-muted-foreground">Current limit: 100</p>
              </div>
              <Button variant="outline">Increase Limit</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Examples
          </CardTitle>
          <CardDescription>
            Examples of how to integrate with our API in different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="curl" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                cURL
              </TabsTrigger>
              <TabsTrigger value="python" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Python
              </TabsTrigger>
              <TabsTrigger value="node" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Node.js
              </TabsTrigger>
            </TabsList>
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <pre className="mt-4 p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{code}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-6 right-6"
                    onClick={() => handleCopy(code, lang)}
                  >
                    {copied === lang ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input placeholder="https://your-domain.com/webhook" />
              <Button>Save</Button>
            </div>
          </div>
          <div className="space-y-4">
            <Label>Events</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Message Received</Label>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Response Sent</Label>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Training Completed</Label>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>IP Whitelist</Label>
                <p className="text-sm text-muted-foreground">Restrict access by IP</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Request Signing</Label>
                <p className="text-sm text-muted-foreground">Verify webhook requests</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>API Logs</Label>
                <p className="text-sm text-muted-foreground">View detailed request logs</p>
              </div>
              <Button variant="outline">View Logs</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 