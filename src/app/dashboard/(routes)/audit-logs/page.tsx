'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Download,
  Search,
  Filter,
  User,
  Bot,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AuditLog {
  id: string
  action: string
  actor: string
  target: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
  details: string
  ip: string
}

const auditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'User Login',
    actor: 'john@example.com',
    target: 'Authentication',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'success',
    details: 'Successful login via Google SSO',
    ip: '192.168.1.1'
  },
  {
    id: '2',
    action: 'Chatbot Created',
    actor: 'jane@example.com',
    target: 'Customer Support Bot',
    timestamp: '2024-03-15T11:15:00Z',
    status: 'success',
    details: 'New chatbot created with initial configuration',
    ip: '192.168.1.2'
  },
  {
    id: '3',
    action: 'API Key Generated',
    actor: 'mike@example.com',
    target: 'API Management',
    timestamp: '2024-03-15T12:00:00Z',
    status: 'warning',
    details: 'New API key generated with full access',
    ip: '192.168.1.3'
  },
  {
    id: '4',
    action: 'Permission Change',
    actor: 'admin@example.com',
    target: 'Role Management',
    timestamp: '2024-03-15T13:45:00Z',
    status: 'error',
    details: 'Failed to update user permissions',
    ip: '192.168.1.4'
  }
]

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(auditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [timeRange, setTimeRange] = useState('24h')
  const [eventType, setEventType] = useState('all')

  const getStatusIcon = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and monitor all system activities
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="chatbot">Chatbot</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="user">User Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Detailed record of all system events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.action.includes('User') && <User className="h-4 w-4" />}
                      {log.action.includes('Chatbot') && <Bot className="h-4 w-4" />}
                      {log.action.includes('API') && <Settings className="h-4 w-4" />}
                      {log.action.includes('Permission') && <Shield className="h-4 w-4" />}
                      {log.action}
                    </div>
                  </TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="capitalize">{log.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{log.ip}</code>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 