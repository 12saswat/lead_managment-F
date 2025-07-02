'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

interface LoginData {
  email: string
  password: string
}

export default function WorkerLogin() {
  const { register, handleSubmit } = useForm<LoginData>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      formRef.current?.classList.remove('translate-y-10', 'opacity-0')
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const onSubmit = async (data: LoginData) => {
    if (!data.email || !data.password) {
      toast.error('Email and Password are required')
      return
    }

    setIsLoading(true)
   try {
  const res = await axios.post('http://localhost:8080/api/v1/worker/login', data,{
  withCredentials: true,
})

  toast.success('Login successful!')
  setTimeout(() => {
    router.push('/worker/dashboard')
  }, 1500)

} catch (err: any) {
  const msg = err.response?.data?.message || 'Login failed'
  toast.error(msg)
 } finally {
   setIsLoading(false)
 }
 }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-gray-900">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 bg-blue-600 p-8 flex-col justify-center">
        <div className="max-w-xl mb-32 ml-22">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Welcome Back to Your Worker Hub
          </h2>
          <p className="text-white/90 text-base">
            Manage your workflow, stay organized, and access your dashboard securely.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-indigo-100">
        <div className="flex flex-col lg:flex-row justify-center items-center w-full max-w-4xl gap-6">
          <div className="lg:hidden text-center">
            <h2 className="text-2xl font-bold text-blue-600">
              Welcome Back to Your Worker Hub
            </h2>
            <p className="text-sm text-gray-600">
              Manage your workflow, stay organized, and access your dashboard securely.
            </p>
          </div>

          <div
            ref={formRef}
            className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-100/50 transform transition-all duration-700 translate-y-10 opacity-0"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Worker Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 h-12 rounded-lg"
                  {...register('email')}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-12 rounded-lg"
                  {...register('password')}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar pauseOnHover />
    </div>
  )
}
