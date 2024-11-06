'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  CreditCard, 
  Receipt, 
  ArrowUpRight,
  MessageSquare,
  Bot,
  Database,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

const invoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '2024-01-01',
    amount: 199.00,
    status: 'paid',
  },
  {
    id: 'INV-002',
    date: '2024-02-01',
    amount: 199.00,
    status: 'paid',
  },
  {
    id: 'INV-003',
    date: '2024-03-01',
    amount: 199.00,
    status: 'pending',
  },
]

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Enterprise Plan</h3>
              <p className="text-sm text-muted-foreground">$199/month</p>
            </div>
            <Button>Change Plan</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">of Unlimited</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.5% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Chatbots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">of Unlimited</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +3 this month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <p className="text-xs text-muted-foreground">of Unlimited</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +500 MB this month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  API Rate Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,000</div>
                <p className="text-xs text-muted-foreground">requests/min</p>
                <div className="text-xs text-muted-foreground mt-1">
                  Enterprise limit
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-md border p-2">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/24</div>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name on Card</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Billing Email</Label>
              <Input defaultValue="billing@acme.com" type="email" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invoice.status === 'paid' && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">Paid</span>
                        </>
                      )}
                      {invoice.status === 'pending' && (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-500">Pending</span>
                        </>
                      )}
                      {invoice.status === 'failed' && (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500">Failed</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Download</Button>
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