"use client"
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, User, Lock, Image as ImageIcon } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormData = {
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  password: string
}

export default function WorkerRegister() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!data.email || !data.password) {
      toast.error('Email and Password are required')
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        toast.error(result.message || 'Registration failed')
        return
      }

      toast.success('Registration successful!')
      reset()
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Register as Worker</h2>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Email" {...register('email')} />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="First Name" {...register('firstName')} />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Last Name" {...register('lastName')} />
            </div>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Avatar URL" {...register('avatar')} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" className="pl-10" placeholder="Password" {...register('password')} />
            </div>

            <Button className="w-full" type="submit">Register</Button>
          </form>
        </CardContent>
      </Card>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar pauseOnHover />
    </div>
  )
}
