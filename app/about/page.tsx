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
            Welcome to the <strong>Mahinda Rajapaksha College Matara Prefect Board Attendance System</strong>. Developed by <strong>Rish Studio</strong>, our platform is designed to streamline the attendance tracking process for our school.
          </p>
          <p className="text-gray-700 text-base mb-4">
            Utilizing modern technologies like Next.js and a robust local database, our system ensures fast, secure, and efficient attendance management. Whether you're marking attendance, viewing detailed records, or generating insightful reports, our system makes these tasks effortless and reliable.
          </p>
          <p className="text-gray-700 text-base mb-4">
            <strong>Key Features:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Easy attendance marking with a user-friendly interface.</li>
            <li>Detailed records and reporting capabilities.</li>
            <li>Secure data storage with no reliance on external servers.</li>
            <li>Real-time updates and notifications.</li>
          </ul>
          <p className="text-gray-700 text-base">
            At <strong>Rish Studio</strong>, we are committed to enhancing the educational experience by providing intuitive and reliable tools. Your feedback and support are invaluable as we continue to improve and offer the best service possible for the Mahinda Rajapaksha College community.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}