'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BrainCircuit, 
  Languages, 
  Settings, 
  Upload,
  FileText,
  Globe,
  Database,
  RefreshCw,
  ArrowUpRight,
  Bot,
  MessageSquare
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

export default function TrainingPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [trainingProgress, setTrainingProgress] = useState(65)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Training</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Train and optimize your AI models
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              8 more than last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              3 more than last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Training Data</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              500 MB added this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              2.3% improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Base Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="custom">Custom Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input type="number" min="0" max="1" step="0.1" defaultValue="0.7" />
              <p className="text-xs text-muted-foreground">Controls randomness: 0 is focused, 1 is creative</p>
            </div>
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input type="number" defaultValue="2000" />
              <p className="text-xs text-muted-foreground">Maximum length of the response</p>
            </div>
            <Button className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Language & Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Multi-language Support</Label>
                <p className="text-xs text-muted-foreground">Enable automatic translation</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Context Retention</Label>
                <p className="text-xs text-muted-foreground">Remember conversation history</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Training Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            Current Training Status
          </CardTitle>
          <CardDescription>
            Model training in progress - Customer Support Bot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{trainingProgress}%</span>
            </div>
            <Progress value={trainingProgress} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-xs">Epochs</Label>
              <p className="text-sm font-medium">12/20</p>
            </div>
            <div>
              <Label className="text-xs">Loss Rate</Label>
              <p className="text-sm font-medium">0.0342</p>
            </div>
            <div>
              <Label className="text-xs">Time Remaining</Label>
              <p className="text-sm font-medium">~45 minutes</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View Detailed Metrics
          </Button>
        </CardContent>
      </Card>

      {/* Training Data Sources */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              15 documents processed
            </p>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Add Documents
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Websites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              3 websites connected
            </p>
            <Button variant="outline" className="w-full">
              <Globe className="mr-2 h-4 w-4" />
              Add Website
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              2 APIs integrated
            </p>
            <Button variant="outline" className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Add API Source
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 