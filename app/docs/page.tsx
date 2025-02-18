'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheck, Keyboard, Star, Info, Code, Users } from 'lucide-react';
import Image from 'next/image';

export default function DocsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">📚 Documentation</h1>
        
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
                <CardTitle>🚀 Introducing Version 5.0.7</CardTitle>
                <CardDescription>Simpler, Faster, Better</CardDescription>
              </CardHeader>
              <div className="mt-4">
                <Image src="/version7.png" alt="Version 5.0.7" className="w-full h-auto rounded-lg shadow-lg" width={800} height={400} />
              </div>
              <CardContent className="space-y-4 mt-4">
                <p>
                  We’re excited to announce <span className="font-semibold">Version 5.0.7</span> of the <span className="font-semibold">Prefect Board Attendance System</span>.  
                  This update brings new features, performance improvements, and essential bug fixes to make attendance management even easier and more accurate.
                </p>

                <h3 className="text-lg font-semibold">✨ What’s New</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">Advanced Role Management</span> – More control over user permissions.</li>
                  <li><span className="font-semibold">Customizable Attendance Reports</span> – Tailor reports to your needs.</li>
                  <li><span className="font-semibold">Improved Late Arrival Alerts</span> – Instant notifications for better monitoring.</li>
                  <li><span className="font-semibold">Refreshed User Interface</span> – Modern look with light mode support.</li>
                  <li><span className="font-semibold">Manual Time Entry (Beta)</span> – Log attendance manually for accuracy.</li>
                  <li><span className="font-semibold">Enhanced Visual Elements</span> – New icons and UI improvements.</li>
                  <li><span className="font-semibold">Clock and Manual Time Entry Enhancements</span> – Better accuracy in tracking attendance.</li>
                  <li><span className="font-semibold">Admin Panel Redesign</span> – More intuitive and efficient user experience.</li>
                  <li><span className="font-semibold">Admin Panel Password Protection</span> – Added security for the admin panel.</li>
                  <li><span className="font-semibold">Games Captain Role</span> – New role added for better management.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">🐞 Bug Fixes & Improvements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">Precision Timestamp Fix</span> – Accurate time tracking on all platforms.</li>
                  <li><span className="font-semibold">Mobile UI Enhancements</span> – Smoother mobile experience.</li>
                  <li><span className="font-semibold">Performance Boost</span> – Faster load times.</li>
                  <li><span className="font-semibold">Fixed Broken Documentation Links</span> – Easy access to updated guides.</li>
                  <li><span className="font-semibold">Memory Leak Fixes</span> – Better system stability and resource management.</li>
                  <li><span className="font-semibold">Clearer Error Messages</span> – More informative alerts for easier troubleshooting.</li>
                  <li><span className="font-semibold">Improved Keyboard Shortcuts</span> – Enhanced functionality for role selection.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>🏫 Prefect Board Attendance System</CardTitle>
                <CardDescription>A modern attendance tracking system for school prefects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The Prefect Board Attendance System is designed to streamline the daily attendance process for school prefects. It provides an intuitive interface for marking attendance and powerful administrative tools for monitoring and managing attendance records.</p>
                
                <h3 className="text-lg font-semibold mt-4">🚀 Getting Started</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Select your prefect role from the dropdown menu</li>
                  <li>Enter your unique prefect number</li>
                  <li>Click "Mark Attendance" or press Enter</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>🛠️ System Features</CardTitle>
                <CardDescription>Key capabilities and functionalities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">✅ Attendance Marking</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Role-based attendance tracking</li>
                  <li>Automatic timestamp recording</li>
                  <li>Late arrival detection (after 7:00 AM)</li>
                  <li>Real-time notifications</li>
                </ul>
                
                <h3 className="font-semibold mt-4">🔧 Administrative Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Daily attendance export</li>
                  <li>Role-wise statistics</li>
                  <li>Late arrival monitoring</li>
                  <li>60-day data retention</li>
                  <li>Automatic data cleanup</li>
                  <li>Admin panel with password protection</li>
                  <li>Redesigned admin panel for better user experience</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shortcuts">
            <Card>
              <CardHeader>
                <CardTitle>⌨️ Keyboard Shortcuts</CardTitle>
                <CardDescription>Quick access to system features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span>Role: Head</span>
                    <kbd className="px-2 py-1 bg-muted rounded">1</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Deputy</span>
                    <kbd className="px-2 py-1 bg-muted rounded">2</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Senior Executive</span>
                    <kbd className="px-2 py-1 bg-muted rounded">3</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Executive</span>
                    <kbd className="px-2 py-1 bg-muted rounded">4</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Super Senior</span>
                    <kbd className="px-2 py-1 bg-muted rounded">5</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Senior</span>
                    <kbd className="px-2 py-1 bg-muted rounded">6</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Junior</span>
                    <kbd className="px-2 py-1 bg-muted rounded">7</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Sub</span>
                    <kbd className="px-2 py-1 bg-muted rounded">8</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Apprentice</span>
                    <kbd className="px-2 py-1 bg-muted rounded">9</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role: Games Captain</span>
                    <kbd className="px-2 py-1 bg-muted rounded">0</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Toggle Shortcuts</span>
                    <kbd className="px-2 py-1 bg-muted rounded">?</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}