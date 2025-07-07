'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from "next/image"
import { Briefcase, ClipboardList, Users, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        <Link href="/">
          <Image src="/vercel.svg" alt="logo" width={20} height={20} />
        </Link>
        <div className="flex gap-4">
          <Link href="/worker/auth/login">
            <Button variant="outline">Worker Login</Button>
          </Link>
          <Link href="/manager/auth/login">
            <Button>Manager Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className={`text-5xl md:text-6xl font-extrabold mb-6 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Streamline Your Lead Management
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Assign, manage, and track leads efficiently with clear deadlines. Empower your team with our smart dashboard for Managers and Workers.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/manager/auth/login">
            <Button size="lg">Manager Dashboard</Button>
          </Link>
          <Link href="/worker/auth/login">
            <Button variant="outline" size="lg">Worker's Portal</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Platform Features</h2>
          <p className="text-gray-600 mt-2">Everything you need to manage your leads and workflows</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<ClipboardList className="w-10 h-10 text-blue-600" />}
            title="Lead Assignment"
            description="Assign leads to workers and track progress effortlessly with deadline visibility."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-purple-600" />}
            title="Role-Based Access"
            description="Separate portals and dashboards for Managers and Workers with tailored functionality."
          />
          <FeatureCard
            icon={<CheckCircle className="w-10 h-10 text-green-600" />}
            title="Progress Tracking"
            description="Monitor lead status, follow-ups, and completions in real-time."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-16">
        <p className="text-sm">&copy; {new Date().getFullYear()} INDIBUS Software Solution Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-gray-50 rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};
