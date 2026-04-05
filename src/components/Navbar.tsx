"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-purple-100 px-4 py-3 flex justify-between items-center relative">
      <Link href="/home" className="font-bold text-[#1a1a2e] text-xl">
        YourVoice
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-[#9b5de5]">About us</Link>
        <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-[#9b5de5]">Demo</Link>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-[#ede9fe] border-2 border-[#c084fc] flex items-center justify-center overflow-hidden focus:outline-none"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 className="w-5 h-5 text-[#c084fc]" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-100 rounded-xl shadow-lg py-2 flex flex-col z-50">
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 truncate">{user?.email || 'Not logged in'}</p>
              </div>
              <Link href="/profile" className="px-4 py-2 text-sm text-[#1a1a2e] hover:bg-purple-50">My Profile</Link>
              <Link href="/emergency-setup" className="px-4 py-2 text-sm text-[#1a1a2e] hover:bg-purple-50">Edit Contacts</Link>
              <div className="h-px bg-gray-100 my-1"></div>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-[#ef4444] hover:bg-red-50 flex items-center gap-2 text-left"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
