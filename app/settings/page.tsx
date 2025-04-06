"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUser } from "@/lib/mock-data"
import { useSimulation } from "@/hooks/use-simulation"
import { useToast } from "@/hooks/use-toast"
import { User, Bell, Palette, Shield, Download, Upload, Trash, Moon, Sun, Monitor, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    avatar: mockUser.avatar,
  })
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    fontSize: "medium",
    reminderTime: "20:00",
    reminderFrequency: "daily",
    emailNotifications: true,
    pushNotifications: false,
    privacySettings: {
      isPrivate: true,
      allowSharing: false,
    },
  })
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Simulate saving preferences
  const { execute: savePreferences, isLoading: isSaving } = useSimulation<any, [any]>(
    "preferences",
    "updatePreferences",
    false,
  )

  // Handle save preferences
  const handleSavePreferences = async () => {
    try {
      await savePreferences(preferences)
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      // Error is handled by useSimulation
    }
  }

  // Handle save account
  const handleSaveAccount = () => {
    setIsEditing(false)
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully.",
    })
  }

  // Handle export data
  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your journal data is being prepared for export...",
    })

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your journal data has been exported successfully.",
      })
    }, 2000)
  }

  // Handle import data
  const handleImportData = () => {
    toast({
      title: "Import started",
      description: "Please select a file to import your journal data.",
    })
  }

  // Handle delete account
  const handleDeleteAccount = () => {
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully. Redirecting to login...",
    })

    // Simulate redirect delay
    setTimeout(() => {
      window.location.href = "/login"
    }, 2000)
  }

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="account" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </div>

                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={userData.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-background"
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">{userData.name}</h3>
                        <p className="text-muted-foreground">{userData.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Member since {new Date(mockUser.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAccount}>Save Changes</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Protect your account with two-factor authentication</p>
                      <p className="text-sm text-muted-foreground">Currently enabled via authenticator app</p>
                    </div>
                    <Button variant="outline">Manage 2FA</Button>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <h3 className="text-sm font-medium">Active Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p>Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • IP: 192.168.1.1</p>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Mobile App</p>
                        <p className="text-sm text-muted-foreground">iPhone • Last active: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Premium Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Renewal on {new Date(mockUser.subscription.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>

                <div className="border rounded-md p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">Your Premium Features</h4>
                  <ul className="space-y-1">
                    {mockUser.subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Color Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${
                        theme === "light" ? "border-primary ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex justify-center mb-2">
                        <Sun className="h-6 w-6" />
                      </div>
                      <p className="text-center font-medium">Light</p>
                    </div>

                    <div
                      className={`border rounded-md p-4 cursor-pointer ${
                        theme === "dark" ? "border-primary ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex justify-center mb-2">
                        <Moon className="h-6 w-6" />
                      </div>
                      <p className="text-center font-medium">Dark</p>
                    </div>

                    <div
                      className={`border rounded-md p-4 cursor-pointer ${
                        theme === "system" ? "border-primary ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="flex justify-center mb-2">
                        <Monitor className="h-6 w-6" />
                      </div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Font Size</h3>

                  <div className="flex items-center space-x-4">
                    <Select
                      value={preferences.fontSize}
                      onValueChange={(value) => setPreferences({ ...preferences, fontSize: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="text-sm">
                      <span
                        className={
                          preferences.fontSize === "small"
                            ? "text-sm"
                            : preferences.fontSize === "large"
                              ? "text-lg"
                              : "text-base"
                        }
                      >
                        Preview text
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Language</h3>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Editor Settings</CardTitle>
              <CardDescription>Customize your writing experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Spell Check</h3>
                    <p className="text-sm text-muted-foreground">Automatically check spelling while you write</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Auto-save</h3>
                    <p className="text-sm text-muted-foreground">Automatically save your entries while writing</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Markdown Preview</h3>
                    <p className="text-sm text-muted-foreground">Show live preview of markdown formatting</p>
                  </div>
                  <Switch checked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Distraction-free Mode</h3>
                    <p className="text-sm text-muted-foreground">Hide UI elements while writing for focus</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Reminders</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Journal Reminders</p>
                      <p className="text-sm text-muted-foreground">Receive reminders to write in your journal</p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="reminder-time">Reminder Time</Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={preferences.reminderTime}
                        onChange={(e) => setPreferences({ ...preferences, reminderTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="reminder-frequency">Frequency</Label>
                      <Select
                        value={preferences.reminderFrequency}
                        onValueChange={(value) => setPreferences({ ...preferences, reminderFrequency: value })}
                      >
                        <SelectTrigger id="reminder-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekdays">Weekdays</SelectItem>
                          <SelectItem value="weekends">Weekends</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Weekly Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary of your journaling activity
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>AI Insights</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about new AI-generated insights
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Product Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about new features and updates
                        </p>
                      </div>
                      <Switch checked={false} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Push Notifications</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Enable Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Journal Privacy</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Private Journal</p>
                      <p className="text-sm text-muted-foreground">
                        Keep your journal entries private and visible only to you
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacySettings.isPrivate}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          privacySettings: {
                            ...preferences.privacySettings,
                            isPrivate: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Allow Sharing</p>
                      <p className="text-sm text-muted-foreground">
                        Allow sharing individual entries with others via secure links
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacySettings.allowSharing}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          privacySettings: {
                            ...preferences.privacySettings,
                            allowSharing: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Data Usage</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>AI Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to analyze your entries for insights and patterns
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Usage Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        Share anonymous usage data to help improve the app
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Security</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>End-to-End Encryption</p>
                      <p className="text-sm text-muted-foreground">Encrypt your journal entries for maximum privacy</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Biometric Lock</p>
                      <p className="text-sm text-muted-foreground">
                        Require biometric authentication to access your journal
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, or delete your journal data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Download a copy of all your journal entries and data</p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleExportData} className="gap-1">
                      <Download className="h-4 w-4" />
                      Export as JSON
                    </Button>
                    <Button variant="outline" onClick={handleExportData} className="gap-1">
                      <Download className="h-4 w-4" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Import Data</h3>
                  <p className="text-sm text-muted-foreground">Import journal entries from another source</p>
                  <Button variant="outline" onClick={handleImportData} className="gap-1">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-1">
                        <Trash className="h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all of your
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Data Storage</CardTitle>
              <CardDescription>Information about your data storage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Storage Usage</h3>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>3.5 GB used</span>
                    <span>10 GB total</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium">Storage Breakdown</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        Text Entries
                      </span>
                      <span>1.2 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                        Images
                      </span>
                      <span>1.8 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        Attachments
                      </span>
                      <span>0.5 GB</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Upgrade Storage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

