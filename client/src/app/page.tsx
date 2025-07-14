'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image"
import { Briefcase, ClipboardList, Users, CheckCircle, ArrowRight, BarChart2, ShieldCheck, Clock, Calendar, MessageSquare, Settings, Mail } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // GSAP animations
  useGSAP(() => {
    // Hero section animations
    gsap.from('.hero-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    });
    
    gsap.from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5
    });
    
    gsap.from('.hero-buttons', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.8
    });

    // Features animations
    gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: "back.out"
      });
    });

    // Stats animations
    gsap.from('.stat-item', {
      scrollTrigger: {
        trigger: '.stats-section',
        start: "top 75%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out"
    });

    // CTA animation
    gsap.from('.cta-section', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: "top 75%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

  }, { scope: container });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900" ref={container}>

      {/* Navbar */}
      <nav className="px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/Indibus.jpg" 
              alt="Indibus Logo" 
              width={40} 
              height={40} 
              className='rounded-2xl'
            />
            <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Indibus LeadPro
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/worker/auth/login">
              <Button variant="outline" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Worker Login
              </Button>
            </Link>
            <Link href="/manager/auth/login">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <ClipboardList className="w-4 h-4" />
                Manager Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-28 px-6 text-center max-w-6xl mx-auto">
        <div className="hero-title">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
            Transform Your <span className="text-blue-600">Lead Management</span>
          </h1>
        </div>
        <div className="hero-subtitle">
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced lead distribution, real-time tracking, and performance analytics in one powerful platform. 
            Boost your team's productivity and conversion rates with intelligent automation.
          </p>
        </div>
        <div className="hero-buttons flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/manager/auth/login">
            <Button size="lg" className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="gap-2 px-8 py-6 text-lg border-2 border-gray-300 hover:border-blue-500">
              Explore Features
            </Button>
          </Link>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="mt-16 rounded-xl bg-white p-4 shadow-xl border border-gray-100 max-w-4xl mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <Image 
              src="/crm.webp" 
              alt="Dashboard Preview" 
              width={1200} 
              height={600} 
              className="rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item p-6 bg-blue-50 rounded-xl">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">95%</h3>
              <p className="text-gray-600">Faster Lead Assignment</p>
            </div>
            <div className="stat-item p-6 bg-indigo-50 rounded-xl">
              <h3 className="text-4xl font-bold text-indigo-600 mb-2">3x</h3>
              <p className="text-gray-600">Conversion Increase</p>
            </div>
            <div className="stat-item p-6 bg-purple-50 rounded-xl">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">24/7</h3>
              <p className="text-gray-600">Real-time Monitoring</p>
            </div>
            <div className="stat-item p-6 bg-green-50 rounded-xl">
              <h3 className="text-4xl font-bold text-green-600 mb-2">10k+</h3>
              <p className="text-gray-600">Leads Managed Daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Your Sales Team</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to streamline your lead management process and maximize conversions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={<ClipboardList className="w-10 h-10 text-blue-600" />}
            title="Smart Lead Distribution"
            description="Automatically assign leads based on availability, skills, and performance metrics for optimal results."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-purple-600" />}
            title="Role-Based Dashboards"
            description="Custom interfaces for managers and workers with only relevant information and actions."
          />
          <FeatureCard
            icon={<CheckCircle className="w-10 h-10 text-green-600" />}
            title="Progress Tracking"
            description="Monitor lead status, follow-ups, and completions with visual indicators and notifications."
          />
          <FeatureCard
            icon={<BarChart2 className="w-10 h-10 text-orange-600" />}
            title="Performance Analytics"
            description="Detailed reports on conversion rates, response times, and team productivity."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-10 h-10 text-red-600" />}
            title="Data Security"
            description="Enterprise-grade security with encryption and role-based access controls."
          />
          <FeatureCard
            icon={<Clock className="w-10 h-10 text-yellow-600" />}
            title="Real-time Updates"
            description="Instant notifications and activity streams keep everyone informed of changes."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Indibus LeadPro Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to transform your lead management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={<Mail className="w-8 h-8" />}
              title="Capture Leads"
              description="Import leads from multiple sources or enter them manually into the system."
            />
            <StepCard
              number="2"
              icon={<Settings className="w-8 h-8" />}
              title="Automate Distribution"
              description="Our algorithm assigns leads to the most appropriate team member instantly."
            />
            <StepCard
              number="3"
              icon={<Calendar className="w-8 h-8" />}
              title="Track & Convert"
              description="Monitor progress, set follow-ups, and close more deals efficiently."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Lead Management?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that have increased their conversion rates and team productivity with Indibus LeadPro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/manager/auth/register">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="gap-2 px-8 py-6 text-lg border-2 border-white text-white hover:bg-white/10">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Indibus LeadPro</h3>
            <p className="mb-4">
              The most powerful lead management platform for modern sales teams.
            </p>
            <div className="flex gap-4">
              {/* Social icons would go here */}
            </div>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} INDIBUS Software Solution Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="feature-card bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100">
      <div className="flex justify-center mb-5">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

const StepCard = ({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-4 font-bold text-lg">
          {number}
        </div>
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};