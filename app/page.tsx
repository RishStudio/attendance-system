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
          transition={{ duration: 0.5 }}
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">New Version v0.1.2 Beta 2 Available!</strong>
          <span className="block sm:inline"> Please refresh the page to update to the latest version.</span>
          <button onClick={closeMessage} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <XCircle className="fill-current h-6 w-6 text-blue-700" />
          </button>
        </motion.div>
      )}
      
      <AttendanceForm />
    </div>
  )
}