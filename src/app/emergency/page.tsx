"use client";
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useTTS } from '@/hooks/useTTS';
import { Phone, MapPin, Smartphone, Play, ArrowRight } from 'lucide-react';
import { EMERGENCY_PHRASES } from '@/data/phrases';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Emergency() {
  const { speak } = useTTS();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any>({
    family: { name: '', phone: '' },
    friend: { name: '', phone: '' },
    caregiver: { name: '', phone: '' }
  });
  const [toastMessage, setToastMessage] = useState('');
  const [loadingContact, setLoadingContact] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('yv-emergency-contacts');
    if (local) {
      try {
        setContacts(JSON.parse(local));
      } catch(e){}
    }

    if (user) {
      const loadFB = async () => {
        try {
          const docRef = await getDoc(doc(db, `users/${user.uid}/emergencyContacts`, 'main'));
          if (docRef.exists()) {
            setContacts(docRef.data().contacts);
          }
        } catch (e) {
          console.error(e);
        }
      };
      loadFB();
    }
  }, [user]);

  const emergencyNumber = "+919999999999"; 
  
  const callForHelp = () => {
    window.location.href = `tel:${emergencyNumber}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const shareLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        if (navigator.share) {
          navigator.share({ title: 'Emergency Location', text: 'I need help! My location:', url: mapsLink }).catch(() => alert(mapsLink));
        } else {
          alert('Location Link: ' + mapsLink);
        }
      });
    }
  };

  const vibrateAlert = () => {
    if (navigator.vibrate) {
      navigator.vibrate([300,100,300,100,300,500,100,100,100,100,100,500,300,100,300,100,300]);
    }
  };

  const triggerWhatsApp = (phone: string, lat?: number, lng?: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.length >= 10 ? '91' + cleanPhone.slice(-10) : cleanPhone;
    
    const locationString = lat && lng ? `Location: https://maps.google.com/?q=${lat},${lng}` : "Location unavailable";
    const message = `🚨 URGENT: ${user?.displayName || 'Someone'} needs immediate help!\n\n${locationString}\n\n— Sent via YourVoice app`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${finalPhone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const sendAlertSMS = async (role: string, phone: string, name: string) => {
    if (!phone) {
      showToast('Please set a phone number first!');
      return;
    }
    
    setLoadingContact(role);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          triggerWhatsApp(phone, position.coords.latitude, position.coords.longitude);
          setLoadingContact('');
          showToast(`Opening WhatsApp for ${name}...`);
        },
        error => {
          console.warn("Location error:", error);
          triggerWhatsApp(phone); // send without location
          setLoadingContact('');
          showToast(`Opening WhatsApp for ${name}...`);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      triggerWhatsApp(phone); // unsupported
      setLoadingContact('');
      showToast(`Opening WhatsApp for ${name}...`);
    }
  };

  const renderContactRow = (roleKey: string, roleLabel: string) => {
    const contact = contacts[roleKey as keyof typeof contacts];
    const isSet = contact?.name && contact?.phone;
    
    return (
      <div className="flex justify-between items-center bg-[#fcfcff] p-3 border border-purple-50 rounded-xl">
        <div>
          <p className={`font-bold ${isSet ? 'text-[#1a1a2e]' : 'text-gray-400'}`}>
            {isSet ? contact.name : 'Not set — tap to add'}
          </p>
          <p className="text-xs text-[#8b8baa]">{roleLabel}</p>
        </div>
        {isSet ? (
          <button 
            onClick={() => sendAlertSMS(roleKey, contact.phone, contact.name)} 
            disabled={loadingContact === roleKey}
            className="bg-[#ef4444] text-white rounded-full px-4 py-1.5 text-sm font-bold shadow-sm disabled:opacity-50 min-w-[70px]"
          >
            {loadingContact === roleKey ? '...' : 'Alert'}
          </button>
        ) : (
          <Link href="/emergency-setup" className="bg-[#ede9fe] text-[#9b5de5] rounded-full p-2">
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="pb-24 min-h-screen relative">
      <Navbar />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all">
          {toastMessage}
        </div>
      )}

      <main className="px-4 pt-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-6">Emergency</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* LEFT TOP: SOS */}
          <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-[0_4px_14px_0_rgba(239,68,68,0.15)] flex justify-between items-center">
            <div>
              <h2 className="text-[#ef4444] font-bold text-xl mb-1">Need Urgent Help?</h2>
              <p className="text-sm text-[#8b8baa] max-w-[200px]">This will alert your emergency contact or nearby assistance.</p>
            </div>
            <button onClick={callForHelp} className="bg-[#ef4444] text-white rounded-full px-5 py-3 font-bold flex items-center gap-2 hover:bg-red-600 shadow-md">
              <Phone className="w-5 h-5 fill-current" />
              Call For help
            </button>
          </div>

          {/* RIGHT TOP: Location & Vibrate */}
          <div className="grid grid-rows-2 gap-4">
            <button onClick={shareLocation} className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm flex items-center gap-4 text-left hover:border-[#c084fc] transition-colors">
              <div className="bg-[#ede9fe] p-3 rounded-full text-[#9b5de5]"><MapPin className="w-6 h-6" /></div>
              <span className="font-bold text-[#1a1a2e]">Share your location with contacts</span>
            </button>
            <button onClick={vibrateAlert} className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm flex items-center gap-4 text-left hover:border-[#c084fc] transition-colors">
              <div className="bg-[#ede9fe] p-3 rounded-full text-[#9b5de5]"><Smartphone className="w-6 h-6" /></div>
              <span className="font-bold text-[#1a1a2e]">SOS vibration pattern</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT BOTTOM: Contacts */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1a1a2e] text-lg">Emergency Contacts</h3>
              <Link href="/emergency-setup" className="text-xs font-bold text-[#9b5de5] hover:underline">Edit Contacts</Link>
            </div>
            <div className="flex flex-col gap-4">
              {renderContactRow('family', 'Family')}
              {renderContactRow('friend', 'Friend')}
              {renderContactRow('caregiver', 'Caregiver')}
            </div>
          </div>

          {/* RIGHT BOTTOM: Pre-written */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-[#1a1a2e] text-lg">Pre-written</h3>
              <p className="text-xs text-[#8b8baa]">Quick emergency messages</p>
            </div>
            <div className="flex flex-col gap-3">
              {EMERGENCY_PHRASES.map((phrase, i) => (
                <button 
                  key={i} 
                  onClick={() => speak(phrase, 'en-IN', 1, 'Female')}
                  className="bg-[#fee2e2] hover:bg-red-200 transition-colors rounded-lg px-3 py-2 flex justify-between items-center"
                >
                  <span className="text-[#b91c1c] text-sm font-medium text-left">{phrase}</span>
                  <Play className="w-4 h-4 text-[#b91c1c] fill-current flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav activePage="emergency" />
    </div>
  );
}
