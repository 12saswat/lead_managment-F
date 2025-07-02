"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function WorkerSignUp() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      formRef.current?.classList.remove("translate-y-10", "opacity-0");
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/worker/register",
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Registered successfully!");
      reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-gray-900">
      {/* Text Section */}
      <div className="hidden lg:flex flex-1 bg-blue-600 p-8 flex-col justify-center">
        <div className="max-w-xl mb-16 ml-20">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Welcome to Your Worker Hub
          </h2>
          <p className="text-white/90 text-base">
            Streamline client relationships, manage resources efficiently, and
            drive your team's success.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-indigo-100">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl gap-12">
          <div className="lg:hidden text-center">
            <h2 className="text-2xl font-bold text-blue-600">
              Welcome to Your Worker Hub
            </h2>
            <p className="text-sm text-gray-600">
              Streamline client relationships, manage resources efficiently, and
              drive your team's success.
            </p>
          </div>

          <div
            ref={formRef}
            className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-100/50 transform transition-all duration-700 translate-y-10 opacity-0 lg:ml-32"
          >
            <h2 className="text-2xl font-bold mb-6 lg:mb-0 lg:text-left pb-4 ml-26">
              Worker Sign Up
            </h2>
            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              className="space-y-5"
            >
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="pl-10 h-12 rounded-lg"
                  {...register("name", { required: "Full name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="pl-10 h-12 rounded-lg"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-12 rounded-lg"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 h-12 rounded-lg"
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-right text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100/50"></div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 mt-3 space-y-1">
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/worker/auth/login"
                    className="text-indigo-600 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
                <p>
                  Need help?{" "}
                  <Link
                    href="/support"
                    className="text-indigo-600 hover:underline"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        pauseOnHover
      />
    </div>
  );
}
