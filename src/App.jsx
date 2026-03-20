import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { motion } from 'framer-motion';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Flashcard } from './components/Flashcard.jsx';
import { CardModal } from './components/CardModal.jsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';
import { LoginScreen } from './components/LoginScreen.jsx';
import { TechStackModal } from './components/TechStackModal.jsx';
import { ToastRegion } from './components/ToastRegion.jsx';
import { useAuth } from './hooks/useAuth.js';
import { useCards } from './hooks/useCards.js';
import { useLocalStorageState } from './hooks/useLocalStorageState.js';
import { buildCopyText, getGreeting } from './lib/cards.js';

function LoadingScreen() {
  return (
    <main className="loading-screen">
      <div className="loading-card">Loading your notebook…</div>
    </main>
  );
}

export default function App() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const { cards, loading: cardsLoading, syncState, addCard, updateCard, patchCard, deleteCard } = useCards(user?.uid);

  const [theme, setTheme] = useLocalStorageState('nb_theme', 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorageState('nb_sidebar_collapsed', false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [editingCard, setEditingCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    function updateHeaderState() {
      const isMobile = window.innerWidth <= 720;
      setIsHeaderCondensed(isMobile && window.scrollY > 48);
    }

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);

    return () => {
      window.removeEventListener('scroll', updateHeaderState);
      window.removeEventListener('resize', updateHeaderState);
    };
  }, []);

  function pushToast(message, type = 'info') {
    const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  }

  const tagList = useMemo(() => {
    const counts = new Map([['All', cards.length]]);
    cards.forEach((card) => {
      (card.tags || []).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort(([left], [right]) => {
        if (left === 'All') return -1;
        if (right === 'All') return 1;
        return left.localeCompare(right);
      })
      .map(([name, count]) => ({ name, count }));
  }, [cards]);

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...cards]
      .filter((card) => {
        const searchableTags = (card.tags || []).join(' ').toLowerCase();
        const matchesSearch =
          !query ||
          card.title.toLowerCase().includes(query) ||
          card.note.toLowerCase().includes(query) ||
          searchableTags.includes(query);
        const matchesTag = activeTag === 'All' || card.tags.includes(activeTag);

        return matchesSearch && matchesTag;
      })
      .sort((left, right) => {
        if (left.pinned !== right.pinned) {
          return left.pinned ? -1 : 1;
        }

        return (right.date || '').localeCompare(left.date || '');
      });
  }, [activeTag, cards, searchQuery]);

  async function handleLogin() {
    try {
      setAuthError('');
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(error.message || 'Sign-in failed.');
    }
  }

  async function handleLogout() {
    await logout();
    pushToast('Signed out', 'info');
  }

  async function handleSaveCard(formData) {
    if (!formData.title.trim() && !formData.note.trim()) {
      pushToast('Please add a title or note before saving.', 'error');
      return;
    }

    try {
      if (editingCard) {
        await updateCard(editingCard.id, formData);
        pushToast('Card updated', 'success');
      } else {
        await addCard(formData);
        pushToast('Card saved', 'success');
      }

      setIsModalOpen(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Save failed:', error);
      pushToast('Save failed. Please try again.', 'error');
    }
  }

  async function handleDeleteConfirmed() {
    if (!cardToDelete) return;

    try {
      await deleteCard(cardToDelete.id);
      pushToast('Card deleted', 'success');
      setCardToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      pushToast('Delete failed. Please try again.', 'error');
    }
  }

  async function handleTogglePin(card) {
    try {
      await patchCard(card.id, { pinned: !card.pinned });
      pushToast(card.pinned ? 'Card unpinned' : 'Card pinned', 'success');
    } catch (error) {
      console.error('Pin update failed:', error);
      pushToast('Could not update pin.', 'error');
    }
  }

  async function handleCopy(card) {
    try {
      await navigator.clipboard.writeText(buildCopyText(card));
      pushToast('Copied to clipboard', 'success');
    } catch (error) {
      console.error('Copy failed:', error);
      pushToast('Copy failed.', 'error');
    }
  }

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} errorMessage={authError} />
        <ToastRegion toasts={toasts} />
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreate={() => {
            setEditingCard(null);
            setIsModalOpen(true);
          }}
          onOpenTechStack={() => setIsTechStackOpen(true)}
          syncState={syncState}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          onLogout={handleLogout}
          greeting={getGreeting(user.displayName)}
          isCondensed={isHeaderCondensed}
        />

        <div className={`workspace ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
          <Sidebar
            tags={tagList}
            activeTag={activeTag}
            onSelect={setActiveTag}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((current) => !current)}
          />

          <main className="board">
            {cardsLoading ? (
              <div className="empty-board">Syncing cards…</div>
            ) : filteredCards.length === 0 ? (
              <div className="empty-board">
                {cards.length === 0
                  ? 'No cards yet. Start with your first note.'
                  : 'No cards match the current search and tag filter.'}
              </div>
            ) : (
              <LayoutGroup>
                <motion.section layout className="flashcard-grid">
                  <AnimatePresence>
                    {filteredCards.map((card) => (
                      <Flashcard
                        key={card.id}
                        card={card}
                        onEdit={(selectedCard) => {
                          setEditingCard(selectedCard);
                          setIsModalOpen(true);
                        }}
                        onDelete={setCardToDelete}
                        onCopy={handleCopy}
                        onTogglePin={handleTogglePin}
                      />
                    ))}
                  </AnimatePresence>
                </motion.section>
              </LayoutGroup>
            )}
          </main>
        </div>
      </div>

      <CardModal
        open={isModalOpen}
        card={editingCard}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        onSubmit={handleSaveCard}
      />

      <DeleteConfirmModal
        open={Boolean(cardToDelete)}
        card={cardToDelete}
        onCancel={() => setCardToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />

      <TechStackModal open={isTechStackOpen} onClose={() => setIsTechStackOpen(false)} />

      <ToastRegion toasts={toasts} />
    </>
  );
}
