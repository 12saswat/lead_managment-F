'use client'

import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.replace('/worker/auth/login')
  }

  return (
    <main className="min-h-screen p-8 bg-slate-100 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          Logout
        </button>
      </div>

      <p className="text-lg text-gray-600">
        You’re now logged in. Here's where you can manage your activity.
      </p>
    </main>
  )
}
