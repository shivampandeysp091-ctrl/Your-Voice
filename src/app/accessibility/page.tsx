"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useTTS } from '@/hooks/useTTS';
import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { LANGUAGES } from '@/lib/languages';

export default function Accessibility() {
  const { speak } = useTTS();
  const [fontSize, setFontSize] = useState(16);
  const [mode, setMode] = useState<'light'|'dark'|'high-contrast'>('light');
  const [voiceGender, setVoiceGender] = useState<'Female'|'Male'>('Female');
  const [speechSpeed, setSpeechSpeed] = useState(1);
  const [language, setLanguage] = useState('hi-IN');

  useEffect(() => {
    const savedSize = localStorage.getItem('yv-font-size');
    if (savedSize) setFontSize(Number(savedSize));

    const savedMode = localStorage.getItem('yv-mode') as any;
    if (savedMode) setMode(savedMode);

    const savedLang = localStorage.getItem('yv-language');
    if (savedLang) setLanguage(savedLang);

    const savedGender = localStorage.getItem('yv-gender') as any;
    if (savedGender) setVoiceGender(savedGender);

    const savedSpeed = localStorage.getItem('yv-speed');
    if (savedSpeed) setSpeechSpeed(Number(savedSpeed));
  }, []);

  const handleModeChange = (newMode: 'light'|'dark'|'high-contrast') => {
    setMode(newMode);
    localStorage.setItem('yv-mode', newMode);
    
    if (newMode === 'light') {
      document.documentElement.classList.remove('dark', 'high-contrast');
    } else if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('high-contrast');
    } else if (newMode === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    // Apply globally to entire app
    document.documentElement.style.setProperty(
      '--base-font', value + 'px'
    );
    localStorage.setItem('yv-font-size', value.toString());
  };

  const handleSettingChange = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const playSample = () => {
    speak("Hello, this is a sample of your selected voice.", language, speechSpeed, voiceGender);
  };

  return (
    <div className="pb-24 min-h-screen">
      <Navbar />
      
      <main className="px-4 pt-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-6">Accessibitly</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Settings */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a1a2e]">Choose Language</label>
              <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  handleSettingChange('yv-language', e.target.value);
                }}
                className="w-full bg-[#fdfcff] border border-purple-200 rounded-lg p-3 text-sm outline-none focus:border-[#9b5de5]"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.name} ({l.native})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold text-[#1a1a2e]">
                <label>Font Size</label>
                <span className="text-[#9b5de5]">{fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="12" max="26" 
                value={fontSize} 
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full accent-[#9b5de5]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a1a2e]">Mode</label>
              <div className="flex bg-[#ede9fe] rounded-lg p-1">
                {['Light', 'Dark', 'High Contrast'].map(m => {
                  const val = m.toLowerCase().replace(' ', '-') as 'light'|'dark'|'high-contrast';
                  return (
                    <button 
                      key={m}
                      onClick={() => handleModeChange(val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-md ${mode === val ? 'bg-white text-[#9b5de5] shadow-sm' : 'text-[#8b8baa]'}`}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1a1a2e]">Voice gender</label>
                <select 
                  value={voiceGender}
                  onChange={(e) => {
                    setVoiceGender(e.target.value as any);
                    handleSettingChange('yv-gender', e.target.value);
                  }}
                  className="w-full bg-[#fdfcff] border border-purple-200 rounded-lg p-3 text-sm outline-none focus:border-[#9b5de5]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1a1a2e]">Speech speed</label>
                <select 
                  value={speechSpeed}
                  onChange={(e) => {
                    setSpeechSpeed(Number(e.target.value));
                    handleSettingChange('yv-speed', e.target.value);
                  }}
                  className="w-full bg-[#fdfcff] border border-purple-200 rounded-lg p-3 text-sm outline-none focus:border-[#9b5de5]"
                >
                  <option value={0.5}>Slow</option>
                  <option value={1}>Normal</option>
                  <option value={1.5}>Fast</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT: Previews */}
          <div className="flex flex-col gap-6">
             <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col items-start">
              <h1 className="font-extrabold text-[#9b5de5] mb-2 leading-none" style={{ fontSize: `${fontSize}px` }}>YourVoice</h1>
              <p className="text-sm text-[#8b8baa] mb-6">Adjust font size and contrast for better accessibility.</p>
              
              <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-2 rounded-lg">
                ✓ WCAG AA contrast met
              </div>
            </div>

            <div className="bg-[#ede9fe] rounded-2xl p-6 shadow-sm border border-transparent flex flex-col items-start gap-4">
              <p className="text-[#4a4a6a] font-medium text-sm">Tap to hear a sample in your selected voice</p>
              <button 
                onClick={playSample}
                className="bg-[#9b5de5] text-white rounded-full px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#7c3aed]"
              >
                <Volume2 className="w-5 h-5" />
                Play sample
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activePage="accessibility" />
    </div>
  );
}
