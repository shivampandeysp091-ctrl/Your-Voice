"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { Heart, Globe2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7ff] to-white pb-24">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-12 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-[#9b5de5] fill-[#9b5de5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-6 tracking-tight">
            Giving everyone a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b5de5] to-[#c084fc]">Voice.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            YourVoice is a passionate initiative to break down communication barriers. We believe that expressing yourself should be a fundamental human right, not a privilege.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(155,93,229,0.06)] border border-purple-50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Globe2 className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">11+ Languages</h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              Powered by advanced AI, our platform natively translates and synthesizes speech into the most beautiful and accurate human dialects in India.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(155,93,229,0.06)] border border-purple-50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Safety First</h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              Equipped with a one-tap SOS Emergency engine designed to notify loved ones with critical GPS data securely when it matters most.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(155,93,229,0.06)] border border-purple-50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-[#9b5de5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">100% Free</h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              We operate exclusively on a zero-profit model for end users. No hidden fees. No credit cards. Free forever.
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9b5de5] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-extrabold mb-6">The Story Behind the Screen</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Built with love using cutting-edge technologies like Next.js, Sarvam AI, and Firebase. This platform was envisioned to help people with vocal disabilities, throat injuries, and tourists navigating new territories safely.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed font-medium">
              Developed by <strong className="text-white bg-[#9b5de5]/20 px-2 py-1 rounded">Shivam Pandey</strong> to bridge the gap between complex AI and true, emotional human connection.
            </p>
          </div>
        </div>
      </main>

      {/* We pass a fake or 'home' active state because about isn't a primary bottom nav button */}
      <BottomNav activePage="home" /> 
    </div>
  );
}
