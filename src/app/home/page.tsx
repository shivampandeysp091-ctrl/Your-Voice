"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import TTSCard from '@/components/TTSCard';
import { QUICK_GREETINGS, SUGGESTION_CATEGORIES, COMMON_PHRASES } from '@/data/phrases';
import { useTTS } from '@/hooks/useTTS';
import { useState, useEffect } from 'react';

export default function Home() {
  const { speak } = useTTS();
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTION_CATEGORIES);
  const [isLoadingSugg, setIsLoadingSugg] = useState(false);

  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions(SUGGESTION_CATEGORIES);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoadingSugg(true);
      try {
         const res = await fetch('/api/suggest', {
            method: 'POST',
            body: JSON.stringify({text: inputText, language: 'en-IN'}),
            headers: {'Content-Type': 'application/json'}
         });
         const data = await res.json();
         if (data.suggestions && data.suggestions.length) {
            setSuggestions(data.suggestions);
         }
      } catch(e) {}
      setIsLoadingSugg(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [inputText]);

  const handleSpeakAction = async (text: string, lang: string) => {
    await speak(text, lang, 1, 'Female');
  };

  const handleChipClick = (phrase: string) => {
    setInputText(prev => prev.trim() ? prev + " " + phrase : phrase); 
  };

  return (
    <div className="pb-24 min-h-screen">
      <Navbar />
      
      <main className="px-4 pt-6 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-6">Type Your Message</h1>
        
        <TTSCard 
          buttonLabel="Speak" 
          onAction={handleSpeakAction} 
          defaultText={inputText} 
          onTextChange={setInputText}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
             <h3 className="font-bold text-[#1a1a2e] mb-4 text-sm">Quick Greetings</h3>
             <div className="flex flex-wrap gap-2">
                 {QUICK_GREETINGS.map((phrase, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleChipClick(phrase)}
                      className="bg-[#ede9fe] text-[#9b5de5] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer border border-transparent hover:border-[#c084fc] transition-colors"
                    >
                      {phrase}
                    </button>
                 ))}
             </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm relative">
             <h3 className="font-bold text-[#1a1a2e] mb-4 text-sm flex items-center justify-between">
                Live Suggestions 
                {isLoadingSugg && <span className="text-[#9b5de5] text-xs animate-pulse">Loading...</span>}
             </h3>
             <div className="flex flex-wrap gap-2">
                 {suggestions.map((phrase, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleChipClick(phrase)}
                      className="bg-[#ede9fe]/60 text-[#9b5de5] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer border border-transparent hover:border-[#c084fc] transition-colors"
                    >
                      {phrase}
                    </button>
                 ))}
             </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
             {COMMON_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(phrase)}
                  className="bg-white text-[#4a4a6a] text-sm font-medium px-5 py-2.5 rounded-full border border-purple-100 shadow-sm hover:border-[#c084fc] hover:text-[#9b5de5] transition-colors"
                >
                  {phrase}
                </button>
             ))}
        </div>
      </main>

      <BottomNav activePage="home" />
    </div>
  );
}
