"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Briefcase, Loader2, Shield, Users } from "lucide-react";
import { toast } from 'sonner';
import Axios from "@/lib/Axios";

export default function ManagerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingShapesRef = useRef<HTMLDivElement>(null);

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = "1";
        containerRef.current.style.transform = "translateY(0)";
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      
      const response = await Axios.post("/manager/login",{ email, password });

      const data = await response.data;
      console.log("This is the data>>",data)
      if (data.success) {
        
        // Simulate successful login
        toast('Login successful! Redirecting to dashboard...');
        // Fix Me : Route is static here we need to write dynamic route.
        window.location.replace("/leads/upload-leads/12");
        // router.push('/leads/upload-leads/12');
      } else {
        toast("Login failed: " + (data.msg || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast("Login error ddd: Something went wrong. Please try again."+error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-42 h-42 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-50 h-50 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-34 h-34 bg-purple-200/20 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none" ref={floatingShapesRef}>
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400/40 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-40 w-6 h-6 bg-indigo-400/40 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-32 right-32 w-5 h-5 bg-purple-400/40 rotate-12 animate-pulse delay-700"></div>
      </div>

      {/* Main Container */}
      <div 
        className="container mx-auto min-h-screen flex items-center justify-center p-4 lg:p-8"
        ref={containerRef}
        style={{ 
          opacity: 0, 
          transform: 'translateY(20px)', 
          transition: 'all 0.8s ease-out' 
        }}
      >
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section - Brand & Features */}
          <div className="space-y-8 text-center lg:text-left order-1 lg:order-1">
            {/* Brand Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ClientSync Pro
                  </h2>
                  <p className="text-sm text-gray-500">Manager Portal</p>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Welcome to Your
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Management Hub
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0 hidden md:block">
                Streamline client relationships, manage resources efficiently, and drive your team's success.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 hidden lg:grid">
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Client Management</h3>
                    <p className="text-sm text-gray-600">Comprehensive client tracking and resource allocation</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
                    <p className="text-sm text-gray-600">Enterprise-grade security for your sensitive data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full max-w-md mx-auto order-2 lg:order-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Manager Login
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Enter your credentials to access the management portal
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Work Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        type="email"
                        placeholder="manager@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  
                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      "Access Manager Portal"
                    )}
                  </Button>
                </form>
                
                {/* Support Link */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600">
                    Need assistance?{" "}
                    <button className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      Contact Support
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}