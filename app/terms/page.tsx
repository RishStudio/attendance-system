"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfService() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-8"
    >
      <Card className="card">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 text-base mb-4">
          Welcome to the **Mahinda Rajapaksha College Matara Prefect Board Attendance Marking System**. By using this system, you agree to follow these Terms of Service. If you do not agree, please refrain from using the system.
          </p>
          <p className="text-gray-700 text-base mb-4">
          You are responsible for keeping your account credentials secure and restricting unauthorized access. Any activity under your account will be considered your responsibility. 
          </p>
          <p className="text-gray-700 text-base mb-4">
          We reserve the right to update, modify, or discontinue this service at any time without prior notice. Additionally, we may restrict or deny access to any user if deemed necessary. 
          </p>
          <p className="text-gray-700 text-base">
          By using this system, you agree to use it responsibly and comply with all school rules and regulations. Any misuse, unauthorized access, or violation of applicable policies may result in disciplinary action.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}