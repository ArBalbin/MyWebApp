"use client";
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
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

  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}