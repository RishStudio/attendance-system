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
            Welcome to the <strong>Mahinda Rajapaksha College Matara Prefect Board Attendance Marking System</strong>. By accessing and using this system, you agree to comply with the following Terms of Service. If you do not agree with these terms, please refrain from using the system.
          </p>
          
          <p className="text-gray-700 text-base mb-4">
            <strong>1. Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please take appropriate measures to prevent unauthorized access to your account.
          </p>
          
          <p className="text-gray-700 text-base mb-4">
            <strong>2. Acceptable Use:</strong> You agree to use the system responsibly and in compliance with all school rules, regulations, and policies. Any misuse, unauthorized access, or violation of applicable policies may result in disciplinary action, including suspension or termination of your access to the system.
          </p>
          
          <p className="text-gray-700 text-base mb-4">
            <strong>3. Service Modifications:</strong> We reserve the right to update, modify, or discontinue the service at any time without prior notice. We may also restrict or deny access to any user if deemed necessary.
          </p>
          
          <p className="text-gray-700 text-base mb-4">
            <strong>4. Data Privacy:</strong> We are committed to protecting your privacy. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data.
          </p>
          
          <p className="text-gray-700 text-base mb-4">
            <strong>5. Limitation of Liability:</strong> We are not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the system. This includes any loss of data or interruption of service.
          </p>
          
          <p className="text-gray-700 text-base">
            By using this system, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you have any questions or concerns, please contact the Prefect Board administration.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}