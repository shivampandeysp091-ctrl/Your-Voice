"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth, getFavourites, getEmergencyContacts } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { UserCircle2, Save, Loader2, Mail, Link as LinkIcon, Star, Phone } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [favCount, setFavCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setName(user.displayName || "");
      setPhoto(user.photoURL || "");
      
      // Fetch stats
      getFavourites(user.uid).then(favs => setFavCount(favs.length)).catch(() => setFavCount(0));
      getEmergencyContacts(user.uid).then(contacts => setContactCount(contacts.length)).catch(() => setContactCount(0));
    }
  }, [user, loading, router]);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setMessage("");
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
      setMessage("Profile updated successfully!");
    } catch (e: any) {
      setMessage("Error updating profile.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Loading...</div>;

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-white to-[#dde8ff]">
      <Navbar />
      
      <main className="px-4 pt-10 max-w-md mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-8 text-center">My Profile</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-[0_8px_40px_rgba(155,93,229,0.06)] flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#ede9fe] border-4 border-[#c084fc] flex items-center justify-center overflow-hidden mb-6">
            {photo || user?.photoURL ? (
              <img src={photo || user?.photoURL || ""} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 className="w-12 h-12 text-[#c084fc]" />
            )}
          </div>

          {/* Core Stats */}
          <div className="flex gap-4 w-full mb-8">
            <Link href="/favourites" className="flex-1 bg-[#fffbf0] border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform">
              <Star className="w-6 h-6 text-amber-500 mb-1" />
              <div className="font-extrabold text-[#1a1a2e] text-xl">{favCount === null ? '-' : favCount}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-600">Favourites</div>
            </Link>
            
            <Link href="/emergency-setup" className="flex-1 bg-[#f0f9ff] border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform">
              <Phone className="w-6 h-6 text-blue-500 mb-1" />
              <div className="font-extrabold text-[#1a1a2e] text-xl">{contactCount === null ? '-' : contactCount}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-blue-600">SOS Contacts</div>
            </Link>
          </div>

          <div className="w-full mb-5">
            <label className="block text-sm font-bold text-[#1a1a2e] mb-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-[#ede9fe] rounded-xl p-3.5 text-base text-[#1a1a2e] outline-none focus:border-[#c084fc]"
              placeholder="Your full name"
            />
          </div>

          <div className="w-full mb-5 relative">
            <label className="block text-sm font-bold text-[#1a1a2e] mb-2">Avatar URL (Optional)</label>
            <div className="relative">
              <input 
                type="text" 
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full border-2 border-[#ede9fe] rounded-xl p-3.5 pl-10 text-base text-[#1a1a2e] outline-none focus:border-[#c084fc]"
                placeholder="https://example.com/photo.jpg"
              />
              <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="w-full mb-8 relative">
            <label className="block text-sm font-bold text-[#1a1a2e] mb-2">Email Address</label>
            <div className="relative">
              <input 
                type="text" 
                value={user.email || ""}
                disabled
                className="w-full border-2 border-[#f5f3ff] bg-[#f5f3ff] text-gray-400 rounded-xl p-3.5 pl-10 text-base outline-none cursor-not-allowed"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {message && (
            <div className={`mb-4 text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}

          <button 
            onClick={handleUpdate}
            disabled={isSaving || !name.trim()}
            className="w-full bg-[#9b5de5] text-white rounded-xl px-6 py-4 font-extrabold flex items-center justify-center gap-2 hover:bg-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </main>

      {/* Reusing BottomNav for global consistency */}
      {/* We pass a fake or 'home' active state because profile isn't a primary bottom nav button, which is standard UI practice */}
      <BottomNav activePage="home" /> 
    </div>
  );
}
