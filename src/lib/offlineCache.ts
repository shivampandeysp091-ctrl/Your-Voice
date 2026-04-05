import { openDB } from 'idb';

const DB_NAME = 'yourvoice-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('phrases')) {
        db.createObjectStore('phrases', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('favourites')) {
        db.createObjectStore('favourites', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
}

// Phrases
export async function cachePhrase(phrase: { id: string; text: string }) {
  const db = await initDB();
  return db.put('phrases', phrase);
}

export async function getCachedPhrases() {
  const db = await initDB();
  return db.getAll('phrases');
}

// Favourites 
export async function cacheFavourite(favourite: { id: string; text: string; timestamp: number }) {
  const db = await initDB();
  return db.put('favourites', favourite);
}

export async function getCachedFavourites() {
  const db = await initDB();
  const all = await db.getAll('favourites');
  return all.sort((a, b) => b.timestamp - a.timestamp);
}

export async function removeCachedFavourite(id: string) {
  const db = await initDB();
  return db.delete('favourites', id);
}

// Settings
export async function saveSettings(settings: any) {
  const db = await initDB();
  return db.put('settings', { key: 'user-settings', ...settings });
}

export async function getSettings() {
  const db = await initDB();
  return db.get('settings', 'user-settings');
}
