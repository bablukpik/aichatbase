'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Trash2, FileType, Globe, Database } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  status: 'processed' | 'processing' | 'failed'
  chatbotId?: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'product-manual.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      status: 'processed',
      chatbotId: '1'
    },
    {
      id: '2',
      name: 'faq.docx',
      type: 'Word',
      size: '1.2 MB',
      uploadedAt: '2024-01-16',
      status: 'processed',
      chatbotId: '1'
    },
    {
      id: '3',
      name: 'api-docs.md',
      type: 'Markdown',
      size: '156 KB',
      uploadedAt: '2024-01-17',
      status: 'processing'
    }
  ])

  const [selectedChatbot, setSelectedChatbot] = useState<string>('')
  const [uploadType, setUploadType] = useState<string>('file')
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleFileUpload = async (file: File, chatbotId?: string) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      if (chatbotId) {
        formData.append('chatbotId', chatbotId)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const document = await response.json()
      setDocuments([document, ...documents])
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, selectedChatbot)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your training documents and files
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Upload a file or connect to an external source
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Source Type</Label>
                <Select
                  value={uploadType}
                  onValueChange={setUploadType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="api">API Endpoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {uploadType === 'file' && (
                <div className="grid gap-2">
                  <Label>File</Label>
                  <Input 
                    type="file" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {isUploading && <LoadingState message="Uploading file..." />}
                </div>
              )}

              {uploadType === 'website' && (
                <div className="grid gap-2">
                  <Label>Website URL</Label>
                  <Input placeholder="https://your-website.com" />
                </div>
              )}

              {uploadType === 'api' && (
                <div className="grid gap-2">
                  <Label>API Endpoint</Label>
                  <Input placeholder="https://api.your-service.com/docs" />
                </div>
              )}

              <div className="grid gap-2">
                <Label>Assign to Chatbot (Optional)</Label>
                <Select
                  value={selectedChatbot}
                  onValueChange={setSelectedChatbot}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chatbot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Customer Support Bot</SelectItem>
                    <SelectItem value="2">Sales Assistant</SelectItem>
                    <SelectItem value="3">Technical Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button>Upload Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upload Methods */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              File Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload documents directly from your computer
            </p>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Import content from your website
            </p>
            <Button variant="outline" className="w-full">
              <Globe className="mr-2 h-4 w-4" />
              Connect Website
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to your API endpoint
            </p>
            <Button variant="outline" className="w-full">
              <FileType className="mr-2 h-4 w-4" />
              Configure API
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.size} • Uploaded on {doc.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {doc.chatbotId ? 'Assigned to Customer Support Bot' : 'Unassigned'}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 