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
            Welcome to Prefect Board! We aim to streamline the process of attendance tracking for school prefects, making it easier and more efficient for everyone involved.
          </p>
          <p className="text-gray-700 text-base mb-4">
            Our platform allows prefects to quickly mark their attendance, view attendance records, and generate reports. We believe in providing a seamless experience to ensure that attendance tracking is the least of your worries.
          </p>
          <p className="text-gray-700 text-base">
            Thank you for being a part of our community. Your support and feedback are invaluable to us as we continue to improve and provide the best service possible.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}