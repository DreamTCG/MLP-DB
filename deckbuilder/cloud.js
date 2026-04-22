// deckbuilder/cloud.js — Supabase cloud sync API layer
// Pure API functions (no local state). Orchestration (sync, logout, migration)
// stays in index.html to avoid let-scoping issues with _currentDeckId etc.

(function () {
  'use strict';

  function _sb() { return window._supabase || null; }

  async function cloudGetAllDecks() {
    const sb = _sb(); if (!sb) return [];
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return [];
    const { data, error } = await sb.from('decks').select('*').order('updated_at', { ascending: false });
    if (error) { console.error('[cloud] cloudGetAllDecks:', error.message); return []; }
    return data || [];
  }

  async function cloudSaveDeck(localRec) {
    const sb = _sb(); if (!sb) { console.log('[cloud] _supabase not ready'); return null; }
    const { data: { session }, error: sessErr } = await sb.auth.getSession();
    if (sessErr || !session) { console.log('[cloud] no active session, skip save'); return null; }
    const user = session.user;
    const payload = {
      id:         localRec.id,
      user_id:    user.id,
      name:       localRec.name,
      cards_json: localRec.cards_json,
      created_at: localRec.created_at,
      updated_at: localRec.updated_at,
    };
    console.log('[cloud] upserting deck', payload.id, 'for user', user.id);
    const { data, error } = await sb.from('decks')
      .upsert(payload, { onConflict: 'id' })
      .select().single();
    if (error) {
      console.error('[cloud] cloudSaveDeck error:', error.message, error);
      if (error.message && error.message.includes('10 เด็ค')) toast('☁️ Cloud: ครบ 10 เด็คแล้ว', 'warn');
      else toast('☁️ Cloud save ล้มเหลว: ' + error.message, 'warn');
      return null;
    }
    console.log('[cloud] saved OK', data?.id);
    return data;
  }

  async function cloudDeleteDeck(id) {
    const sb = _sb(); if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const { error } = await sb.from('decks').delete().eq('id', id);
    if (error) console.error('[cloud] cloudDeleteDeck:', error.message);
  }

  async function cloudRenameDeck(id, name) {
    const sb = _sb(); if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const { error } = await sb.from('decks').update({ name }).eq('id', id);
    if (error) console.error('[cloud] cloudRenameDeck:', error.message);
  }

  Object.assign(window, { cloudGetAllDecks, cloudSaveDeck, cloudDeleteDeck, cloudRenameDeck });
})();
