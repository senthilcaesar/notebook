import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { buildCardPayload, normalizeCard } from '../lib/cards.js';

export function useCards(userId) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState('syncing');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setCards([]);
      setLoading(false);
      setSyncState('syncing');
      return undefined;
    }

    setLoading(true);
    setSyncState('syncing');
    setError(null);

    const cardsQuery = query(
      collection(db, 'users', userId, 'cards'),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      cardsQuery,
      (snapshot) => {
        setCards(snapshot.docs.map(normalizeCard));
        setLoading(false);
        setSyncState('ok');
      },
      (snapshotError) => {
        console.error('Firestore snapshot error:', snapshotError);
        setError(snapshotError);
        setLoading(false);
        setSyncState('error');
      },
    );

    return unsubscribe;
  }, [userId]);

  async function addCard(card) {
    if (!userId) return;
    setSyncState('syncing');
    await addDoc(collection(db, 'users', userId, 'cards'), {
      ...buildCardPayload(card),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateCard(cardId, updates) {
    if (!userId) return;
    setSyncState('syncing');
    await updateDoc(doc(db, 'users', userId, 'cards', cardId), {
      ...buildCardPayload(updates),
      updatedAt: serverTimestamp(),
    });
  }

  async function patchCard(cardId, updates) {
    if (!userId) return;
    setSyncState('syncing');
    await updateDoc(doc(db, 'users', userId, 'cards', cardId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async function deleteCard(cardId) {
    if (!userId) return;
    setSyncState('syncing');
    await deleteDoc(doc(db, 'users', userId, 'cards', cardId));
  }

  return {
    cards,
    loading,
    syncState,
    error,
    addCard,
    updateCard,
    patchCard,
    deleteCard,
  };
}
