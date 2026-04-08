"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Star, AlertTriangle, Globe, Mail } from 'lucide-react';
import { signInWithGoogle, auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  // Password strength logic
  const checkStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };

  const strength = checkStrength();
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Google Sign-Up failed');
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms of Service');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Error creating account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-12">
      <div className="w-full max-w-[400px] bg-white rounded-2xl p-8 shadow-xl border border-purple-50">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#9b5de5] to-[#c084fc] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a1a2e]">Create your account</h1>
          <p className="text-sm text-[#8b8baa] font-medium mt-1">Free forever. No credit card needed.</p>
        </div>

        <div className="flex flex-col gap-3 mb-6 bg-[#fcfcff] p-4 rounded-xl border border-purple-50">
          <div className="flex items-start gap-3">
             <Star className="w-4 h-4 text-[#f59e0b] fill-current mt-0.5 flex-shrink-0" />
             <div>
               <p className="text-xs font-bold text-[#1a1a2e]">Save your favourite phrases</p>
               <p className="text-[10px] text-[#8b8baa]">Access them instantly across all your devices</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <AlertTriangle className="w-4 h-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
             <div>
               <p className="text-xs font-bold text-[#1a1a2e]">Store emergency contacts</p>
               <p className="text-[10px] text-[#8b8baa]">Family, Friend, Caregiver — always ready</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Globe className="w-4 h-4 text-[#1d9bf0] mt-0.5 flex-shrink-0" />
             <div>
               <p className="text-xs font-bold text-[#1a1a2e]">Sync language preferences</p>
               <p className="text-[10px] text-[#8b8baa]">Your language and voice settings stay saved</p>
             </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        {verificationSent ? (
          <div className="flex flex-col items-center text-center mt-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Verify your email</h2>
            <p className="text-sm text-[#5a4a7a] mb-6">We've sent a verification link to <strong className="text-[#1a1a2e]">{email}</strong>. Please check your inbox and click the link to activate your free account.</p>
            <Link href="/login" className="w-full bg-[#9b5de5] text-white rounded-full py-3 font-bold hover:bg-[#7c3aed] transition-colors shadow-md block text-center">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <button 
              onClick={handleGoogleSignUp}
              className="w-full flex justify-center items-center gap-3 border border-gray-200 bg-white rounded-full py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm mb-6"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Sign up with Google — Recommended
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-[#8b8baa]">or sign up with email</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Full name"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#9b5de5] bg-[#fdfcff]"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
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
              <div>
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#9b5de5] bg-[#fdfcff]"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {/* Strength bar */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${strength >= i ? strengthColors[strength] : 'bg-gray-200'}`}></div>
                  ))}
                </div>
                <p className="text-[10px] text-[#8b8baa] mt-2 ml-1">Password must be at least 8 characters long and contain uppercase, number, and symbol to be strong.</p>
              </div>
              
              <div className="flex items-start gap-2 mt-2 cursor-pointer" onClick={() => setAgreed(!agreed)}>
                <input type="checkbox" checked={agreed} readOnly className="mt-1 accent-[#9b5de5]" />
                <p className="text-xs text-[#8b8baa]">I agree to the Terms of Service and Privacy Policy</p>
              </div>
              
              <button type="submit" className="w-full bg-[#9b5de5] text-white rounded-full py-3 font-bold mt-2 hover:bg-[#7c3aed] transition-colors shadow-md">
                Create Free Account
              </button>
            </form>

            <div className="text-center mt-6">
              <Link href="/login" className="text-sm text-[#4a4a6a]">
                Already have an account? <span className="text-[#9b5de5] font-bold">Sign in &rarr;</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
