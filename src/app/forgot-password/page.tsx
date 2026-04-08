"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl p-8 shadow-xl border border-purple-50">
        <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-[#9b5de5] mb-8 hover:text-[#7c3aed]">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Check your email</h1>
            <p className="text-sm text-[#5a4a7a] mb-6">
              We've sent a password reset link to <strong className="text-[#1a1a2e]">{email}</strong>. 
            </p>
            <Link href="/login" className="w-full bg-[#9b5de5] text-white rounded-full py-3 font-bold hover:bg-[#7c3aed] transition-colors shadow-md my-4 block text-center">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9b5de5] to-[#c084fc] rounded-2xl flex items-center justify-center mb-3 shadow-md">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#1a1a2e]">Reset password</h1>
              <p className="text-sm text-[#8b8baa] font-medium mt-1">Enter your email address to receive a secure reset link.</p>
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleReset} className="flex flex-col gap-4">
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
              
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-[#9b5de5] text-white rounded-full py-3 font-bold mt-2 hover:bg-[#7c3aed] transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
