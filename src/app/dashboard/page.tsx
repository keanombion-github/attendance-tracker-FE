'use client';

import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import Link from 'next/link';

interface UserDetails {
  id: string;
  email: string;
  name?: string;
  role: 'employee' | 'admin';
  isClocked?: boolean;
  clockInTime?: string;
  todayHours?: string;
}

export default function Dashboard() {
  const { user, logout, isLoading, fetchUserDetails } = useAuth();
  const router = useRouter();
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // Fix hydration by only setting time on client
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFetchUserDetails = async () => {
    try {
      const success = await fetchUserDetails();
      console.log('Dashboard - fetchUserDetails success:', success, user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleTodaysRecord = () => {
    if (!user || !user.records) return null;
    const today = new Date().toDateString();
    const todaysRecord = user.records.find(record => {
      const recordDate = new Date(record.timein).toDateString();
      return recordDate === today;
    });

    console.log('Dashboard - Today\'s record:', todaysRecord);
    
    // if(todaysRecord?.timein) {
    //   setIsClockingIn(true)
    // } else {
    //   setIsClockingIn(false)
    // }
    
    // if(todaysRecord?.timeout) {
    //   setIsClockingOut(true)
    // } else {
    //   setIsClockingOut(false)
    // }

  }

  useEffect(() => {
    if (!isLoading && user) {
      handleFetchUserDetails();
      handleTodaysRecord();
    }
  }, [isLoading]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleClockIn = async () => {
    setIsClockingIn(true);
    try {
      const token = localStorage.getItem('auth-token');
      console.log('Frontend - Sending clock-in request with token:', token);
      const parsedToken = token ? JSON.parse(token) : null;

      const response = await fetch('/api/attendance/clock-in', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${parsedToken.token}`,
        },
        body: JSON.stringify({ employeeId: user?.id }),
      });
      
      console.log('Frontend - Clock-in response status:', response.status);
      const data = await response.json();
      console.log('Frontend - Clock-in response data:', data);
      
      if (response.ok) {
        // Refresh user details to get updated clock status
        await fetchUserDetails();
      } else {
        console.error('Clock-in failed:', data);
      }
    } catch (error) {
      console.error('Clock in error:', error);
    }
    setIsClockingIn(false);
  };

  const handleClockOut = async () => {
    setIsClockingOut(true);
    try {
      const token = localStorage.getItem('auth-token');
      console.log('Frontend - Sending clock-out request with token:', token);
      
      const response = await fetch('/api/attendance/clock-out', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ employeeId: user?.id }),
      });
      
      console.log('Frontend - Clock-out response status:', response.status);
      const data = await response.json();
      console.log('Frontend - Clock-out response data:', data);
      
      if (response.ok) {
        // Refresh user details to get updated clock status
        await fetchUserDetails();
      } else {
        console.error('Clock-out failed:', data);
      }
    } catch (error) {
      console.error('Clock out error:', error);
    }
    setIsClockingOut(false);
  };

  // Get clock status from userDetails
  const isClocked = userDetails?.isClocked || false;

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
                Welcome, <span className="text-white font-medium">{userDetails?.name || user?.name || user?.email}</span>
                {currentTime && (
                  <div className="text-xs text-gray-400 mt-1">
                    {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
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
              <div className={`h-3 w-3 rounded-full ${isClocked ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${isClocked ? 'text-green-400' : 'text-red-400'}`}>
                  {isClocked ? 'Clocked In' : 'Clocked Out'}
                </span>
              </div>
              {userDetails?.clockInTime && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Clock In Time:</span>
                  <span className="font-medium text-white">{userDetails.clockInTime}</span>
                </div>
              )}
              <div className='justify-between items-center'>
                <span className="text-gray-400 font-bold">Records:</span>
                <div className='grid grid-cols-1 gap-2'>
                    {user?.records?.map((record, index) => (
                    <div key={index} className="items-center space-x-2">
                      <span className="font-medium text-gray-400">{new Date(record.timein).toLocaleDateString()}</span>
                      <div className='flex items-center space-x-4'>
                        {record.timein && (
                          <span className="font-medium text-white"><b className='text-green-400'>In:</b> {new Date(record.timein).toLocaleTimeString()}</span>
                        )}
                        {record.timeout && (
                          <span className="font-medium text-white"><b className='text-red-400'>Out:</b> {new Date(record.timeout).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Today's Hours:</span>
                <span className="font-medium text-white">{userDetails?.todayHours || '0:00'}</span>
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
                disabled={isClocked || isClockingIn}
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
                disabled={!isClocked || isClockingOut}
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