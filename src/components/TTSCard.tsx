"use client";
import { useState, useEffect } from 'react';
import { Volume2, Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '@/lib/languages';

interface Props {
  buttonLabel: "Speak" | "Add";
  onAction: (text: string, lang: string) => void;
  defaultText?: string;
  placeholder?: string;
  onTextChange?: (val: string) => void;
}

export default function TTSCard({ buttonLabel, onAction, defaultText = "", placeholder = "Tell us what you are feeling", onTextChange }: Props) {
  const [text, setText] = useState(defaultText);
  const [langCode, setLangCode] = useState('hi-IN');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  useEffect(() => {
    const savedLang = localStorage.getItem('yv-language') || 'hi-IN';
    setLangCode(savedLang);
  }, []);

  const selectedLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[1];

  const handleAction = () => {
    if (text.trim()) {
      onAction(text.trim(), langCode);
      if (buttonLabel === "Add") {
        setText("");
        if (onTextChange) onTextChange("");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col gap-3">
      <textarea
        className="w-full border-none outline-none resize-none font-inter text-base text-[#1a1a2e] bg-transparent placeholder:text-[#8b8baa] min-h-[72px]"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
           const val = e.target.value.slice(0, 300);
           setText(val);
           if (onTextChange) onTextChange(val);
        }}
        dir="auto"
      />
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1 relative">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 bg-[#ede9fe] text-[#9b5de5] rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap border border-transparent hover:border-[#c084fc]"
            >
              <Globe className="w-3 h-3" />
              {selectedLang.name === 'Hindi' ? 'Hindi' : selectedLang.native}
              <ChevronDown className="w-3 h-3" />
            </button>
            <span className="text-xs text-[#8b8baa]">{text.length} / 300</span>
          </div>
          <span className="text-[10px] text-[#8b8baa] ml-1">Select voice language — you can type in English</span>
          
          {isDropdownOpen && (
            <div className="absolute top-8 left-0 bg-white border border-purple-100 rounded-lg shadow-lg z-20 py-2 w-48 max-h-48 overflow-y-auto no-scrollbar">
              {LANGUAGES.map(l => (
                <div 
                  key={l.code}
                  className="px-3 py-2 text-xs text-[#4a4a6a] hover:bg-purple-soft cursor-pointer flex justify-between"
                  onClick={() => { 
                    setLangCode(l.code); 
                    setIsDropdownOpen(false);
                    localStorage.setItem('yv-language', l.code);
                  }}
                >
                  <span>{l.name}</span>
                  <span className="text-gray-400 font-mono text-[10px]">{l.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={handleAction}
          className="bg-[#9b5de5] text-white rounded-full px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#7c3aed] transition-colors shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
