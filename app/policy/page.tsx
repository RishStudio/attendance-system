"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-8"
    >
      <Card className="card">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 text-base mb-4">
            At Mahinda Rajapaksha College Prefect Board, we are dedicated to safeguarding your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information in relation to our Attendance System.
          </p>
          <p className="text-gray-700 text-base mb-4">
            <strong>Information Collection:</strong> We collect information that you provide directly, such as when you create an account, mark your attendance, or communicate with us. Additionally, we automatically collect certain information about your device and usage of our services.
          </p>
          <p className="text-gray-700 text-base mb-4">
            <strong>Use of Information:</strong> We use your information to provide and improve our services, communicate with you, and ensure the security of our system. We do not share your personal information with third parties, except as necessary to provide our services or as required by law.
          </p>
          <p className="text-gray-700 text-base mb-4">
            <strong>Data Security:</strong> We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p className="text-gray-700 text-base mb-4">
            <strong>Data Retention:</strong> We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p className="text-gray-700 text-base mb-4">
            <strong>Your Rights:</strong> You have the right to access, update, or delete your personal information. If you wish to exercise these rights or have any questions or concerns about our Privacy Policy, please contact us.
          </p>
          <p className="text-gray-700 text-base">
            By using our Attendance System, you consent to the collection and use of your information as described in this Privacy Policy. If you have any questions or concerns, please contact us at [contact email/phone number].
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}