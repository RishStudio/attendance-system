"use client"

import { useState, useEffect } from "react"
import AttendanceForm from "@/components/AttendanceForm"
import { motion } from "framer-motion"
import { XCircle, CheckCircle, Info, Shield, Bug, RefreshCcw, Bell, UserCheck } from "lucide-react"

export default function Home() {
  const [showNewVersionMessage, setShowNewVersionMessage] = useState(false)

  useEffect(() => {
    // Simulate checking for a new version (you can replace this with an actual version check)
    setShowNewVersionMessage(true)
  }, [])

  const closeMessage = () => {
    setShowNewVersionMessage(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">School Prefect Board Attendance System</h1>

      {showNewVersionMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg fixed top-4 right-4 z-50 w-96"
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-grow">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                🚀 New Version v0.1.2 Beta 2 Available!
              </h2>
              <p className="text-sm mb-3">
                This update includes performance improvements, new features, and bug fixes. Please refresh the page to update to the latest version and enjoy the enhanced experience.
              </p>
              <ul className="text-sm list-disc pl-5 space-y-2">
                <li className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-400" />
                  Improved UI for a better user experience
                </li>
                <li className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-yellow-400" />
                  Added real-time notifications
                </li>
                <li className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-2 text-purple-400" />
                  Admin Panel Updated
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-red-400" />
                  Enhanced security measures
                </li>
                <li className="flex items-center">
                  <Bug className="h-4 w-4 mr-2 text-orange-400" />
                  Bug fixes and performance optimizations
                </li>
                <li className="flex items-center">
                  <RefreshCcw className="h-4 w-4 mr-2 text-green-400" />
                  Seamless update process
                </li>
              </ul>
            </div>
            <button onClick={closeMessage} className="text-white hover:text-gray-300 ml-4">
              <XCircle className="fill-current h-6 w-6" />
            </button>
          </div>
        </motion.div>
      )}

      <AttendanceForm />
    </div>
  )
}