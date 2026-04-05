"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mic } from 'lucide-react';
import { signInWithGoogle, auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl p-8 shadow-xl border border-purple-50">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#9b5de5] to-[#c084fc] rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a1a2e]">YourVoice</h1>
          <p className="text-xs text-[#8b8baa] font-medium tracking-wide uppercase mt-1">Expression, Without Limits</p>
        </div>

        <h2 className="text-xl font-bold text-[#1a1a2e] mb-1">Welcome back</h2>
        <p className="text-sm text-[#8b8baa] mb-6 leading-relaxed">Sign in to access your saved phrases, emergency contacts, and settings.</p>

        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center gap-3 border border-gray-200 bg-white rounded-full py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-[#8b8baa]">or sign in with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <div>
            <input 
              type="email" 
              placeholder="Email address"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#9b5de5] bg-[#fdfcff]"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#9b5de5] bg-[#fdfcff]"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <div className="text-right mt-1">
              <Link href="#" className="text-xs font-bold text-[#9b5de5]">Forgot password?</Link>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-[#9b5de5] text-white rounded-full py-3 font-bold mt-2 hover:bg-[#7c3aed] transition-colors shadow-md">
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/signup" className="text-sm text-[#4a4a6a]">
            Don't have an account? <span className="text-[#9b5de5] font-bold">Create one free &rarr;</span>
          </Link>
        </div>
        
        <p className="text-[10px] text-center text-[#8b8baa] mt-8">
          By signing in you agree to Terms of Service and Privacy Policy
        </p>

      </div>
    </div>
  );
}
