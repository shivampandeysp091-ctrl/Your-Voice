"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth, storage, getFavourites, getEmergencyContacts } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { UserCircle2, Save, Loader2, Mail, Link as LinkIcon, Star, Phone, Camera } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { favourites } = useFavorites();
  const router = useRouter();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [contactCount, setContactCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setName(user.displayName || "");
      setPhoto(user.photoURL || "");
      
      // Fetch stats
      getEmergencyContacts(user.uid).then(contacts => setContactCount(contacts.length)).catch(() => setContactCount(0));
      
      const local = localStorage.getItem('yv-emergency-contacts');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          let c = 0;
          if (parsed.family?.phone) c++;
          if (parsed.friend?.phone) c++;
          if (parsed.caregiver?.phone) c++;
          if (c > 0) setContactCount(c);
        } catch(e){}
      }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    setMessage("");
    try {
      const fileRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setPhoto(downloadUrl);
      setMessage("Image ready! Click 'Save Changes' to apply.");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message.includes("unauthorized") ? "Storage Error: Please enable Storage rules in Firebase Console." : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Loading...</div>;

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-white to-[#dde8ff]">
      <Navbar />
      
      <main className="px-4 pt-10 max-w-md mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-8 text-center">My Profile</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-[0_8px_40px_rgba(155,93,229,0.06)] flex flex-col items-center">
          
          <div className="relative mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full bg-[#ede9fe] border-4 border-[#c084fc] flex items-center justify-center overflow-hidden transition-all group-hover:scale-105">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-[#c084fc] animate-spin" />
              ) : photo || user?.photoURL ? (
                <img src={photo || user?.photoURL || ""} alt="User avatar" className="w-full h-full object-cover" />
              ) : name ? (
                <span className="text-4xl font-black text-[#9b5de5]">{name.charAt(0).toUpperCase()}</span>
              ) : (
                <UserCircle2 className="w-12 h-12 text-[#c084fc]" />
              )}
            </div>
            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
          </div>

          {/* Core Stats */}
          <div className="flex gap-4 w-full mb-8">
            <Link href="/favourites" className="flex-1 bg-[#fffbf0] border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform">
              <Star className="w-6 h-6 text-amber-500 mb-1" />
              <div className="font-extrabold text-[#1a1a2e] text-xl">{favourites.length}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-600">Favourites</div>
            </Link>
            
            <Link href="/emergency-setup" className="flex-1 bg-[#f0f9ff] border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform">
              <Phone className="w-6 h-6 text-blue-500 mb-1" />
              <div className="font-extrabold text-[#1a1a2e] text-xl">{contactCount}</div>
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
            <div className={`mb-4 w-full text-center text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}

          <button 
            onClick={handleUpdate}
            disabled={isSaving || isUploading || !name.trim()}
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
