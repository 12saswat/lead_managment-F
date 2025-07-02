'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WorkerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
     const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/worker/auth/login')
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) return null
  
  return <>{children}</>
}
