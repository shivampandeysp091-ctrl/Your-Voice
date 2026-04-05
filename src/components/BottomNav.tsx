"use client";
import Link from 'next/link';
import { Home, Star, Eye } from 'lucide-react';

interface Props {
  activePage: "home" | "favourites" | "accessibility" | "emergency";
}

export default function BottomNav({ activePage }: Props) {
  return (
    <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur border-t border-purple-100 flex justify-around items-center py-2 h-16 z-40">
      <Link href="/home" className="flex flex-col items-center gap-1 w-16">
        <Home className={`w-6 h-6 ${activePage === 'home' ? 'text-purple' : 'text-[#8b8baa]'}`} />
        <span className={`text-[10px] ${activePage === 'home' ? 'text-purple font-bold' : 'text-[#8b8baa]'}`}>Home</span>
      </Link>
      
      <Link href="/favourites" className="flex flex-col items-center gap-1 w-16">
        <Star className={`w-6 h-6 ${activePage === 'favourites' ? 'text-purple fill-purple' : 'text-[#8b8baa]'}`} />
        <span className={`text-[10px] ${activePage === 'favourites' ? 'text-purple font-bold' : 'text-[#8b8baa]'}`}>Favourites</span>
      </Link>
      
      <Link href="/accessibility" className="flex flex-col items-center gap-1 w-16">
        <Eye className={`w-6 h-6 ${activePage === 'accessibility' ? 'text-purple' : 'text-[#8b8baa]'}`} />
        <span className={`text-[10px] ${activePage === 'accessibility' ? 'text-purple font-bold' : 'text-[#8b8baa]'}`}>Accessibility</span>
      </Link>
      
      <Link href="/emergency" className="flex flex-col items-center gap-1 w-16">
        <div className={`w-6 h-6 flex justify-center items-center transform rotate-45 rounded-sm ${activePage === 'emergency' ? 'bg-[#1d9bf0]' : 'bg-[#8b8baa]'}`}>
          <span className="text-white transform -rotate-45 font-extrabold text-sm">!</span>
        </div>
        <span className={`text-[10px] ${activePage === 'emergency' ? 'text-[#1d9bf0] font-bold' : 'text-[#8b8baa]'}`}>Emergency</span>
      </Link>
    </div>
  );
}
