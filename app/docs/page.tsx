'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheck, Keyboard, Star, Info, Code, Users } from 'lucide-react';
import Image from 'next/image';

export default function DocsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Documentation</h1>
        
        <Tabs defaultValue="new-version">
          <TabsList className="mb-4">
            <TabsTrigger value="new-version"><Code className="mr-2 h-4 w-4" />New Version</TabsTrigger>
            <TabsTrigger value="overview"><Info className="mr-2 h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="features"><Star className="mr-2 h-4 w-4" />Features</TabsTrigger>
            <TabsTrigger value="shortcuts"><Keyboard className="mr-2 h-4 w-4" />Keyboard Shortcuts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-version">
            <Card>
              <CardHeader>
                <CardTitle>Introducing Version 5.0.2</CardTitle>
                <CardDescription>Enhanced features and improvements</CardDescription>
              </CardHeader>
              <div className="mt-4">
                <img src="/version2.png" alt="Version 5.0.2" className="w-full h-auto rounded-lg shadow-lg" />
              </div>
              <CardContent className="space-y-4 mt-4">
                <p>We are excited to introduce Version 5.0.2 of the Prefect Board Attendance System. This update brings a host of new features and improvements to enhance your experience.</p>
                
                <h3 className="text-lg font-semibold">New Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enhanced role management</li>
                  <li>Customizable attendance reports</li>
                  <li>Improved late arrival alerts</li>
                  <li>New user interface with light mode support</li>
                  <li>Manual time entry system (in development)</li>
                  <li>Additional icons for better user experience</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Bug Fixes</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Fixed issues with timestamp accuracy</li>
                    <li>Resolved UI glitches on mobile devices</li>
                    <li>Improved performance and load times</li>
                    <li>Fixed broken links in the documentation</li>
                    <li>Addressed minor memory leaks</li>
                    <li>Enhanced error messages for better debugging</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Prefect Board Attendance System</CardTitle>
                <CardDescription>A modern attendance tracking system for school prefects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The Prefect Board Attendance System is designed to streamline the daily attendance process for school prefects. It provides an intuitive interface for marking attendance and powerful administrative tools for monitoring and managing attendance records.</p>
                
                <h3 className="text-lg font-semibold mt-4">Getting Started</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Select your prefect role from the dropdown menu</li>
                  <li>Enter your unique prefect number</li>
                  <li>Click "Mark Attendance" or press Enter</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shortcuts">
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>Quick access to system features ( This is Testing Feature and Still this Not Working )</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span>Navigate to Home</span>
                    <kbd className="px-2 py-1 bg-muted rounded">Ctrl + H</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Open Admin Panel</span>
                    <kbd className="px-2 py-1 bg-muted rounded">Ctrl + A</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>View Documentation</span>
                    <kbd className="px-2 py-1 bg-muted rounded">Ctrl + D</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>System Features</CardTitle>
                <CardDescription>Key capabilities and functionalities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">Attendance Marking</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Role-based attendance tracking</li>
                  <li>Automatic timestamp recording</li>
                  <li>Late arrival detection (after 7:00 AM)</li>
                  <li>Real-time notifications</li>
                </ul>
                
                <h3 className="font-semibold mt-4">Administrative Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Daily attendance export</li>
                  <li>Role-wise statistics</li>
                  <li>Late arrival monitoring</li>
                  <li>14-day data retention</li>
                  <li>Automatic data cleanup</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}