import { openDB } from 'idb';

const DB_NAME = 'handball-tracking';
const DB_VERSION = 1;
const STORE_NAME = 'games';

export async function getDB() {
  console.log('Trying to open IndexedDB...');
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      console.log('IndexedDB upgrade running...');
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('actions')) {
        db.createObjectStore('actions', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function addGame(gameName) {
  console.log('Saving new game to DB:', gameName);
  const db = await getDB();
  return db.add(STORE_NAME, { name: gameName });
}

export async function getAllGames() {
  console.log('Loading all games from DB...');
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function addAction(action) {
  console.log('Saving action to DB:', action);
  const db = await getDB();
  return db.add('actions', action);
}

export async function getAllActions() {
  console.log('Loading all actions from DB...');
  const db = await getDB();
  return db.getAll('actions');
}
