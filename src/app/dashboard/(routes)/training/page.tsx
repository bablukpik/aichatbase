'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  startTraining,
  fetchTrainingStatus,
  selectTrainingStatus,
  selectTrainingError,
  selectTrainingState,
  updateProgress,
  updateTrainingPhase,
  cancelTraining
} from '@/features/training/trainingSlice'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import {
  Brain,
  FileText,
  RefreshCw,
  Globe,
  Code,
  Settings,
  Activity,
  Database,
  Languages,
  CheckCircle,
  Circle,
  Loader2,
  Play,
  Pause,
  ChevronRight,
  Zap,
  BrainCircuit,
  Search,
  X,
  Bot,
  Badge,
  Plus
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { Checkbox } from "@/components/ui/checkbox"
import { FileIcon } from "lucide-react"
import { formatBytes } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface TrainingStatus {
  chatbotId: string
  documentsCount: number
  lastTrainingDate: string
  status: 'ready' | 'training' | 'failed'
  accuracy?: number
}

interface Chatbot {
  id: string
  name: string
  documents: any[]
}

interface TrainingContext {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface TrainingData {
  documents: {
    id: string
    name: string
    type: string
    size: number
    createdAt: string
  }[]
  websites: {
    id: string
    url: string
    lastSynced: string
    status: 'active' | 'syncing' | 'failed'
  }[]
  apis: {
    id: string
    endpoint: string
    lastSynced: string
    status: 'active' | 'syncing' | 'failed'
  }[]
}

const defaultContexts: TrainingContext[] = [
  {
    id: 'company',
    name: 'Company Information',
    description: 'Basic information about your company, products, and services',
    enabled: true,
  },
  {
    id: 'technical',
    name: 'Technical Documentation',
    description: 'Technical specifications, API documentation, and guides',
    enabled: true,
  },
  {
    id: 'support',
    name: 'Support Knowledge Base',
    description: 'Common issues, troubleshooting guides, and FAQs',
    enabled: true,
  },
  {
    id: 'sales',
    name: 'Sales Materials',
    description: 'Pricing, features, and competitive advantages',
    enabled: false,
  },
]

// Add model configurations
const models = {
  openai: [
    { id: "gpt-4-turbo-preview", name: "GPT-4 Turbo", provider: "OpenAI" },
    { id: "gpt-4-0125-preview", name: "GPT-4 (0125)", provider: "OpenAI" },
    { id: "gpt-4-1106-preview", name: "GPT-4 (1106)", provider: "OpenAI" },
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo-0125", name: "GPT-3.5 Turbo (0125)", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  ],
  anthropic: [
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
    { id: "claude-2.1", name: "Claude 2.1", provider: "Anthropic" },
    { id: "claude-2", name: "Claude 2", provider: "Anthropic" },
    { id: "claude-instant", name: "Claude Instant", provider: "Anthropic" },
  ],
  google: [
    { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
    { id: "gemini-pro-vision", name: "Gemini Pro Vision", provider: "Google" },
    { id: "palm-2", name: "PaLM 2", provider: "Google" },
  ],
  ollama: [
    { id: "llama2", name: "Llama 2", provider: "Ollama" },
    { id: "mistral", name: "Mistral", provider: "Ollama" },
    { id: "mixtral", name: "Mixtral", provider: "Ollama" },
    { id: "codellama", name: "Code Llama", provider: "Ollama" },
    { id: "vicuna", name: "Vicuna", provider: "Ollama" },
    { id: "orca-mini", name: "Orca Mini", provider: "Ollama" },
  ],
  meta: [
    { id: "llama-2-70b", name: "Llama 2 70B", provider: "Meta" },
    { id: "llama-2-13b", name: "Llama 2 13B", provider: "Meta" },
    { id: "llama-2-7b", name: "Llama 2 7B", provider: "Meta" },
  ],
  mistral: [
    { id: "mistral-large", name: "Mistral Large", provider: "Mistral AI" },
    { id: "mistral-medium", name: "Mistral Medium", provider: "Mistral AI" },
    { id: "mistral-small", name: "Mistral Small", provider: "Mistral AI" },
  ],
  cohere: [
    { id: "command", name: "Command", provider: "Cohere" },
    { id: "command-light", name: "Command Light", provider: "Cohere" },
    { id: "command-nightly", name: "Command Nightly", provider: "Cohere" },
  ],
}

interface ModelConfig {
  model: string
  temperature: number
  maxTokens: number
}

// Define training phases
const TRAINING_PHASES = [
  "Data Processing",
  "Context Analysis",
  "Model Training",
  "Fine-tuning",
  "Validation"
]

// Add interface for training phase
interface TrainingPhase {
  phase: string
  progress: number
  status: 'completed' | 'in-progress' | 'pending'
}

export default function TrainingPage() {
  const dispatch = useAppDispatch()
  const trainingStatus = useAppSelector(selectTrainingStatus)
  const error = useAppSelector(selectTrainingError)
  const status = useAppSelector(selectTrainingState)
  const [selectedChatbot, setSelectedChatbot] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('gpt-3.5-turbo')
  const [chatbots, setChatbots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTraining, setIsTraining] = useState(false)
  const { toast } = useToast()

  // Add state for selected chatbot details
  const [selectedChatbotDetails, setSelectedChatbotDetails] = useState<{
    name: string;
    documentsCount: number;
    lastTrainingDate: string | null;
  } | null>(null)

  const [selectedTab, setSelectedTab] = useState<'documents' | 'website' | 'api'>('documents')
  const [trainingData, setTrainingData] = useState<TrainingData>({
    documents: [],
    websites: [],
    apis: []
  })

  // Add website import state and handler
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  // Add API import state
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [apiHeaders, setApiHeaders] = useState('')
  const [isApiImporting, setIsApiImporting] = useState(false)

  // Add state for custom names
  const [websiteCustomName, setWebsiteCustomName] = useState('')
  const [apiCustomName, setApiCustomName] = useState('')

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 500
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Add this to store interval reference

  const [currentPhase, setCurrentPhase] = useState(0)

  const [trainingStats, setTrainingStats] = useState({
    progress: 0,
    documentsProcessed: 0,
    totalDocuments: 0,
    timeRemaining: 0,
    currentAccuracy: 0,
    trainingSpeed: 0,
    phases: [] as TrainingPhase[]
  })

  const [trainingProgress, setTrainingProgress] = useState({
    phases: [] as TrainingPhase[],
    documentsProcessed: 0,
    totalDocuments: 0,
    timeRemaining: 0,
    currentAccuracy: 0,
    trainingSpeed: 0,
    progress: 0
  })

  const [trainingPhases, setTrainingPhases] = useState<TrainingPhase[]>([
    { phase: "Data Processing", progress: 0, status: "pending" },
    { phase: "Context Analysis", progress: 0, status: "pending" },
    { phase: "Model Training", progress: 0, status: "pending" },
    { phase: "Fine-tuning", progress: 0, status: "pending" },
    { phase: "Validation", progress: 0, status: "pending" },
  ])

  // Update the filtering logic
  const getFilteredDocuments = (type: 'website' | 'api') => {
    if (!trainingData.documents) return []
    
    switch (type) {
      case 'website':
        return trainingData.documents.filter(doc => 
          doc.name.toLowerCase().startsWith('website import:') || 
          doc.type === 'website-import'  // Add this as a fallback
        )
      case 'api':
        return trainingData.documents.filter(doc => 
          doc.name.toLowerCase().startsWith('api import:') || 
          doc.type === 'api-import'  // Add this as a fallback
        )
      default:
        return []
    }
  }

  // Update the handleWebsiteImport function
  const handleWebsiteImport = async () => {
    if (!selectedChatbot || !websiteUrl) return

    setIsImporting(true)
    try {
      const response = await fetch('/api/documents/import/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: websiteUrl,
          chatbotId: selectedChatbot,
          customName: websiteCustomName ? `Website Import: ${websiteCustomName}` : undefined,
          type: 'website-import' // Add this type
        }),
      })

      if (!response.ok) throw new Error('Failed to import website')

      const document = await response.json()
      setTrainingData(prev => ({
        ...prev,
        documents: [document, ...prev.documents],
      }))

      toast({
        title: "Success",
        description: "Website content imported successfully",
      })
      setWebsiteUrl('')
      setWebsiteCustomName('')
    } catch (error) {
      console.error('Import error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import website content",
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Update the handleApiImport function
  const handleApiImport = async () => {
    if (!selectedChatbot || !apiEndpoint) return

    setIsApiImporting(true)
    try {
      const response = await fetch('/api/documents/import/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: apiEndpoint,
          chatbotId: selectedChatbot,
          headers: apiHeaders ? JSON.parse(apiHeaders) : {},
          customName: apiCustomName ? `API Import: ${apiCustomName}` : undefined,
          type: 'api-import' // Add this type
        }),
      })

      if (!response.ok) throw new Error('Failed to import API data')

      const document = await response.json()
      setTrainingData(prev => ({
        ...prev,
        documents: [document, ...prev.documents],
      }))

      toast({
        title: "Success",
        description: "API data imported successfully",
      })
      setApiEndpoint('')
      setApiHeaders('')
      setApiCustomName('')
    } catch (error) {
      console.error('Import error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import API data",
      })
    } finally {
      setIsApiImporting(false)
    }
  }

  // Fetch chatbots and initial training status
  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch('/api/chatbots')
        if (!response.ok) throw new Error('Failed to fetch chatbots')
        const data = await response.json()
        setChatbots(data)

        // Select first chatbot and fetch its training status
        if (data.length > 0) {
          setSelectedChatbot(data[0].id)
          await dispatch(fetchTrainingStatus(data[0].id)).unwrap()
        }
      } catch (error) {
        console.error('Error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chatbots",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [dispatch, toast])

  // Fetch training status when chatbot selection changes
  useEffect(() => {
    if (selectedChatbot) {
      dispatch(fetchTrainingStatus(selectedChatbot))
    }
  }, [selectedChatbot, dispatch])

  useEffect(() => {
    if (selectedChatbot) {
      // Fetch selected chatbot details
      const fetchChatbotDetails = async () => {
        try {
          const response = await fetch(`/api/training?chatbotId=${selectedChatbot}`)
          if (!response.ok) throw new Error('Failed to fetch chatbot details')
          const data = await response.json()
          setSelectedChatbotDetails({
            name: chatbots.find(c => c.id === selectedChatbot)?.name || 'Unknown',
            documentsCount: data.documentsCount,
            lastTrainingDate: data.lastTrainingDate,
          })
        } catch (error) {
          console.error('Error:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load chatbot details",
          })
        }
      }

      fetchChatbotDetails()
    }
  }, [selectedChatbot, chatbots, toast])

  // Update fetchTrainingData to properly fetch documents
  const fetchTrainingData = async () => {
    if (!selectedChatbot) return;

    try {
      const response = await fetch(`/api/training?chatbotId=${selectedChatbot}`)
      if (!response.ok) throw new Error('Failed to fetch training data')
      const data = await response.json()

      setTrainingData({
        documents: data.documents || [], // Use the documents from the training API response
        websites: [],  // Keep these empty for now
        apis: []       // Keep these empty for now
      })

      setSelectedChatbotDetails({
        name: data.name,
        documentsCount: data.documentsCount,
        lastTrainingDate: data.lastTrainingDate,
      })
    } catch (error) {
      console.error('Error fetching training data:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load training data",
      })
    }
  }

  // Add useEffect to fetch training data when chatbot is selected
  useEffect(() => {
    if (selectedChatbot) {
      fetchTrainingData()
    }
  }, [selectedChatbot])

  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())

  // Add document selection handler
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(documentId)) {
        newSet.delete(documentId)
      } else {
        newSet.add(documentId)
      }
      return newSet
    })
  }

  // Update handleStartTraining to track phases
  const handleStartTraining = async () => {
    if (!selectedChatbot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a chatbot first",
      })
      return
    }

    if (selectedDocuments.size === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one document for training",
      })
      return
    }

    setIsTraining(true)
    try {
      await dispatch(startTraining({
        chatbotId: selectedChatbot,
        documents: Array.from(selectedDocuments),
        modelConfig
      })).unwrap()

      toast({
        title: "Success",
        description: "Training started successfully",
      })

      // Simulate training phases
      let progress = 0
      let phaseIndex = 0
      
      intervalRef.current = setInterval(async () => {
        try {
          if (progress >= 100) {
            if (phaseIndex >= TRAINING_PHASES.length - 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
              }
              setIsTraining(false)
              dispatch(fetchTrainingStatus(selectedChatbot))
              
              toast({
                title: "Training Complete",
                description: "Your chatbot has been successfully trained and is ready to use!",
              })
              return
            }
            progress = 0
            phaseIndex++
            
            // Update phases status
            setTrainingPhases(prev => prev.map((phase, idx) => ({
              ...phase,
              status: idx < phaseIndex ? 'completed' : idx === phaseIndex ? 'in-progress' : 'pending',
              progress: idx < phaseIndex ? 100 : idx === phaseIndex ? 0 : 0
            })))
          }

          progress += 5
          
          // Update current phase progress
          setTrainingPhases(prev => prev.map((phase, idx) => ({
            ...phase,
            progress: idx === phaseIndex ? progress : phase.progress
          })))

          const result = await dispatch(updateTrainingPhase({
            chatbotId: selectedChatbot,
            phase: TRAINING_PHASES[phaseIndex],
            progress,
          })).unwrap()

          // Update training stats
          setTrainingStats(result)

          if (result.status === 'failed') {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setIsTraining(false)
            
            toast({
              variant: "destructive",
              title: "Training Failed",
              description: "There was an error training your chatbot. Please try again.",
            })
          }
        } catch (error) {
          console.error('Error updating phase:', error)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setIsTraining(false)
          
          toast({
            variant: "destructive",
            title: "Training Error",
            description: "Failed to update training progress. Please try again.",
          })
        }
      }, 1000)
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start training",
      })
      setIsTraining(false)
    }
  }

  // Add model selection handler
  const handleModelChange = (value: string) => {
    setSelectedModel(value)
  }

  // Add model configuration handler
  const handleModelConfigChange = (key: keyof ModelConfig, value: string | number) => {
    setModelConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCancelTraining = async () => {
    try {
      await dispatch(cancelTraining(selectedChatbot)).unwrap()
      
      // Clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null;
      }

      setIsTraining(false)
      
      toast({
        title: "Success",
        description: "Training cancelled successfully",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel training",
      })
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null;
      }
    }
  }, [])

  // Show loading state while fetching initial data
  if (isLoading || status === 'loading') {
    return <LoadingState message="Loading training data..." />
  }

  // Show error state if something went wrong
  if (status === 'failed' || error) {
    return <ErrorState message={error || 'Failed to load training data'} />
  }

  // Show empty state if no chatbots available
  if (chatbots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Bot className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No Chatbots Available</h3>
        <p className="text-muted-foreground mb-4">
          Create a chatbot first to start training
        </p>
        <Link href="/dashboard/chatbots">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Chatbot
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Training</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Train and manage your AI models
        </p>
      </div>

      {/* Chatbot Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Chatbot for Training</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedChatbot}
            onValueChange={setSelectedChatbot}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a chatbot to train" />
            </SelectTrigger>
            <SelectContent>
              {chatbots.map((chatbot) => (
                <SelectItem key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedChatbot && (
        <>
          {/* Selected Chatbot Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Training Chatbot: {selectedChatbotDetails?.name}
                </div>
                <Badge variant="outline">
                  {selectedChatbotDetails?.documentsCount || 0} documents available
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Last Training</p>
                  <p className="text-2xl font-bold">
                    {selectedChatbotDetails?.lastTrainingDate
                      ? new Date(selectedChatbotDetails.lastTrainingDate).toLocaleDateString()
                      : 'Never trained'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Training Status</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {isTraining ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Training
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Ready
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Training Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="documents">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents ({trainingData.documents.length})
                  </TabsTrigger>
                  <TabsTrigger value="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website Import
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    API Integration
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    {trainingData.documents.length > 0 ? (
                      trainingData.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-center gap-4">
                            <FileIcon className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatBytes(doc.size)} • {new Date(doc.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Checkbox 
                            checked={selectedDocuments.has(doc.id)}
                            onCheckedChange={() => handleDocumentSelect(doc.id)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No documents available for training</p>
                        <Link href="/dashboard/documents">
                          <Button variant="link" className="mt-2">
                            Upload Documents
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="website" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label>Website URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        disabled={isImporting}
                      />
                      <Label>Custom Name (Optional)</Label>
                      <Input
                        placeholder="My Website Import"
                        value={websiteCustomName}
                        onChange={(e) => setWebsiteCustomName(e.target.value)}
                        disabled={isImporting}
                      />
                      <Button
                        onClick={handleWebsiteImport}
                        disabled={isImporting || !websiteUrl || !selectedChatbot}
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Globe className="mr-2 h-4 w-4" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Website Import History */}
                  <div className="space-y-4 mt-8">
                    {getFilteredDocuments('website').map((website) => (
                      <div key={website.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{website.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Imported on: {new Date(website.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formatBytes(website.size)}
                          </Badge>
                          <Checkbox />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label>API Endpoint</Label>
                      <Input
                        placeholder="https://api.example.com/data"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        disabled={isApiImporting}
                      />
                      <Label>Custom Name (Optional)</Label>
                      <Input
                        placeholder="My API Import"
                        value={apiCustomName}
                        onChange={(e) => setApiCustomName(e.target.value)}
                        disabled={isApiImporting}
                      />
                      <Button
                        onClick={handleApiImport}
                        disabled={isApiImporting || !apiEndpoint || !selectedChatbot}
                      >
                        {isApiImporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Code className="mr-2 h-4 w-4" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Headers (Optional)</Label>
                      <Textarea
                        placeholder='{
  "Authorization": "Bearer your-token",
  "X-API-Key": "your-api-key"
}'
                        value={apiHeaders}
                        onChange={(e) => setApiHeaders(e.target.value)}
                        disabled={isApiImporting}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter headers in JSON format (optional)
                      </p>
                    </div>
                  </div>

                  {/* API Import History */}
                  <div className="space-y-4 mt-8">
                    {getFilteredDocuments('api').map((api) => (
                      <div key={api.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{api.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Imported on: {new Date(api.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formatBytes(api.size)}
                          </Badge>
                          <Checkbox />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Model</Label>
                <Select
                  value={modelConfig.model}
                  onValueChange={(value) => handleModelConfigChange('model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>OpenAI</SelectLabel>
                      {models.openai.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Anthropic</SelectLabel>
                      {models.anthropic.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Google</SelectLabel>
                      {models.google.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Ollama</SelectLabel>
                      {models.ollama.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Meta</SelectLabel>
                      {models.meta.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Mistral AI</SelectLabel>
                      {models.mistral.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Cohere</SelectLabel>
                      {models.cohere.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the AI model for your chatbot
                </p>
              </div>

              <div className="space-y-2">
                <Label>Temperature</Label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modelConfig.temperature}
                      onChange={(e) => handleModelConfigChange('temperature', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {modelConfig.temperature.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Controls randomness: 0 is focused, 1 is creative
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Tokens</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="1"
                    max="4000"
                    value={modelConfig.maxTokens}
                    onChange={(e) => handleModelConfigChange('maxTokens', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-16 text-right">
                    tokens
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum length of the response
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Language & Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Language & Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Settings */}
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
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Primary language for training and responses
                </p>
              </div>

              {/* Context Settings */}
              <div className="space-y-2">
                <Label>Training Context</Label>
                <div className="space-y-4">
                  {defaultContexts.map((context) => (
                    <div key={context.id} className="flex items-start space-x-4">
                      <Switch
                        id={context.id}
                        defaultChecked={context.enabled}
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor={context.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {context.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {context.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Training Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Current Training Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{trainingStats.progress}%</span>
                </div>
                <Progress value={trainingStats.progress} />
              </div>

              {/* Training Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Documents Processed</p>
                  <p className="text-2xl font-bold">
                    {trainingStats.documentsProcessed}/{trainingStats.totalDocuments}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time Remaining</p>
                  <p className="text-2xl font-bold">
                    ~{trainingStats.timeRemaining} min
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Current Accuracy</p>
                  <p className="text-2xl font-bold">
                    {trainingStats.currentAccuracy.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Training Speed</p>
                  <p className="text-2xl font-bold">
                    {trainingStats.trainingSpeed.toFixed(1)} t/s
                  </p>
                </div>
              </div>

              {/* Training Phases */}
              <div className="space-y-4">
                {trainingStats.phases?.map((phase, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {phase.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : phase.status === "in-progress" ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        {phase.phase}
                      </span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="w-full"
                  onClick={handleStartTraining}
                  disabled={isTraining || selectedDocuments.size === 0}
                >
                  {isTraining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Training in Progress...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Start Training
                    </>
                  )}
                </Button>
                {isTraining && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleCancelTraining}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Training
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add proper loading states */}
      {status === 'loading' && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Add proper error handling */}
      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {/* Add training progress modal */}
      {isTraining && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Training in Progress
                <Badge variant="outline">
                  {trainingStats.progress || 0}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Training Phases */}
              <div className="space-y-4">
                {trainingPhases.map((phase, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {phase.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : phase.status === "in-progress" ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        {phase.phase}
                      </span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} />
                  </div>
                ))}
              </div>

              {/* Training Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Documents Processed</p>
                  <p className="text-2xl font-bold">
                    {trainingStats.documentsProcessed}/{trainingStats.totalDocuments}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time Remaining</p>
                  <p className="text-2xl font-bold">
                    ~{trainingStats.timeRemaining} min
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Current Accuracy</p>
                  <p className="text-2xl font-bold">
                    {trainingStats.currentAccuracy.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Training Speed</p>
                  <p className="text-2xl font-bold">
                    {trainingStats.trainingSpeed.toFixed(1)} t/s
                  </p>
                </div>
              </div>

              {/* Cancel Button */}
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleCancelTraining}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Training
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 