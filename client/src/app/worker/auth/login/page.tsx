'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Lock } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type LoginData = {
  email: string
  password: string
}

export default function WorkerLogin() {
  const { register, handleSubmit, reset } = useForm<LoginData>()
  const router = useRouter()

  const onSubmit = async (data: LoginData) => {
    if (!data.email || !data.password) {
      toast.error('Email and Password are required')
      return
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const result = await res.json()
        toast.error(result.message || 'Login failed')
        return
      }

      toast.success('Login successful!')
    //   reset()
    //   setTimeout(() => {
    //     router.push('/dashboard')
    //   }, 1500)
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Worker Login</h2>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Email" {...register('email')} />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" className="pl-10" placeholder="Password" {...register('password')} />
            </div>

            <Button className="w-full" type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar pauseOnHover />
    </div>
  )
}
