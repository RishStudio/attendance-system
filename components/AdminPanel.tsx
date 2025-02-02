"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getAttendance, cleanupOldData, clearAttendance } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { Download, Clock, BarChart2, Trash2, AlertCircle, CheckCircle, Search, Code, Crown } from "lucide-react"
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'

export default function AdminPanel() {
  const [lateArrivals, setLateArrivals] = useState<Array<{ role: string; prefectNumber: string; timestamp: string }>>([])
  const [earlyArrivals, setEarlyArrivals] = useState<Array<{ role: string; prefectNumber: string; timestamp: string }>>([])
  const [attendanceStats, setAttendanceStats] = useState<Array<{ role: string; prefectNumber: string; timestamp: string }>>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterDate, setFilterDate] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    cleanupOldData()
    updateAttendanceStats()
  }, [])

  const updateAttendanceStats = () => {
    const attendance = getAttendance()
    setAttendanceStats(attendance)
  }

  const exportAttendance = () => {
    const attendance = getAttendance()
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Role,Prefect Number,Timestamp,Date,Time,Status\n" +
      attendance.map((a) => {
        const arrivalTime = new Date(a.timestamp)
        const date = arrivalTime.toLocaleDateString()
        const time = arrivalTime.toLocaleTimeString()
        const status = arrivalTime.getHours() >= 7 && arrivalTime.getMinutes() > 0 ? "Late" : "Early"
        return `${a.role},${a.prefectNumber},${a.timestamp},${date},${time},${status}`
      }).join("\n") +
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

  const showArrivals = () => {
    const attendance = getAttendance()
    const late = attendance.filter((a) => {
      const arrivalTime = new Date(a.timestamp)
      return arrivalTime.getHours() >= 7 && arrivalTime.getMinutes() > 0
    })
    const early = attendance.filter((a) => {
      const arrivalTime = new Date(a.timestamp)
      return arrivalTime.getHours() < 7 || (arrivalTime.getHours() === 7 && arrivalTime.getMinutes() === 0)
    })
    setLateArrivals(late)
    setEarlyArrivals(early)
  }

  const clearAllAttendance = () => {
    if (window.confirm("Are you sure you want to delete all attendance data? This action cannot be undone.")) {
      clearAttendance()
      updateAttendanceStats()
      setLateArrivals([])
      setEarlyArrivals([])
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

  const filteredAttendance = attendanceStats.filter((a) => {
    const matchesSearchTerm = searchTerm === "" || a.prefectNumber.includes(searchTerm)
    const matchesFilterDate = filterDate === "" || new Date(a.timestamp).toISOString().split("T")[0] === filterDate
    return matchesSearchTerm && matchesFilterDate
  })

  const attendanceChartData = {
    labels: ["Early Arrivals", "Late Arrivals"],
    datasets: [
      {
        label: "Count",
        data: [earlyArrivals.length, lateArrivals.length],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-white rounded-t-lg p-4">
          <CardTitle className="text-2xl font-bold text-center">Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <Button onClick={exportAttendance} className="btn-primary flex items-center justify-center w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Attendance
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input placeholder="Search by Prefect Number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            <Button onClick={showArrivals} className="btn-primary flex items-center justify-center w-full md:w-auto">
              <Clock className="mr-2 h-4 w-4" />
              Show Arrivals
            </Button>
          </div>
          <Button onClick={clearAllAttendance} className="w-full bg-red-500 text-white py-2 rounded-md shadow-sm hover:bg-red-600 flex items-center justify-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Attendance
          </Button>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Attendance Statistics
            </h3>
            <Bar data={attendanceChartData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredAttendance.map((a, index) => {
                const arrivalTime = new Date(a.timestamp)
                const isLate = arrivalTime.getHours() >= 7 && arrivalTime.getMinutes() > 0
                const isDeveloper = a.role === "Sub Prefect" && a.prefectNumber === "64"
                const isHeadPrefect1 = a.role === "Head Prefect 1"
                const isHeadPrefect2 = a.role === "Head Prefect 2"
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                    onClick={() => isDeveloper && toast({
                      title: "Special Attendance",
                      description: "The Visionary Behind the Attendance System, Rishmika Sandanu, has officially marked their presence—ensuring seamless functionality, innovation, and excellence.",
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      {isLate ? <AlertCircle className="text-red-600" /> : <CheckCircle className="text-green-600" />}
                      <span className="text-gray-700 flex items-center">
                        {a.role} - {a.prefectNumber}
                        {isDeveloper && <Code className="ml-2 h-4 w-4 text-blue-600" />}
                        {isHeadPrefect1 && <Crown className="ml-2 h-4 w-4 text-yellow-500" />}
                        {isHeadPrefect2 && <Crown className="ml-2 h-4 w-4 text-pink-500" />}
                      </span>
                    </div>
                    <span className="text-black">{arrivalTime.toLocaleString()}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <AnimatePresence>
            {earlyArrivals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Early Arrivals
                </h3>
                <ul className="space-y-2">
                  {earlyArrivals.map((a, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-100 p-2 rounded flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="text-green-600" />
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
                  <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
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
                          {a.role === "Sub Prefect" && a.prefectNumber === "64" && (
                            <>
                              <Code className="ml-2 h-4 w-4 text-blue-600" />
                              <span className="ml-2 text-blue-600">(Developer)</span>
                            </>
                          )}
                          {a.role === "Head Prefect 1" && (
                            <>
                              <Crown className="ml-2 h-4 w-4 text-yellow-500" />
                              <span className="ml-2 text-yellow-500">(Rashan Meranga)</span>
                            </>
                          )}
                          {a.role === "Head Prefect 2" && (
                            <>
                              <Crown className="ml-2 h-4 w-4 text-pink-500" />
                              <span className="ml-2 text-pink-500">(Kavishma)</span>
                            </>
                          )}
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