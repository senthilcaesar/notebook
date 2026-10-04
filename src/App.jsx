import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowLeft, FolderInput, FolderOpen, Plus, X } from "lucide-react";
import { Header } from "./components/Header.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Flashcard } from "./components/Flashcard.jsx";
import { ExpandedCardModal } from "./components/ExpandedCardModal.jsx";
import { CardModal } from "./components/CardModal.jsx";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal.jsx";
import { LoginScreen } from "./components/LoginScreen.jsx";
import { TechStackModal } from "./components/TechStackModal.jsx";
import { ToastRegion } from "./components/ToastRegion.jsx";
import { MoveCardModal } from "./components/MoveCardModal.jsx";
import { FolderModal } from "./components/FolderModal.jsx";
import { DeleteFolderModal } from "./components/DeleteFolderModal.jsx";
import { FolderGrid } from "./components/FolderGrid.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { useCards } from "./hooks/useCards.js";
import { useFolders } from "./hooks/useFolders.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { buildCopyText, getGreeting, toggleTaskInNote } from "./lib/cards.js";

function LoadingScreen() {
  return (
    <main className="loading-screen">
      <div className="loading-card">Loading your notebook…</div>
    </main>
  );
}

export default function App() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const {
    cards,
    loading: cardsLoading,
    syncState,
    addCard,
    updateCard,
    patchCard,
    deleteCard,
  } = useCards(user?.uid);

  const {
    folders,
    folderList,
    unfiledCount,
    allCount,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useFolders(user?.uid, cards);

  const [theme, setTheme] = useLocalStorageState("nb_theme", "light");
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorageState(
    "nb_sidebar_collapsed",
    false,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [activeFolder, setActiveFolder] = useState("__folders_overview__");
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [cardToMove, setCardToMove] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState("create");
  const [folderModalTarget, setFolderModalTarget] = useState("");
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [authError, setAuthError] = useState("");
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
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("resize", updateHeaderState);
    };
  }, []);

  const pushToast = useCallback((message, type = "info") => {
    const id =
      window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  // One-time migration: move existing unfiled cards into the "notes" folder
  useEffect(() => {
    if (!user || cardsLoading || cards.length === 0) return;
    const migrationKey = `nb_migrated_to_notes_${user.uid}`;
    if (localStorage.getItem(migrationKey)) return;

    const unfiledCards = cards.filter((c) => !(c.folder || "").trim());
    if (unfiledCards.length > 0) {
      localStorage.setItem(migrationKey, "true");
      createFolder("notes");
      Promise.all(
        unfiledCards.map((card) => patchCard(card.id, { folder: "notes" })),
      )
        .then(() => {
          pushToast(
            `Moved ${unfiledCards.length} ${unfiledCards.length === 1 ? "note" : "notes"} to "notes" folder`,
            "success",
          );
        })
        .catch((err) => {
          console.error("Migration to notes folder failed:", err);
        });
    }
  }, [user, cardsLoading, cards, createFolder, patchCard, pushToast]);

  const tagList = useMemo(() => {
    const counts = new Map([["All", cards.length]]);
    cards.forEach((card) => {
      (card.tags || []).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort(([left], [right]) => {
        if (left === "All") return -1;
        if (right === "All") return 1;
        return left.localeCompare(right);
      })
      .map(([name, count]) => ({ name, count }));
  }, [cards]);

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...cards]
      .filter((card) => {
        const searchableTags = (card.tags || []).join(" ").toLowerCase();
        const matchesSearch =
          !query ||
          card.title.toLowerCase().includes(query) ||
          card.note.toLowerCase().includes(query) ||
          (card.folder && card.folder.toLowerCase().includes(query)) ||
          searchableTags.includes(query);

        const matchesTag = activeTag === "All" || card.tags.includes(activeTag);

        const matchesFolder =
          activeFolder === "All" ||
          activeFolder === "__folders_overview__" ||
          (activeFolder === "__unfiled__"
            ? !card.folder
            : (card.folder || "").toLowerCase() === activeFolder.toLowerCase());

        return matchesSearch && matchesTag && matchesFolder;
      })
      .sort((left, right) => {
        if (left.pinned !== right.pinned) {
          return left.pinned ? -1 : 1;
        }

        return (right.date || "").localeCompare(left.date || "");
      });
  }, [activeFolder, activeTag, cards, searchQuery]);

  async function handleLogin() {
    try {
      setAuthError("");
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.message || "Sign-in failed.");
    }
  }

  async function handleLogout() {
    await logout();
    pushToast("Signed out", "info");
  }

  async function handleSaveCard(formData) {
    if (!formData.title.trim() && !formData.note.trim()) {
      pushToast("Please add a title or note before saving.", "error");
      return;
    }

    const isEditing = Boolean(editingCard);
    const idToUpdate = editingCard?.id;

    setIsModalOpen(false);
    setEditingCard(null);

    try {
      if (isEditing) {
        await updateCard(idToUpdate, formData);
        pushToast("Card updated", "success");
      } else {
        await addCard(formData);
        pushToast("Card saved", "success");
      }
    } catch (error) {
      console.error("Save failed:", error);
      pushToast("Save failed. Please try again.", "error");
    }
  }

  async function handleDeleteConfirmed() {
    if (!cardToDelete) return;

    const idToDelete = cardToDelete.id;
    setCardToDelete(null);

    try {
      await deleteCard(idToDelete);
      pushToast("Card deleted", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      pushToast("Delete failed. Please try again.", "error");
    }
  }

  // The handlers below are passed to every <Flashcard>, which is memoised.
  // They have to keep a stable identity or the memo does nothing.
  const handleTogglePin = useCallback(
    async (card) => {
      try {
        await patchCard(card.id, { pinned: !card.pinned });
        pushToast(card.pinned ? "Card unpinned" : "Card pinned", "success");
      } catch (error) {
        console.error("Pin update failed:", error);
        pushToast("Could not update pin.", "error");
      }
    },
    [patchCard, pushToast],
  );

  const handleCopy = useCallback(
    async (card) => {
      try {
        await navigator.clipboard.writeText(buildCopyText(card));
        pushToast("Copied to clipboard", "success");
      } catch (error) {
        console.error("Copy failed:", error);
        pushToast("Copy failed.", "error");
      }
    },
    [pushToast],
  );

  const handleToggleTask = useCallback(
    async (card, taskIndex) => {
      const updatedNote = toggleTaskInNote(card.note, taskIndex);
      try {
        await patchCard(card.id, { note: updatedNote });
      } catch (error) {
        console.error("Task update failed:", error);
        pushToast("Could not update checklist task.", "error");
      }
    },
    [patchCard, pushToast],
  );

  const handleToggleRead = useCallback(
    async (card) => {
      try {
        await patchCard(card.id, { read: !card.read });
        pushToast(
          card.read ? "Marked note as unread" : "Marked note as read",
          "success",
        );
      } catch (error) {
        console.error("Read update failed:", error);
        pushToast("Could not update read status.", "error");
      }
    },
    [patchCard, pushToast],
  );

  const handleOpenMoveModal = useCallback((selectedCard) => {
    setCardToMove(selectedCard);
  }, []);

  const handleMoveCard = useCallback(
    async (card, targetFolder) => {
      try {
        const nextFolder = (targetFolder || "").trim();
        await patchCard(card.id, { folder: nextFolder });
        if (nextFolder) {
          pushToast(`Moved to "${nextFolder}"`, "success");
        } else {
          pushToast("Moved to Unfiled", "info");
        }
      } catch (error) {
        console.error("Move failed:", error);
        pushToast("Failed to move note.", "error");
      }
    },
    [patchCard, pushToast],
  );

  const handleCreateFolder = useCallback(
    (name) => {
      try {
        const created = createFolder(name);
        pushToast(`Folder "${created}" created`, "success");
        return created;
      } catch (err) {
        pushToast(err.message || "Could not create folder", "error");
        throw err;
      }
    },
    [createFolder, pushToast],
  );

  const handleRenameFolder = useCallback(
    async (newName) => {
      if (!folderModalTarget) return;
      try {
        await renameFolder(folderModalTarget, newName, patchCard);
        if (activeFolder === folderModalTarget) {
          setActiveFolder(newName);
        }
        pushToast(`Renamed to "${newName}"`, "success");
      } catch (err) {
        pushToast(err.message || "Could not rename folder", "error");
        throw err;
      }
    },
    [activeFolder, folderModalTarget, patchCard, pushToast, renameFolder],
  );

  const handleDeleteFolderConfirmed = useCallback(async () => {
    if (!folderToDelete) return;
    const name = folderToDelete;
    setFolderToDelete(null);
    try {
      await deleteFolder(name, patchCard);
      if (activeFolder === name) {
        setActiveFolder("All");
      }
      pushToast(`Folder "${name}" deleted`, "info");
    } catch (err) {
      console.error("Delete folder error:", err);
      pushToast("Could not delete folder.", "error");
    }
  }, [activeFolder, deleteFolder, folderToDelete, patchCard, pushToast]);

  const handleMoveAllUnfiledToNotes = useCallback(async () => {
    const unfiledCards = cards.filter((c) => !(c.folder || "").trim());
    if (unfiledCards.length === 0) return;

    createFolder("notes");
    try {
      await Promise.all(
        unfiledCards.map((card) => patchCard(card.id, { folder: "notes" })),
      );
      pushToast(
        `Moved ${unfiledCards.length} ${unfiledCards.length === 1 ? "note" : "notes"} to "notes" folder`,
        "success",
      );
      setActiveFolder("notes");
      setActiveTag("All");
    } catch (err) {
      console.error("Move all to notes failed:", err);
      pushToast("Could not move notes.", "error");
    }
  }, [cards, createFolder, patchCard, pushToast]);

  const handleOpenCard = useCallback((selectedCard) => {
    setExpandedCardId(selectedCard.id);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setExpandedCardId(null);
  }, []);

  const handleEditCard = useCallback((selectedCard) => {
    setExpandedCardId(null);
    setEditingCard(selectedCard);
    setIsModalOpen(true);
  }, []);

  const expandedCard = useMemo(
    () => cards.find((card) => card.id === expandedCardId) || null,
    [cards, expandedCardId],
  );

  const currentExpandedIndex = useMemo(
    () => filteredCards.findIndex((card) => card.id === expandedCardId),
    [filteredCards, expandedCardId],
  );

  const hasPrevCard = currentExpandedIndex > 0;
  const hasNextCard =
    currentExpandedIndex >= 0 &&
    currentExpandedIndex < filteredCards.length - 1;

  const handlePrevCard = useCallback(() => {
    if (currentExpandedIndex > 0) {
      setExpandedCardId(filteredCards[currentExpandedIndex - 1].id);
    }
  }, [filteredCards, currentExpandedIndex]);

  const handleNextCard = useCallback(() => {
    if (
      currentExpandedIndex >= 0 &&
      currentExpandedIndex < filteredCards.length - 1
    ) {
      setExpandedCardId(filteredCards[currentExpandedIndex + 1].id);
    }
  }, [filteredCards, currentExpandedIndex]);

  if (authLoading || (user && cardsLoading && cards.length === 0)) {
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
          onToggleTheme={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
          onLogout={handleLogout}
          greeting={getGreeting(user.displayName)}
          isCondensed={isHeaderCondensed}
        />

        <div
          className={`workspace ${sidebarCollapsed ? "is-sidebar-collapsed" : ""}`}
        >
          <Sidebar
            folders={folderList}
            activeFolder={activeFolder}
            onSelectFolder={(folderName) => {
              setActiveFolder(folderName);
              setActiveTag("All");
            }}
            onOpenCreateFolder={() => {
              setFolderModalMode("create");
              setFolderModalTarget("");
              setIsFolderModalOpen(true);
            }}
            onOpenRenameFolder={(name) => {
              setFolderModalMode("rename");
              setFolderModalTarget(name);
              setIsFolderModalOpen(true);
            }}
            onOpenDeleteFolder={(name) => {
              setFolderToDelete(name);
            }}
            unfiledCount={unfiledCount}
            allCount={allCount}
            tags={tagList}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((current) => !current)}
          />

          <main className="board">
            {activeFolder === "__folders_overview__" ? (
              <FolderGrid
                folders={folderList}
                unfiledCount={unfiledCount}
                onSelectFolder={(folderName) => {
                  setActiveFolder(folderName);
                  setActiveTag("All");
                }}
                onCreateFolder={() => {
                  setFolderModalMode("create");
                  setFolderModalTarget("");
                  setIsFolderModalOpen(true);
                }}
                onRenameFolder={(name) => {
                  setFolderModalMode("rename");
                  setFolderModalTarget(name);
                  setIsFolderModalOpen(true);
                }}
                onDeleteFolder={(name) => {
                  setFolderToDelete(name);
                }}
              />
            ) : (
              <>
                {activeFolder !== "All" ? (
                  <div className="folder-view-header">
                    <div className="folder-view-breadcrumb">
                      <button
                        type="button"
                        className="folder-view-back-btn"
                        onClick={() => setActiveFolder("__folders_overview__")}
                        title="Back to all folders"
                      >
                        <ArrowLeft size={14} />
                        <span>Folders</span>
                      </button>
                      <span className="folder-view-separator">/</span>
                      <div className="folder-view-title-wrap">
                        <FolderOpen size={18} />
                        <h2 className="folder-view-title">
                          {activeFolder === "__unfiled__"
                            ? "Unfiled"
                            : activeFolder}
                        </h2>
                        <span className="folder-view-count">
                          ({filteredCards.length}{" "}
                          {filteredCards.length === 1 ? "note" : "notes"})
                        </span>
                      </div>
                    </div>
                    <div className="board-folder-bar-actions">
                      {activeFolder === "__unfiled__" &&
                      filteredCards.length > 0 ? (
                        <button
                          type="button"
                          className="board-folder-action-btn"
                          onClick={handleMoveAllUnfiledToNotes}
                          title="Move all unfiled cards into 'notes'"
                        >
                          <FolderInput size={13} />
                          <span>Move all to &ldquo;notes&rdquo;</span>
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => {
                          setEditingCard(null);
                          setIsModalOpen(true);
                        }}
                      >
                        <Plus size={15} />
                        <span>New Note</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {cardsLoading && cards.length === 0 ? (
                  <div className="empty-board">Syncing cards…</div>
                ) : filteredCards.length === 0 ? (
                  <div className="empty-board">
                    {cards.length === 0
                      ? "No cards yet. Start with your first note."
                      : activeFolder !== "All"
                        ? `No cards in folder "${activeFolder === "__unfiled__" ? "Unfiled" : activeFolder}".`
                        : "No cards match the current search and tag filter."}
                  </div>
                ) : (
                  <LayoutGroup>
                    <motion.section layout className="flashcard-grid">
                      <AnimatePresence initial={false}>
                        {filteredCards.map((card) => (
                          <Flashcard
                            key={card.id}
                            card={card}
                            searchQuery={searchQuery}
                            onOpen={handleOpenCard}
                            onEdit={handleEditCard}
                            onDelete={setCardToDelete}
                            onCopy={handleCopy}
                            onTogglePin={handleTogglePin}
                            onToggleRead={handleToggleRead}
                            onToggleTask={handleToggleTask}
                            onMoveToFolder={handleOpenMoveModal}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.section>
                  </LayoutGroup>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <ExpandedCardModal
        open={Boolean(expandedCard)}
        card={expandedCard}
        cardIndex={currentExpandedIndex + 1}
        cardTotal={filteredCards.length}
        hasPrev={hasPrevCard}
        hasNext={hasNextCard}
        onPrev={handlePrevCard}
        onNext={handleNextCard}
        searchQuery={searchQuery}
        onClose={handleCloseExpanded}
        onEdit={handleEditCard}
        onDelete={setCardToDelete}
        onCopy={handleCopy}
        onTogglePin={handleTogglePin}
        onToggleRead={handleToggleRead}
        onToggleTask={handleToggleTask}
        onMoveToFolder={handleOpenMoveModal}
      />

      <CardModal
        open={isModalOpen}
        card={editingCard}
        defaultFolder={
          activeFolder === "__folders_overview__" ? "notes" : activeFolder
        }
        folders={folders}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        onSubmit={handleSaveCard}
        onCreateFolder={handleCreateFolder}
      />

      <MoveCardModal
        open={Boolean(cardToMove)}
        card={cardToMove}
        folders={folders}
        onClose={() => setCardToMove(null)}
        onMove={handleMoveCard}
        onCreateFolder={handleCreateFolder}
      />

      <FolderModal
        open={isFolderModalOpen}
        mode={folderModalMode}
        initialName={folderModalTarget}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={
          folderModalMode === "rename"
            ? handleRenameFolder
            : handleCreateFolder
        }
      />

      <DeleteFolderModal
        open={Boolean(folderToDelete)}
        folderName={folderToDelete || ""}
        cardCount={
          cards.filter(
            (c) =>
              (c.folder || "").toLowerCase() ===
              (folderToDelete || "").toLowerCase(),
          ).length
        }
        onCancel={() => setFolderToDelete(null)}
        onConfirm={handleDeleteFolderConfirmed}
      />

      <DeleteConfirmModal
        open={Boolean(cardToDelete)}
        card={cardToDelete}
        onCancel={() => setCardToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />

      <TechStackModal
        open={isTechStackOpen}
        onClose={() => setIsTechStackOpen(false)}
        onCopySuccess={(msg) => pushToast(msg, "success")}
      />

      <ToastRegion toasts={toasts} />
    </>
  );
}
