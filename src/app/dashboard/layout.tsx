"use client";
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  function handleLogout() {
    removeToken();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                MyWebApp
              </h1>
              <nav className="hidden md:flex gap-6">
                <button className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                  Dashboard
                </button>
                <button className="text-gray-400 hover:text-blue-400 font-medium transition-colors">
               
                </button>
                <button className="text-gray-400 hover:text-blue-400 font-medium transition-colors">
        
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex text-gray-300 hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-auto bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            © 2025 MyApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
