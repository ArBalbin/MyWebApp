"use client";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JwtPayload {
  sub: number; 
  username: string; 
  role: string; 
  exp: number; 
  iat: number;
}

export default function DashboardHome() {
  const [showToken, setShowToken] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [role, setRole] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const currentToken = getToken();
    if (!currentToken) return;

    const tokenParts = currentToken.split('.');
    if (tokenParts.length !== 3) {
      console.error("Invalid token format: token must have 3 parts");
      setToken(null);
      return;
    }

    setToken(currentToken);

    try {
      const decoded = jwtDecode<JwtPayload>(currentToken);
      if (decoded.username) setUsername(decoded.username);
      if (decoded.role) setRole(decoded.role);
    } catch (e) {
      console.error("Token decoding failed:", e);
      setToken(null);
      setUsername('Guest');
      setRole('');
    }
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 text-gray-200 bg-gray-900 min-h-screen p-6">
        <h1 className="text-2xl font-bold">Welcome, Guest! 👋</h1>
      </div>
    );
  }

  const copyToken = () => {
    if (!token) return;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(token)
        .then(() => alert('Token copied to clipboard!'))
        .catch(() => alert('Failed to copy token'));
    } else {
      alert('Clipboard not available');
    }
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6 text-gray-200">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {username}! 👋</h1>
        <p className="text-blue-200">Here's your account information dashboard!</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Info Card */}
        <Card className="bg-gray-800 border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <span className="text-sm font-medium text-gray-400">Username</span>
              <span className="font-semibold text-gray-100">{username}</span>
            </div>
            {role && (
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-sm font-medium text-gray-400">Role</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-800 text-blue-200 capitalize">
                  {role}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-gray-400">Account Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-800 text-green-200">
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Token Card */}
        {token && (
          <Card className="bg-gray-800 border-gray-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Access Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-400">
                Your authentication token for API access
              </p>

              <Button
                variant="outline"
                onClick={() => setShowToken(!showToken)}
                className="w-full text-white bg-gray-800 border border-gray-600 hover:text-blue-400 hover:border-blue-400"
              >
                {showToken ? 'Hide Token' : 'Show Token'}
              </Button>

              {showToken && (
                <>
                  <pre className="p-4 bg-gray-700 text-xs rounded-lg border border-gray-600 overflow-x-auto text-gray-200">
                    {token}
                  </pre>
                  <Button
                    variant="outline"
                    onClick={copyToken}
                    className="w-full text-white bg-gray-800 border border-gray-600 hover:text-green-400 hover:border-green-400"
                  >
                    Copy to Clipboard
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
