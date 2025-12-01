"use client";

import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-gray-900/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MyInventorySystem
            </h1>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/login')}
                className="text-white hover:bg-white/10"
              >
                Login
              </Button>

              <Button 
                onClick={() => router.push('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            MyInventorySystem
          </span>
        </h1>

 <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
  Welcome to my WebApp — built with TailwindCSS, ShadCN UI, and NestJS for my Application Development and Emerging Technologies subject. 
  This project reflects my growing skills in modern web development and clean, scalable design.
</p>

        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => router.push('/register')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
          >
            Get Started 
          </Button>

          <Button
  size="lg"
  onClick={() => router.push('/login')}
  className="text-lg px-8 border border-white/20 text-gray-200 hover:bg-white/10 hover:border-white/40"
>
  Sign In
</Button>
        </div>
      </div>

      {/* Built With Section */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tailwind */}
        <div className="bg-gray-900/60 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl transition border border-white/10">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M12 6c-2.5-3-7-3-9 1 1 4 4 5 6 4 1.5-1 2-4 3-5 1-1 4-2 6 1 1 4-2 6-4 5-1.5-1-2-4-3-6z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Tailwind CSS</h3>
          <p className="text-gray-400">
            Utility-first CSS for fast, responsive design with full dark mode support.
          </p>
        </div>

        {/* ShadCN */}
        <div className="bg-gray-900/60 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl transition border border-white/10">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M12 3l8 4-8 4-8-4 8-4zM4 10l8 4 8-4M4 17l8 4 8-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">ShadCN UI</h3>
          <p className="text-gray-400">
            Beautiful, modern components that blend perfectly with dark themes.
          </p>
        </div>

        {/* NestJS */}
        <div className="bg-gray-900/60 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl transition border border-white/10">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M12 3c4 2 7 6 7 10s-3 8-7 8-7-4-7-8 3-8 7-10z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">NestJS</h3>
          <p className="text-gray-400">
            Enterprise-grade backend framework built with TypeScript.
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2025 MyApp. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
