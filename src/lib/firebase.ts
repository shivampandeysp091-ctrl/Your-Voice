import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Helpers
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logOut = () => signOut(auth);

// Favourites Helpers
export const saveFavourite = async (userId: string, phrase: string) => {
  const docRef = await addDoc(collection(db, `favourites/${userId}/phrases`), {
    text: phrase,
    timestamp: Date.now()
  });
  return docRef.id;
};

export const getFavourites = async (userId: string) => {
  const querySnapshot = await getDocs(collection(db, `favourites/${userId}/phrases`));
  const docs: { id: string; text: string; timestamp: number }[] = [];
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() } as any);
  });
  return docs.sort((a, b) => b.timestamp - a.timestamp);
};

export const deleteFavourite = async (userId: string, phraseId: string) => {
  await deleteDoc(doc(db, `favourites/${userId}/phrases`, phraseId));
};

// Emergency Contacts Helper
export interface Contact {
  name: string;
  role: string;
  phone: string;
}

export const saveEmergencyContacts = async (userId: string, contacts: Contact[]) => {
  await setDoc(doc(db, `users/${userId}/emergencyContacts`, 'main'), { contacts });
};

export const getEmergencyContacts = async (userId: string): Promise<Contact[]> => {
  const snap = await getDoc(doc(db, `users/${userId}/emergencyContacts`, 'main'));
  return snap.exists() ? snap.data().contacts : [];
};

// User Settings Helper
export interface Settings {
  language: string;
  fontSize: number;
  mode: 'light' | 'dark' | 'high-contrast';
  voiceGender: 'Male' | 'Female';
  speechSpeed: number;
}

export const saveUserSettings = async (userId: string, settings: Settings) => {
  await setDoc(doc(db, `users/${userId}/settings`, 'main'), settings);
};

export const getUserSettings = async (userId: string): Promise<Settings | null> => {
  const snap = await getDoc(doc(db, `users/${userId}/settings`, 'main'));
  return snap.exists() ? (snap.data() as Settings) : null;
};
