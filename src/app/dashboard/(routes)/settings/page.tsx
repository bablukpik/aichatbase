'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Users,
  Lock,
  FileCheck,
  Palette,
  Globe,
  Bell,
  Building,
  Mail,
  CreditCard,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account and workspace settings
        </p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label>Custom Domain</Label>
            <div className="flex gap-2">
              <Input placeholder="chat.yourdomain.com" />
              <Button>Verify</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enterprise Plan</p>
                <p className="text-sm text-muted-foreground">$199/month</p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SSO Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Single Sign-On
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SSO Provider</Label>
            <Select defaultValue="okta">
              <SelectTrigger>
                <SelectValue placeholder="Select SSO provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="okta">Okta</SelectItem>
                <SelectItem value="azure">Azure AD</SelectItem>
                <SelectItem value="google">Google Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Domain</Label>
            <Input placeholder="your-company.com" />
          </div>
          <Button>Configure SSO</Button>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Team Members</div>
              <div className="text-sm text-muted-foreground">25 of unlimited seats used</div>
            </div>
            <Button>Invite Members</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">User Groups</div>
            <Button variant="outline">Manage</Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Custom Roles</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Permission Sets</span>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Access Control</span>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Compliance & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Data Retention</div>
                <div className="text-xs text-muted-foreground">Currently set to 90 days</div>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Audit Logs</div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">2FA Requirement</div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* White Labeling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            White Labeling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input placeholder="Your Company Name" />
          </div>
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input type="color" className="w-20" />
              <Input placeholder="#000000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex gap-2">
              <Input type="file" accept="image/*" />
              <Button variant="outline">Upload</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-xs text-muted-foreground">For important alerts</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Slack Integration</div>
                <div className="text-xs text-muted-foreground">Real-time updates</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Webhook Notifications</div>
                <div className="text-xs text-muted-foreground">For custom integrations</div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing & Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">Enterprise • $199/month</p>
            </div>
            <Button variant="outline">View Invoices</Button>
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="flex items-center justify-between">
              <div className="text-sm">•••• •••• •••• 4242</div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Organization</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your organization and all its data
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Organization</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    organization and remove all data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive">
                    Yes, delete organization
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 