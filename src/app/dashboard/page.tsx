'use client';

import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);

  const handleClockIn = async () => {
    setIsClockingIn(true);
    try {
      await fetch('/api/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: user?.id }),
      });
      setClockedIn(true);
    } catch (error) {
      console.error('Clock in error:', error);
    }
    setIsClockingIn(false);
  };

  const handleClockOut = async () => {
    setIsClockingOut(true);
    try {
      await fetch('/api/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: user?.id }),
      });
      setClockedIn(false);
    } catch (error) {
      console.error('Clock out error:', error);
    }
    setIsClockingOut(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Admin Panel
                </Link>
              )}
              <div className="text-sm text-gray-300">
                Welcome, <span className="text-white font-medium">{user?.name || user?.email}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Current Status</h2>
              <div className={`h-3 w-3 rounded-full ${clockedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${clockedIn ? 'text-green-400' : 'text-red-400'}`}>
                  {clockedIn ? 'Clocked In' : 'Clocked Out'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Today's Hours:</span>
                <span className="font-medium text-white">0:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">This Week:</span>
                <span className="font-medium text-white">0:00</span>
              </div>
            </div>
          </div>

          {/* Time Tracking Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-6">Time Tracking</h2>
            <div className="space-y-4">
              <Button
                variant="success"
                className="w-full py-4 text-lg"
                onClick={handleClockIn}
                disabled={clockedIn || isClockingIn}
              >
                {isClockingIn ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Clocking In...</span>
                  </div>
                ) : (
                  'Clock In'
                )}
              </Button>
              <Button
                variant="danger"
                className="w-full py-4 text-lg"
                onClick={handleClockOut}
                disabled={!clockedIn || isClockingOut}
              >
                {isClockingOut ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Clocking Out...</span>
                  </div>
                ) : (
                  'Clock Out'
                )}
              </Button>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-6">Quick Links</h2>
            <div className="space-y-3">
              <Link href="/reports" className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors group">
                <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-gray-300 group-hover:text-white transition-colors">View Reports</span>
              </Link>
              <Link href="/profile" className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors group">
                <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-300 group-hover:text-white transition-colors">My Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-gray-400">No recent activity</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}