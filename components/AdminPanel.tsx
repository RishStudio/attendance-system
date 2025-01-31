"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getAttendance, cleanupOldData, saveAttendance, clearAttendance } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, Clock, BarChart2, Trash2, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function AdminPanel() {
  const [lateArrivals, setLateArrivals] = useState<Array<{ role: string; prefectNumber: string; timestamp: string }>>([])
  const [attendanceStats, setAttendanceStats] = useState<{ [key: string]: number }>({})
  const { toast } = useToast()

  useEffect(() => {
    cleanupOldData()
    updateAttendanceStats()
  }, [])

  const updateAttendanceStats = () => {
    const attendance = getAttendance()
    const stats: { [key: string]: number } = {}
    attendance.forEach((a) => {
      stats[a.role] = (stats[a.role] || 0) + 1
    })
    setAttendanceStats(stats)
  }

  const exportAttendance = () => {
    const attendance = getAttendance()
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Role,Prefect Number,Timestamp\n" +
      attendance.map((a) => `${a.role},${a.prefectNumber},${new Date(a.timestamp).toLocaleString()}`).join("\n") +
      "\n\nPowered by Rish Studio ⚡"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `attendance_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Attendance Exported",
      description: "The attendance data has been exported successfully.",
    })
  }

  const importAttendance = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split("\n")
        lines.shift() // Remove header
        const importedAttendance = lines.map((line) => {
          const [role, prefectNumber, timestamp] = line.split(",")
          return { role, prefectNumber, timestamp }
        })
        importedAttendance.forEach(saveAttendance)
        updateAttendanceStats()
        toast({
          title: "Attendance Imported",
          description: `${importedAttendance.length} records have been imported successfully.`,
        })
      }
      reader.readAsText(file)
    }
  }

  const showLateArrivals = () => {
    const attendance = getAttendance()
    const late = attendance.filter((a) => {
      const arrivalTime = new Date(a.timestamp)
      return arrivalTime.getHours() >= 7 && arrivalTime.getMinutes() > 0
    })
    setLateArrivals(late)
  }

  const clearAllAttendance = () => {
    if (window.confirm("Are you sure you want to delete all attendance data? This action cannot be undone.")) {
      clearAttendance()
      updateAttendanceStats()
      setLateArrivals([])
      toast({
        title: "Attendance Cleared",
        description: "All attendance data has been deleted successfully.",
      })
    } else {
      toast({
        title: "Action Cancelled",
        description: "The attendance data has not been deleted.",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <Card className="card shadow-lg">
        <CardHeader className="bg-primary text-white rounded-t-lg p-4">
          <CardTitle className="text-2xl font-bold text-center">Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <Button onClick={exportAttendance} className="btn-primary flex items-center justify-center w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Attendance
            </Button>
            <Label htmlFor="import-attendance" className="w-full md:w-auto">
              <Button className="w-full md:w-auto btn-secondary flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                Import Attendance
              </Button>
              <Input id="import-attendance" type="file" accept=".csv" className="hidden" onChange={importAttendance} />
            </Label>
          </div>
          <Button onClick={showLateArrivals} className="w-full btn-primary flex items-center justify-center">
            <Clock className="mr-2 h-4 w-4" />
            Show Late Arrivals
          </Button>
          <Button onClick={clearAllAttendance} className="w-full bg-red-500 text-white py-2 rounded-md shadow-sm hover:bg-red-600 flex items-center justify-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Attendance
          </Button>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Attendance Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(attendanceStats).map(([role, count]) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded"
                >
                  <span className="text-gray-700">{role}:</span>
                  <span className="text-primary font-bold">{count}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {lateArrivals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Late Arrivals
                </h3>
                <ul className="space-y-2">
                  {lateArrivals.map((a, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-100 p-2 rounded flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="text-red-600" />
                        <span className="text-gray-700">
                          {a.role} - {a.prefectNumber}
                        </span>
                      </div>
                      <span className="text-black">{new Date(a.timestamp).toLocaleString()}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}