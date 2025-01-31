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
            At Prefect Board, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information.
          </p>
          <p className="text-gray-700 text-base mb-4">
            We collect information that you provide to us directly, such as when you create an account, mark your attendance, or communicate with us. We also automatically collect certain information about your device and usage of our services.
          </p>
          <p className="text-gray-700 text-base mb-4">
            We use your information to provide and improve our services, communicate with you, and for security purposes. We do not share your personal information with third parties except as necessary to provide our services or as required by law.
          </p>
          <p className="text-gray-700 text-base">
            By using our services, you consent to the collection and use of your information as described in this Privacy Policy. If you have any questions or concerns, please contact us.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TermsOfService() {
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
            Welcome to Prefect Board. By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
          <p className="text-gray-700 text-base mb-4">
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.
          </p>
          <p className="text-gray-700 text-base mb-4">
            We reserve the right to modify or terminate our services for any reason, without notice, at any time. We also reserve the right to refuse service to anyone for any reason at any time.
          </p>
          <p className="text-gray-700 text-base">
            By using our services, you agree not to engage in any unlawful or prohibited activities. You also agree to comply with all applicable laws and regulations.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}