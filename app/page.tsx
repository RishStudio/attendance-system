import AttendanceForm from "@/components/AttendanceForm"

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">School Prefect Board Attendance System</h1>
      <AttendanceForm />
    </div>
  )
}

