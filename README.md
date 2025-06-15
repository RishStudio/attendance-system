# 🎓 MRCM - Prefect Board Attendance System v2.1

An advanced web-based attendance management system built for the **Mahinda Rajapaksha College Prefect Board**. This system allows prefects to manage attendance efficiently using **QR Code Scanning**, with data stored securely in **local storage** and **Supabase cloud sync**, and includes a powerful **Admin Dashboard** with real-time analytics.

## 🌐 Live App

🔗 [Try it here](https://sys.imrishmika.site)

---

## 🚀 Features

- 📲 **QR Code Scanning** for instant attendance marking
- 🧠 **Smart Local Storage** system – no need for a backend
- ☁️ **Supabase Cloud Sync** for data backup and synchronization
- 📊 **Admin Dashboard** with real-time attendance analytics
- 👤 Role-based system: Prefects and Admin
- 💡 Minimal, fast, and user-friendly interface
- 📱 Fully responsive on desktop, tablet, and mobile
- ✅ Get full attendance report of the specific user
- 🔄 **Manual & Auto Sync** with cloud database
- 🔐 **Encrypted Backups** with AES-256 security
- 📈 **Advanced Analytics** with interactive charts

---

## 🛠️ Built With

- **Frontend**: Next.js, React, Tailwind CSS
- **State Management**: Local Storage + Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Simple local-based login + Supabase RLS
- **QR Scanning**: JavaScript-based QR scanner
- **Deployment**: Vercel

---

## ⚙️ Getting Started (For Developers)

1. **Clone the repo**:

```bash
git clone https://github.com/RishBroProMax/attendance-system-v2.git
cd attendance-system-v2
```

2. **Install dependencies**:

```bash
npm install --force
```

3. **Set up Supabase**:
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_QR_SECRET=your_qr_secret_key
```

4. **Run database migrations**:
   - Use the SQL file in `supabase/migrations/001_create_attendance_tables.sql`
   - Run it in your Supabase SQL editor

5. **Start development server**:

```bash
npm run dev
```

6. Open `http://localhost:3000` in your browser 🚀

---

## 📊 Admin Dashboard

* View total attendance stats
* Analyze attendance per day, week, or month
* Export local data if needed (manual backup option)
* Secure admin login with dashboard access
* Export to CSV file
* **Cloud sync management** with Supabase
* **Backup history** and version control

---

## ☁️ Cloud Sync Features

* **Manual Sync**: Upload/download data to/from Supabase on demand
* **Auto Sync**: Automatic background synchronization every 5 minutes
* **Encrypted Backups**: Secure data encryption for all backups
* **Version Control**: Track backup history and metadata
* **Device Management**: Multi-device support with unique device IDs
* **Conflict Resolution**: Smart handling of data conflicts

---

## 🔐 Authentication

* Prefects login locally using credentials
* Admin has a separate login for full access
* Auth data saved in browser storage
* **Supabase RLS** for cloud data security

---

## 📸 QR Attendance ( Beta V0.9 )

* Each student gets a unique QR code
* Admin or Prefect can scan the code using a webcam/mobile camera
* System auto-marks attendance in local records
* **Cloud sync** for QR attendance data

---

## 💡 Why Hybrid Storage?

* ⚡ **Local Storage**: Super fast and lightweight, works offline
* ☁️ **Cloud Sync**: Data backup, multi-device access, team collaboration
* 🔒 **Security**: Data stays on device by default, cloud sync is optional
* 📤 **Flexibility**: Easy to export manually or sync automatically
* 🧩 **Reliability**: Works even when offline, syncs when online

---

## 🧩 Future Improvements

* ✅ Enhanced cloud backend features
* ✅ Face recognition module (AI-based)
* ✅ Enhanced security/auth layer
* ✅ Google Sheet integration
* ✅ Moderator roles (Developer, Admin, Attendance Marker)
* ✅ Real-time collaboration features
* ✅ Mobile app development

---

## 🏫 Made For

> **Mahinda Rajapaksha College - Prefect Board** <br>
> Developed with ❤️ by [@RishBroProMax](https://github.com/RishBroProMax)

---

## 💼 Hire Me

I specialize in building full-stack, high-performance web applications tailored for schools, startups, and custom use cases.

📬 Reach out:

* Email: `contact@imrishmika.site`
* Portfolio: [imrishmika.site](https://imrishmika.site)
* GitHub: [@RishBroProMax](https://github.com/RishBroProMax)

Let's build something great together!

## 📄 License

MIT License. Feel free to use, improve, or fork this project.

---