"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-8"
    >
      <Card className="card">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">About Us</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        <p className="text-gray-700 text-base mb-4">
  Welcome to the Attendance System, developed by <strong>Rish Studio</strong>! Built using Next.js and a local database, our platform offers a fast, secure, and efficient way to track attendance.
</p>
<p className="text-gray-700 text-base mb-4">
  With our system, users can effortlessly mark attendance, view detailed records, and generate insightful reports—all with just a few clicks. Designed for reliability, it ensures smooth operation without relying on external servers.
</p>
<p className="text-gray-700 text-base">
  At <strong>Rish Studio</strong>, we are committed to providing an intuitive, user-friendly experience. Your feedback and support are invaluable as we continue to improve and offer the best service possible.
</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}