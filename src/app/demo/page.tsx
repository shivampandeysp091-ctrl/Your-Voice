"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Volume2, Phone, MapPin, Smartphone, MessageCircle } from 'lucide-react';
import { LANGUAGES } from '@/lib/languages';

export default function Demo() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState('hi-IN');
  const [text, setText] = useState('');

  const speakDemo = (phrase: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase || 'Hello');
      u.lang = lang;
      window.speechSynthesis.speak(u);
    }
  };

  const renderStepNav = () => (
    <div className="flex justify-between mt-8">
      {step > 1 ? (
        <button onClick={() => setStep(step - 1)} className="text-[#8b8baa] font-bold py-2">Back</button>
      ) : <div></div>}
      {step < 4 ? (
        <button onClick={() => setStep(step + 1)} className="bg-[#9b5de5] text-white px-6 py-2 rounded-full font-bold">Next</button>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 gap-2">
          {[1,2,3,4].map(i => (
             <div key={i} className={`h-2 rounded-full flex-1 transition-colors ${step >= i ? 'bg-[#9b5de5]' : 'bg-[#ede9fe]'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in relative">
            <h2 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Step 1 — Choose Language</h2>
            <p className="text-sm text-[#8b8baa] mb-6">Select the language you want to communicate in.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
               {LANGUAGES.slice(0, 9).map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => setLang(l.code)}
                    className={`p-3 rounded-xl border font-medium text-sm text-center ${lang === l.code ? 'border-[#9b5de5] bg-[#ede9fe] text-[#9b5de5]' : 'border-purple-100 text-[#4a4a6a]'}`}
                  >
                    {l.native}
                  </button>
               ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in relative">
            <h2 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Step 2 — Speak a Message</h2>
            <p className="text-sm text-[#8b8baa] mb-6">Type anything or tap a chip to hear it speak.</p>
            
            <div className="bg-[#fcfcff] rounded-2xl p-4 border border-purple-100 shadow-sm mb-4 flex flex-col gap-3">
              <textarea 
                className="w-full border-none outline-none resize-none bg-transparent min-h-[80px]"
                placeholder="Try typing something..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button onClick={() => speakDemo(text)} className="self-end bg-[#9b5de5] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-colors hover:bg-purple-dark">
                <Volume2 className="w-4 h-4" /> Speak
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['Hello there', 'I need some help', 'Thank you!'].map((p, i) => (
                <button key={i} onClick={() => speakDemo(p)} className="bg-[#ede9fe] text-[#9b5de5] text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:border-[#c084fc] border border-transparent">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in relative">
            <h2 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Step 3 — Try Emergency</h2>
            <p className="text-sm text-[#8b8baa] mb-6">Keep yourself safe with single-tap SOS tools.</p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#fee2e2] rounded-xl p-4 flex flex-col items-center gap-2 text-[#ef4444] text-center cursor-pointer hover:bg-red-200 transition-colors" onClick={() => alert("Simulation: Calling Emergency Number...")}>
                  <Phone className="w-8 h-8 fill-current" />
                  <span className="font-bold text-sm">Call help</span>
               </div>
               <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center gap-2 text-purple-dark text-center cursor-pointer hover:bg-purple-200 transition-colors" onClick={() => alert("Simulation: Sending SMS...")}>
                  <MessageCircle className="w-8 h-8" />
                  <span className="font-bold text-sm">SMS Alert</span>
               </div>
               <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center gap-2 text-purple-dark text-center cursor-pointer hover:bg-purple-200 transition-colors" onClick={() => alert("Simulation: Sharing Location...")}>
                  <MapPin className="w-8 h-8" />
                  <span className="font-bold text-sm">Location</span>
               </div>
               <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center gap-2 text-purple-dark text-center cursor-pointer hover:bg-purple-200 transition-colors" onClick={() => { navigator.vibrate && navigator.vibrate(300); alert("Vibrating SOS!"); }}>
                  <Smartphone className="w-8 h-8" />
                  <span className="font-bold text-sm">Vibrate</span>
               </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in relative text-center pt-8">
            <h2 className="text-4xl font-extrabold text-[#9b5de5] mb-4">You're Ready!</h2>
            <p className="text-[#4a4a6a] mb-8 max-w-sm mx-auto">Access all features, build your custom phrase library, and secure your emergency contacts by creating a free account.</p>
            <Link href="/signup" className="inline-block bg-[#9b5de5] text-white px-8 py-4 rounded-full font-bold shadow-lg w-full mb-4 hover:bg-[#7c3aed] transition-colors">
              Get Started Now
            </Link>
            <Link href="/" className="text-[#8b8baa] font-medium text-sm hover:underline">
              Skip to Home
            </Link>
          </div>
        )}

        {step < 4 && renderStepNav()}
      </div>
    </div>
  );
}
