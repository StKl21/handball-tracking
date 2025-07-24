import { openDB } from 'idb';

const DB_NAME = 'handball-tracking';
const DB_VERSION = 1;

export const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("games")) {
        db.createObjectStore("games", { keyPath: "name" });
      }
      if (!db.objectStoreNames.contains("actions")) {
        db.createObjectStore("actions", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// SPIELE

export const addGame = async (name, guestTeam, squad, isHome) => {
  const db = await getDB();
  const tx = db.transaction("games", "readwrite");
  await tx.store.put({
    name,
    guestTeam,
    isHome,
    squad: squad || [],
    score: { home: 0, guest: 0 },
  });
  await tx.done;
};

export const getAllGames = async () => {
  const db = await getDB();
  return await db.getAll("games");
};

export const getGameByName = async (name) => {
  const db = await getDB();
  return await db.get("games", name);
};

export const updateGameScore = async (name, home, guest) => {
  const db = await getDB();
  const game = await db.get("games", name);
  if (game) {
    game.score = { home, guest };
    const tx = db.transaction("games", "readwrite");
    await tx.store.put(game);
    await tx.done;
  }
};

// AKTIONEN

export const addAction = async (action) => {
  const db = await getDB();
  const tx = db.transaction("actions", "readwrite");
  tx.store.add(action);
  await tx.done;
};

export const getAllActions = async () => {
  const db = await getDB();
  return await db.getAll("actions");
};
