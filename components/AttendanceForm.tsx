"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveAttendance } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const roles = [
  "Head Prefect",
  "Deputy Prefect",
  "Senior Executive Prefect",
  "Executive PRefect ",
  "Super Senior Prefect",
  "Senior Prefect",
  "Junior Prefect",
  "Sub Prefect",
  "Apprentice Prefect",
]

export default function AttendanceForm() {
  const [role, setRole] = useState("")
  const [prefectNumber, setPrefectNumber] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (role && prefectNumber) {
      const attendance = {
        role,
        prefectNumber,
        timestamp: new Date().toISOString(),
      }
      saveAttendance(attendance)
      setRole("")
      setPrefectNumber("")
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been recorded successfully.",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="card">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Mark Your Attendance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                Select your role
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full input-field text-left flex items-center justify-between"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {role || "Select your role"}
                  <ChevronDown
                    className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {roles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-sm ${
                            role === r ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setRole(r)
                            setIsDropdownOpen(false)
                          }}
                        >
                          {r}
                          {role === r && <Check className="inline-block ml-2 h-4 w-4" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="prefectNumber" className="text-sm font-medium text-gray-700">
                Prefect number
              </label>
              <Input
                id="prefectNumber"
                type="text"
                placeholder="Enter your prefect number"
                value={prefectNumber}
                onChange={(e) => setPrefectNumber(e.target.value)}
                required
                className="input-field w-full"
              />
            </div>
            <Button type="submit" className="w-full btn-primary">
              Mark Attendance
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

