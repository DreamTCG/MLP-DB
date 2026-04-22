// deckbuilder/db.js — IndexedDB persistence layer
// Extracted from inline script for easier future editing.
// All functions are assigned to window so the rest of the app can call them.

(function () {
  'use strict';

  let _db = null;

  function _openDB() {
    if (_db) return Promise.resolve(_db);
    return new Promise((res, rej) => {
      const req = indexedDB.open('dreamtcg', 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        const store = db.createObjectStore('decks', { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: true });
        store.createIndex('updated_at', 'updated_at');
      };
      req.onsuccess = e => { _db = e.target.result; res(_db); };
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function dbGetAllDecks() {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const req = db.transaction('decks', 'readonly').objectStore('decks').getAll();
      req.onsuccess = () => res((req.result || []).sort((a, b) => a.name.localeCompare(b.name)));
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function dbGetDeck(id) {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const req = db.transaction('decks', 'readonly').objectStore('decks').get(id);
      req.onsuccess = () => res(req.result);
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function dbSaveDeck(deck) {
    const db = await _openDB();
    const now = new Date().toISOString();
    const rec = {
      id:         deck.id || crypto.randomUUID(),
      name:       (deck.name || 'My Deck').slice(0, 30),
      cards_json: {
        mc:    deck.mc ? { id: deck.mc.id, name: deck.mc.name } : null,
        main:  (deck.main  || []).map(c => ({ id: c.id, name: c.name, qty: c.qty })),
        scene: (deck.scene || []).map(c => ({ id: c.id, name: c.name, qty: c.qty })),
        story: (deck.story || [null,null,null,null]).map(c => c ? { id: c.id, name: c.name } : null),
      },
      created_at: deck.created_at || now,
      updated_at: now,
    };
    return new Promise((res, rej) => {
      const req = db.transaction('decks', 'readwrite').objectStore('decks').put(rec);
      req.onsuccess = () => res(rec);
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function dbDeleteDeck(id) {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const req = db.transaction('decks', 'readwrite').objectStore('decks').delete(id);
      req.onsuccess = () => res();
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function dbRenameDeck(id, name) {
    const rec = await dbGetDeck(id);
    if (!rec) return;
    rec.name = name.slice(0, 30);
    rec.updated_at = new Date().toISOString();
    return dbSaveDeck(rec);
  }

  // Expose on window so inline scripts can call them
  Object.assign(window, { _openDB, dbGetAllDecks, dbGetDeck, dbSaveDeck, dbDeleteDeck, dbRenameDeck });
})();
