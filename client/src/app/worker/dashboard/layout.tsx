'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WorkerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)

  // useEffect(() => {
  //   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  //   if (!token) {
  //     router.replace('/worker/auth/login')
  //   } else {
  //     setIsAllowed(true)
  //   }
  // }, [router])

  if (isAllowed === null) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
    </div>
  )
}


  return <>{children}</>
}
