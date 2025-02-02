"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check, User, ClipboardCheck, Trash2, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveAttendance } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import type { Engine } from "tsparticles-engine"

const roles = [
  "Head Prefect",
  "Deputy Prefect",
  "Senior Executive Prefect",
  "Executive Prefect",
  "Super Senior Prefect",
  "Senior Prefect",
  "Junior Prefect",
  "Sub Prefect",
  "Apprentice Prefect",
]

export default function AttendanceForm() {
  const [role, setRole] = useState<string>("")
  const [prefectNumber, setPrefectNumber] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
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
      clearForm()
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been recorded successfully.",
      })
    }
  }

  const clearForm = () => {
    setRole("")
    setPrefectNumber("")
  }

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setIsDropdownOpen(false)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const particlesInit = async (main: Engine) => {
    await loadFull(main);
  }

  useEffect(() => {
    if (prefectNumber.length === 1 && /^[1-9]$/.test(prefectNumber)) {
      setPrefectNumber(`0${prefectNumber}`);
    }
  }, [prefectNumber]);

  return (
    <div className={`relative w-full ${isFullScreen ? "fixed inset-0 z-50 flex items-center justify-center bg-black" : "max-w-md mx-auto p-4"}`}>
      {isFullScreen && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "#000",
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                bubble: {
                  distance: 400,
                  duration: 2,
                  opacity: 0.8,
                  size: 40,
                },
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                directions: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
      <button
        onClick={toggleFullScreen}
        className={`fixed top-4 right-4 p-2 rounded-full bg-primary text-white shadow-md z-50 ${isFullScreen ? "hover:bg-primary-dark" : "hover:bg-primary-light"}`}
      >
        {isFullScreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white rounded-t-lg p-4">
            <CardTitle className="text-2xl font-bold text-center">Mark Your Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-500" /> Select your role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full text-left flex items-center justify-between bg-gray-100 border border-gray-300 rounded-md shadow-sm px-4 py-2"
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
                            onClick={() => handleRoleSelect(r)}
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
                <label htmlFor="prefectNumber" className="text-sm font-medium text-gray-700 flex items-center">
                  <ClipboardCheck className="mr-2 h-5 w-5 text-gray-500" /> Prefect number
                </label>
                <Input
                  id="prefectNumber"
                  type="text"
                  placeholder="Enter your prefect number"
                  value={prefectNumber}
                  onChange={(e) => setPrefectNumber(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="w-full bg-primary text-white py-2 rounded-md shadow-sm hover:bg-primary-dark flex items-center justify-center">
                  <ClipboardCheck className="mr-2 h-5 w-5" />
                  Mark Attendance
                </Button>
                <Button type="button" onClick={clearForm} className="w-full bg-gray-500 text-white py-2 rounded-md shadow-sm hover:bg-gray-600 flex items-center justify-center">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}