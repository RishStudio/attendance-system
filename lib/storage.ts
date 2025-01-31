interface Attendance {
  role: string
  prefectNumber: string
  timestamp: string
}

export function saveAttendance(attendance: Attendance) {
  const storedAttendance = JSON.parse(localStorage.getItem("attendance") || "[]")
  storedAttendance.push(attendance)
  localStorage.setItem("attendance", JSON.stringify(storedAttendance))
}

export function getAttendance(): Attendance[] {
  return JSON.parse(localStorage.getItem("attendance") || "[]")
}

export function cleanupOldData() {
  const storedAttendance = getAttendance()
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const filteredAttendance = storedAttendance.filter((a: Attendance) => new Date(a.timestamp) > fourteenDaysAgo)

  localStorage.setItem("attendance", JSON.stringify(filteredAttendance))

  // Create a backup every 7 days
  const lastBackup = localStorage.getItem("lastBackup")
  const today = new Date().toISOString().split("T")[0]
  if (!lastBackup || new Date(lastBackup) < new Date(today)) {
    localStorage.setItem("attendanceBackup", JSON.stringify(filteredAttendance))
    localStorage.setItem("lastBackup", today)
  }
}

export function clearAttendance() {
  localStorage.removeItem("attendance")
  localStorage.removeItem("lastBackup")
}