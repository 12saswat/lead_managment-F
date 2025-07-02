'use client'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showMission, setShowMission] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 300);
    const timer2 = setTimeout(() => setShowTagline(true), 1500);
    const timer3 = setTimeout(() => setShowMission(true), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
     
      
      <div className="relative z-10 text-center px-8 max-w-6xl">
        
        {/* Main INDIBUS Logo */}
        <div className={`transition-all duration-2000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h1 
            className="text-8xl md:text-9xl lg:text-[12rem] font-bold mb-8 tracking-wider select-none"
            style={{
              textShadow: `
                0 1px 0 #ccc,
                0 2px 0 #c9c9c9,
                0 3px 0 #bbb,
                0 4px 0 #b9b9b9,
                0 5px 0 #aaa,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 10px rgba(0,0,0,.2),
                0 20px 20px rgba(0,0,0,.15)
              `
            }}
          >
            <Link href="/manager/auth/login"><Button>Login</Button></Link>
          </h1>
        </div>
      </div>
    </div>
  );
}