import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getFavourites, saveFavourite as fbSaveFavourite, deleteFavourite as fbDeleteFavourite } from '@/lib/firebase';
import { getCachedFavourites, cacheFavourite, removeCachedFavourite } from '@/lib/offlineCache';

export interface Favourite {
  id: string;
  text: string;
  timestamp: number;
}

export function useFavorites() {
  const { user, loading: authLoading } = useAuth();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    async function load() {
      setLoading(true);
      try {
        if (user) {
          const fbFavs = await getFavourites(user.uid);
          setFavourites(fbFavs);
        } else {
          const localFavs = await getCachedFavourites();
          setFavourites(localFavs as Favourite[]);
        }
      } catch (e) {
        console.error("Failed to load favourites", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, authLoading]);

  const addFavourite = async (phrase: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const ts = Date.now();
    try {
      if (user) {
        const docId = await fbSaveFavourite(user.uid, phrase);
        setFavourites(prev => [{ id: docId, text: phrase, timestamp: ts }, ...prev]);
      } else {
        await cacheFavourite({ id, text: phrase, timestamp: ts });
        setFavourites(prev => [{ id, text: phrase, timestamp: ts }, ...prev]);
      }
    } catch (e) {
      console.error("Failed to add favourite", e);
    }
  };

  const removeFavourite = async (id: string) => {
    try {
      if (user) {
        await fbDeleteFavourite(user.uid, id);
      } else {
        await removeCachedFavourite(id);
      }
      setFavourites(prev => prev.filter(f => f.id !== id));
    } catch(e) {
      console.error("Failed to remove favourite", e);
    }
  };

  return { favourites, addFavourite, removeFavourite, loading };
}
