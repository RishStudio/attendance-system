"use client"

import { useState, useEffect } from "react"
import AttendanceForm from "@/components/AttendanceForm"
import { motion } from "framer-motion"
import { XCircle } from "lucide-react"

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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border border-blue-700 text-white px-4 py-5 rounded-lg shadow-lg relative mb-4"
          role="alert"
        >
          <div className="flex items-center">
            <div className="flex-grow">
              <h2 className="text-lg font-bold mb-1">🚀 New Version v0.1.2 Beta 2 Available!</h2>
              <p className="text-sm mb-2">
                This update includes performance improvements, new features, and bug fixes. Please refresh the page to update to the latest version and enjoy the enhanced experience.
              </p>
              <ul className="text-sm list-disc pl-5">
                <li>Improved UI for better user experience</li>
                <li>Added real-time notifications</li>
                <li>Enhanced security measures</li>
                <li>Bug fixes and performance optimizations</li>
              </ul>
            </div>
            <button onClick={closeMessage} className="text-white hover:text-gray-300">
              <XCircle className="fill-current h-6 w-6" />
            </button>
          </div>
        </motion.div>
      )}
      
      <AttendanceForm />
    </div>
  )
}