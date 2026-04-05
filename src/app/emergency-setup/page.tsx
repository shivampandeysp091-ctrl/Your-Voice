"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Check, ArrowLeft } from 'lucide-react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export default function EmergencySetup() {
  const { user } = useAuth();
  
  const [family, setFamily] = useState({ name: '', phone: '' });
  const [friend, setFriend] = useState({ name: '', phone: '' });
  const [caregiver, setCaregiver] = useState({ name: '', phone: '' });

  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load from local storage first
    try {
      const local = localStorage.getItem('yv-emergency-contacts');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.family) setFamily(parsed.family);
        if (parsed.friend) setFriend(parsed.friend);
        if (parsed.caregiver) setCaregiver(parsed.caregiver);
      }
    } catch(e) {}

    // Load from FB if logged in
    if (user) {
      const loadFB = async () => {
        try {
          const docRef = await getDoc(doc(db, `users/${user.uid}/emergencyContacts`, 'main'));
          if (docRef.exists()) {
            const data = docRef.data().contacts;
            if (data.family) setFamily(data.family);
            if (data.friend) setFriend(data.friend);
            if (data.caregiver) setCaregiver(data.caregiver);
          }
        } catch (e) {
          console.error(e);
        }
      };
      loadFB();
    }
  }, [user]);

  const handleSave = async (role: string, data: { name: string, phone: string }) => {
    // 1. Save to local storage
    const currentLocal = JSON.parse(localStorage.getItem('yv-emergency-contacts') || '{}');
    currentLocal[role] = data;
    localStorage.setItem('yv-emergency-contacts', JSON.stringify(currentLocal));

    // 2. Save to FB if user exists
    if (user) {
      try {
        await setDoc(doc(db, `users/${user.uid}/emergencyContacts`, 'main'), {
          contacts: currentLocal
        }, { merge: true });
      } catch (e) {
        console.error('Firebase save failed', e);
      }
    }

    setSavedStatus({ ...savedStatus, [role]: true });
    setTimeout(() => {
      setSavedStatus(s => ({ ...s, [role]: false }));
    }, 2000);
  };

  const renderForm = (role: string, label: string, state: {name: string, phone: string}, setter: any) => (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col gap-4 mb-4">
      <h3 className="font-bold text-[#1a1a2e] text-lg">{label}</h3>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#8b8baa]">Contact Name</label>
        <input 
          type="text" 
          placeholder="e.g. Mum" 
          value={state.name}
          onChange={e => setter({ ...state, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#9b5de5] bg-[#fdfcff]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#8b8baa]">Phone Number</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="tel" 
            placeholder="+919999999999" 
            value={state.phone}
            onChange={e => setter({ ...state, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#9b5de5] bg-[#fdfcff]"
          />
        </div>
      </div>
      <button 
        onClick={() => handleSave(role, state)}
        className="self-end bg-[#9b5de5] text-white rounded-full px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-[#7c3aed] transition-colors"
      >
        {savedStatus[role] ? <><Check className="w-4 h-4" /> Saved</> : 'Save'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f3ff] p-4 text-[#4a4a6a]">
      <div className="max-w-xl mx-auto pt-4">
        <Link href="/emergency" className="flex items-center gap-2 text-sm font-bold text-[#9b5de5] mb-6 hover:text-[#7c3aed]">
          <ArrowLeft className="w-4 h-4" /> Back to Emergency
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-2">Emergency Contacts</h1>
        <p className="text-sm text-[#8b8baa] mb-8">These people will receive an SMS with your location when you tap Alert.</p>

        {renderForm('family', 'Family Member', family, setFamily)}
        {renderForm('friend', 'Friend', friend, setFriend)}
        {renderForm('caregiver', 'Caregiver', caregiver, setCaregiver)}
      </div>
    </div>
  );
}
