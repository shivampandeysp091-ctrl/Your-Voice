"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import TTSCard from '@/components/TTSCard';
import { useTTS } from '@/hooks/useTTS';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';
import { Volume2, Star, Trash2 } from 'lucide-react';

export default function Favourites() {
  const { speak } = useTTS();
  const { favourites, addFavourite, removeFavourite, loading } = useFavorites();
  const [inputText, setInputText] = useState("");

  const handleAddAction = (text: string, lang: string) => {
    speak(text, lang, 1, 'Female');
    addFavourite(text);
    setInputText("");
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-white to-[#dde8ff]">
      <Navbar />
      
      <main className="px-4 pt-6 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-6">Type Your Message</h1>
        
        <TTSCard 
          buttonLabel="Add" 
          onAction={handleAddAction} 
          defaultText={inputText} 
        />
        
        <div className="mt-6 flex flex-col gap-3">
          {loading ? (
            <div className="text-center text-[#8b8baa] text-sm mt-12">Loading...</div>
          ) : favourites.length === 0 ? (
            <div className="py-20 flex justify-center">
              <p className="text-[#8b8baa] text-sm text-center max-w-[250px]">
                No favourites yet. Add or Tap the star on a phrase to save it here
              </p>
            </div>
          ) : (
            favourites.map((fav) => (
              <div key={fav.id} className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm flex items-center justify-between">
                <p className="text-[#1a1a2e] font-medium text-sm flex-1 mr-3">{fav.text}</p>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                    const currentLang = localStorage.getItem('yv-language') || 'hi-IN';
                    speak(fav.text, currentLang, 1, 'Female');
                  }} className="p-2 bg-[#ede9fe] text-[#9b5de5] rounded-full hover:bg-[#c084fc] hover:text-white transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFavourite(fav.id)} className="p-2 text-[#f59e0b]">
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={() => removeFavourite(fav.id)} className="p-2 text-[#ef4444]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav activePage="favourites" />
    </div>
  );
}
