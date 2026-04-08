"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTTS } from '@/hooks/useTTS';

const CloudSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M70,25 C70,11 59,0 45,0 C34,0 24.5,6.5 20.5,16 C9.5,17 1,26.5 1,38 C1,50 11,60 23,60 L75,60 C87,60 97,50 97,38 C97,26.5 88,17.5 76,16 C74.5,10 65.5,5 56,5 C49,5 43,8.5 39,13.5 Z" fill="url(#cloudGrad)" />
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="100%" stopColor="#f0ebff" stopOpacity="0.8" />
      </linearGradient>
    </defs>
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [demoText, setDemoText] = useState("");
  const [demoLang, setDemoLang] = useState("en-IN");
  const [isDemoSpeaking, setIsDemoSpeaking] = useState(false);

  const { speak } = useTTS();

  useEffect(() => setMounted(true), []);

  const barHeights = [25, 45, 65, 85, 50, 110, 180, 55, 195, 80, 65, 140, 75, 100, 60, 85, 50, 75, 110, 165, 45, 85, 170, 55, 25, 145, 65, 85, 250, 110, 80, 55, 95, 80, 65, 40, 75, 100, 60, 85, 50, 75, 110, 65, 45, 85, 70, 55];
  
  const handleDemoSpeak = async () => {
    if (!demoText.trim()) return;
    setIsDemoSpeaking(true);
    try {
      await speak(demoText, demoLang, 1, 'Female');
    } finally {
      setIsDemoSpeaking(false);
    }
  };

  return (
    <main className="overflow-x-hidden bg-white">
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f0ebff 0%, #e4d9ff 50%, #d8cbff 100%)' }}>
        {/* Nice SVG Clouds */}
        <CloudSVG className="absolute w-[200px] md:w-[280px] bottom-32 md:bottom-10 left-[-20px] md:left-20 z-30 drop-shadow-2xl opacity-90" />
        <CloudSVG className="absolute w-[200px] md:w-[280px] bottom-32 md:bottom-20 right-[-30px] md:right-10 z-30 drop-shadow-2xl opacity-90 scale-x-[-1]" />

        <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center pt-20 px-4">

          {/* Hero Section */}
          <div className="h-32 mb-40 flex justify-center items-center gap-[9px] md:gap-[9px]">
            {/* CSS Animated Waveform Bars */}
            {mounted && barHeights.map((h, i) => (
              <div
                key={i}
                className="w-5 md:w-8 rounded-full bg-gradient-to-t from-[#9b5de5] to-[#c084fc] shadow-[0_0_20px_rgba(155,93,229,0.3)] mix-blend-multiply opacity-80"
                style={{
                  height: `${h}px`,
                  animation: `waveform 1s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                  transformOrigin: 'center'
                }}
              />
            ))}
          </div>

          <p className="text-gray-600 text-sm md:text-base mb-2 font-medium">Giving life to your everyday words</p>
          <h1 className="text-5xl md:text-8xl font-extrabold text-center max-w-7xl leading-tight mb-10 drop-shadow-sm tracking-tight">
            <span className="text-[#1a1a2e]">Expression, Without </span>
            <span className="text-[#9b5de5]">Limits</span>
          </h1>

          <Link href="/signup" className="bg-[#9b5de5] text-white rounded-full px-12 py-4 font-bold text-lg hover:bg-[#7c3aed] transition-colors shadow-[0_4px_16px_0_rgba(155,93,229,0.4)]">
            Get Started
          </Link>
        </div>
      </div>

      {/* SECTION 1 — STATS BAR */}
      <div className="bg-white/80 backdrop-blur-md border-y border-purple-100 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-purple-50 text-center">
          <div className="py-8">
            <div className="text-[#9b5de5] text-2xl md:text-3xl font-extrabold">11+</div>
            <div className="text-[#5a4a7a] text-xs font-semibold mt-1">Indian Languages</div>
          </div>
          <div className="py-8">
            <div className="text-[#9b5de5] text-2xl md:text-3xl font-extrabold">500+</div>
            <div className="text-[#5a4a7a] text-xs font-semibold mt-1">Phrase Templates</div>
          </div>
          <div className="py-8">
            <div className="text-[#9b5de5] text-2xl md:text-3xl font-extrabold">100%</div>
            <div className="text-[#5a4a7a] text-xs font-semibold mt-1">Free to Use</div>
          </div>
          <div className="py-8">
            <div className="text-[#9b5de5] text-2xl md:text-3xl font-extrabold">4</div>
            <div className="text-[#5a4a7a] text-xs font-semibold mt-1">Emergency Features</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — FEATURES */}
      <div className="py-14 px-10 bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="bg-[#ede9fe] text-[#9b5de5] text-xs font-bold px-4 py-1.5 rounded-full border border-[#c084fc] inline-block mb-4">✦ What we offer</div>
          <h2 className="text-3xl font-extrabold text-[#1a1a2e]">Everything you need to communicate freely</h2>
          <p className="text-[#5a4a7a] text-sm max-w-lg mt-2 mb-9">Built specifically for people with speech disabilities — accessible, affordable, and always available.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_20px_rgba(155,93,229,0.06)]">
              <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-2xl mb-3">🗣️</div>
              <h3 className="font-bold text-[#1a1a2e]">Text to Voice</h3>
              <p className="text-sm text-[#5a4a7a] mt-1">Type anything and hear it spoken in natural Indian language voices powered by Sarvam AI.</p>
              <div className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#9b5de5]">Core feature</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_20px_rgba(155,93,229,0.06)]">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-2xl mb-3">🚨</div>
              <h3 className="font-bold text-[#1a1a2e]">Emergency SOS</h3>
              <p className="text-sm text-[#5a4a7a] mt-1">One-tap alert sends live GPS location to your contacts via SMS. No app needed on their phone.</p>
              <div className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Safety critical</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_20px_rgba(155,93,229,0.06)]">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl mb-3">⭐</div>
              <h3 className="font-bold text-[#1a1a2e]">Smart Favourites</h3>
              <p className="text-sm text-[#5a4a7a] mt-1">Save your most used phrases for instant one-tap access. Synced across devices when signed in.</p>
              <div className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Productivity</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_20px_rgba(155,93,229,0.06)]">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-3">🌐</div>
              <h3 className="font-bold text-[#1a1a2e]">11 Indian Languages</h3>
              <p className="text-sm text-[#5a4a7a] mt-1">Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Urdu, English.</p>
              <div className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Multilingual</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_20px_rgba(155,93,229,0.06)]">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl mb-3">♿</div>
              <h3 className="font-bold text-[#1a1a2e]">Accessibility First</h3>
              <p className="text-sm text-[#5a4a7a] mt-1">High contrast mode, adjustable font size globally, screen reader support, large touch targets.</p>
              <div className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">WCAG AA</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — HOW IT WORKS */}
      <div className="py-14 px-10 bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] text-center relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="bg-[#ede9fe] text-[#9b5de5] text-xs font-bold px-4 py-1.5 rounded-full border border-[#c084fc] inline-block mb-4">✦ How it works</div>
          <h2 className="text-3xl font-extrabold text-[#1a1a2e] mb-9">Start speaking in 4 simple steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full relative">
            <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#c084fc] via-[#9b5de5] to-[#c084fc] z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-white border-[3px] border-[#9b5de5] text-[#9b5de5] text-xl font-black flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(155,93,229,0.2)]">1</div>
              <h3 className="text-sm font-extrabold text-[#1a1a2e] mb-1">Type or tap</h3>
              <p className="text-xs text-[#5a4a7a] leading-relaxed px-2">Write your message or tap any quick phrase on the home screen</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-white border-[3px] border-[#9b5de5] text-[#9b5de5] text-xl font-black flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(155,93,229,0.2)]">2</div>
              <h3 className="text-sm font-extrabold text-[#1a1a2e] mb-1">Choose language</h3>
              <p className="text-xs text-[#5a4a7a] leading-relaxed px-2">Select from 11 Indian languages using the language pill selector</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-white border-[3px] border-[#9b5de5] text-[#9b5de5] text-xl font-black flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(155,93,229,0.2)]">3</div>
              <h3 className="text-sm font-extrabold text-[#1a1a2e] mb-1">Tap Speak</h3>
              <p className="text-xs text-[#5a4a7a] leading-relaxed px-2">The app translates and speaks in a natural Indian voice via Sarvam AI</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-white border-[3px] border-[#9b5de5] text-[#9b5de5] text-xl font-black flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(155,93,229,0.2)]">4</div>
              <h3 className="text-sm font-extrabold text-[#1a1a2e] mb-1">You're heard!</h3>
              <p className="text-xs text-[#5a4a7a] leading-relaxed px-2">Save to favourites for next time — one tap to speak again</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 — LIVE DEMO STRIP */}
      <div className="py-14 px-10  relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-purple-100 shadow-[0_8px_40px_rgba(155,93,229,0.10)]">
          <h2 className="text-xl font-extrabold text-[#1a1a2e]">Try it right here — no sign up needed</h2>
          <p className="text-sm text-[#5a4a7a] mt-1 mb-5">Type anything and hear it in your browser</p>
          
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <textarea 
              className="flex-1 w-full border-2 border-[#ede9fe] rounded-2xl p-3.5 text-base text-[#1a1a2e] outline-none resize-none min-h-[80px] focus:border-[#c084fc]" 
              placeholder="Type: I am hungry"
              value={demoText}
              onChange={e => setDemoText(e.target.value)}
            />
            
            <div className="min-w-[160px] flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-1.5">
                {['en-IN', 'hi-IN', 'mr-IN', 'ta-IN', 'te-IN', 'gu-IN'].map((lang, idx) => {
                  const labels = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Gujarati'];
                  const isSel = demoLang === lang;
                  return (
                    <button 
                      key={lang}
                      onClick={() => setDemoLang(lang)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full cursor-pointer border-2 transition-all ${isSel ? 'border-[#9b5de5] bg-[#ede9fe] text-[#9b5de5]' : 'border-[#ede9fe] bg-[#f8f6ff] text-[#5a4a7a] hover:bg-[#ede9fe]/50'}`}
                    >
                      {labels[idx]}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={handleDemoSpeak}
                className={`${isDemoSpeaking ? 'bg-[#10b981]' : 'bg-[#9b5de5]'} text-white rounded-full px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(155,93,229,0.3)] transition-colors`}
              >
                {isDemoSpeaking ? 'Speaking...' : 'Speak now'}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 6 — SDG SECTION */}
      <div className="px-10 pb-14 bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="bg-[#ede9fe] text-[#9b5de5] text-xs font-bold px-4 py-1.5 rounded-full border border-[#c084fc] inline-block mb-4">✦ Social impact</div>
          <h2 className="text-3xl font-extrabold text-[#1a1a2e] text-center">Aligned with UN Sustainable Development Goals</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7 w-full">
            <div className="bg-white rounded-2xl p-5 text-center border border-purple-100">
              <div className="text-4xl font-black mb-1 text-[#4c9f38]">3</div>
              <div className="text-xs font-bold text-[#1a1a2e] mb-1">Good Health & Wellbeing</div>
              <div className="text-[11px] text-[#8b8baa] leading-relaxed">Improving communication for people with speech disabilities</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center border border-purple-100">
              <div className="text-4xl font-black mb-1 text-[#c5192d]">4</div>
              <div className="text-xs font-bold text-[#1a1a2e] mb-1">Quality Education</div>
              <div className="text-[11px] text-[#8b8baa] leading-relaxed">Enabling children with speech disabilities to participate equally in education</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center border border-purple-100">
              <div className="text-4xl font-black mb-1 text-[#fd6925]">9</div>
              <div className="text-xs font-bold text-[#1a1a2e] mb-1">Industry & Innovation</div>
              <div className="text-[11px] text-[#8b8baa] leading-relaxed">Affordable AI-powered assistive technology built for India</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center border border-purple-100">
              <div className="text-4xl font-black mb-1 text-[#dd1367]">10</div>
              <div className="text-xs font-bold text-[#1a1a2e] mb-1">Reduced Inequalities</div>
              <div className="text-[11px] text-[#8b8baa] leading-relaxed">Bridging communication gap across language and disability barriers</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7 — FINAL CTA */}
      <div className="mx-10 mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-[#9b5de5] via-[#7c3aed] to-[#6d28d9] py-14 px-10 text-center text-white relative z-20">
        <h2 className="text-3xl font-black mb-2.5">Your voice matters. Let's make it heard.</h2>
        <p className="text-base opacity-85 mb-7 max-w-md mx-auto leading-relaxed">Free forever. No credit card. Works on any phone. Available in 11 Indian languages.</p>
        
        <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
          <button 
            onClick={() => router.push('/signup')}
            className="w-full md:w-auto bg-white text-[#9b5de5] rounded-full px-9 py-4 text-base font-extrabold cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
          >
            Get Started — It's Free
          </button>
          <button 
            onClick={() => router.push('/demo')}
            className="w-full md:w-auto bg-transparent text-white border-2 border-white/50 rounded-full px-9 py-4 text-base font-bold cursor-pointer hover:bg-white/10 transition-colors"
          >
            Watch Demo ▶
          </button>
        </div>
        
        <div className="flex flex-wrap gap-5 justify-center mt-6 text-sm opacity-80">
          <span>✓ No app download</span>

          <span>✓ 100% free</span>
          <span>✓ WCAG accessible</span>
        </div>
      </div>

      {/* SECTION 8 — FOOTER */}
      <footer className="bg-[#1a1a2e] py-8 px-10 flex flex-col md:flex-row items-center justify-between gap-4 relative z-20">
        <div className="text-lg font-extrabold text-white">Your<span className="text-[#c084fc]">Voice</span></div>
        <div className="flex flex-wrap justify-center gap-5">
          <Link href="/about" className="text-sm text-white/50 font-medium no-underline hover:text-white transition-colors">About us</Link>
          <Link href="/demo" className="text-sm text-white/50 font-medium no-underline hover:text-white transition-colors">Demo</Link>
          <Link href="/emergency" className="text-sm text-white/50 font-medium no-underline hover:text-white transition-colors">Emergency</Link>
          <Link href="/accessibility" className="text-sm text-white/50 font-medium no-underline hover:text-white transition-colors">Accessibility</Link>
        </div>
        <div className="text-xs text-white/30 text-center md:text-right">© 2026 YourVoice · Made with ♥ for speech accessibility in India</div>
      </footer>

    </main>
  );
}