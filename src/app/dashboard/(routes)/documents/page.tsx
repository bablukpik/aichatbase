'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Trash2, FileIcon, Search, X } from "lucide-react"
import { useDropzone } from 'react-dropzone'
import { useToast } from "@/hooks/use-toast"
import { formatBytes } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  createdAt: string
  chatbotId: string
  chatbotName: string
}

interface UploadingFile {
  file: File
  progress: number
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [selectedChatbot, setSelectedChatbot] = useState<string>('')
  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (!response.ok) throw new Error('Failed to fetch documents')
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents",
      })
    }
  }

  useEffect(() => {
    // Fetch chatbots and documents when component mounts
    const initialize = async () => {
      try {
        const [chatbotsRes, documentsRes] = await Promise.all([
          fetch('/api/chatbots'),
          fetch('/api/documents')
        ])

        if (!chatbotsRes.ok) throw new Error('Failed to fetch chatbots')
        if (!documentsRes.ok) throw new Error('Failed to fetch documents')

        const chatbotsData = await chatbotsRes.json()
        const documentsData = await documentsRes.json()

        setChatbots(chatbotsData)
        setDocuments(documentsData)
        
      } catch (error) {
        console.error('Error initializing:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data",
        })
      }
    }

    initialize()
  }, [toast])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedChatbot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a chatbot first",
      })
      return
    }

    const newUploadingFiles = acceptedFiles.map(file => ({
      file,
      progress: 0
    }))
    setUploadingFiles(prev => [...prev, ...newUploadingFiles])

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatbotId', selectedChatbot)

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadingFiles(prev => prev.map(uploadingFile => {
            if (uploadingFile.file === file && uploadingFile.progress < 90) {
              return { ...uploadingFile, progress: uploadingFile.progress + 10 }
            }
            return uploadingFile
          }))
        }, 200)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          throw new Error('Failed to upload file')
        }

        const document = await response.json()
        setDocuments(prev => [document, ...prev])
        
        // Set progress to 100% when complete
        setUploadingFiles(prev => prev.map(uploadingFile => {
          if (uploadingFile.file === file) {
            return { ...uploadingFile, progress: 100 }
          }
          return uploadingFile
        }))

        // Remove the file from uploading state after a delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(uploadingFile => uploadingFile.file !== file))
        }, 1000)

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        })
      } catch (error) {
        console.error('Upload error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to upload ${file.name}`,
        })
        setUploadingFiles(prev => prev.filter(uploadingFile => uploadingFile.file !== file))
      }
    }
  }, [selectedChatbot, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document",
      })
    }
  }

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchQuery.toLowerCase()
    return (
      doc.name.toLowerCase().includes(searchLower) ||
      doc.chatbotName.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Upload and manage training documents for your chatbots
        </p>
      </div>

      {/* Chatbot Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="w-full rounded-md border p-2"
            value={selectedChatbot}
            onChange={(e) => setSelectedChatbot(e.target.value)}
          >
            {chatbots.length === 0 ? (
              <option value="">No chatbots available</option>
            ) : (
              <>
                <option value="">Select a chatbot</option>
                {chatbots.map((chatbot) => (
                  <option key={chatbot.id} value={chatbot.id}>
                    {chatbot.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
              ${uploadingFiles.length > 0 || !selectedChatbot ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}`}
          >
            <input {...getInputProps()} disabled={uploadingFiles.length > 0 || !selectedChatbot} />
            {!selectedChatbot ? (
              <p>Please select a chatbot first</p>
            ) : isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p>Drag & drop files here, or click to select files</p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, TXT, MD (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-4">
              {uploadingFiles.map((uploadingFile, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{uploadingFile.file.name}</span>
                    <span>{uploadingFile.progress}%</span>
                  </div>
                  <Progress value={uploadingFile.progress} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {searchQuery 
              ? `Filtered Documents (${filteredDocuments.length}/${documents.length})`
              : `Uploaded Documents (${documents.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by file name or chatbot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <FileIcon className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatBytes(doc.size)}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-medium text-primary">{doc.chatbotName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="text-center text-muted-foreground py-8">
                No documents found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No documents uploaded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
