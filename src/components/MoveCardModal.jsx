import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Folder, FolderPlus, Inbox, X } from "lucide-react";
import { useModalA11y } from "../hooks/useModalA11y.js";

export function MoveCardModal({
  open,
  card,
  folders = [],
  onClose,
  onMove,
  onCreateFolder,
}) {
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useModalA11y({
    open: Boolean(open && card),
    onClose,
    containerRef: panelRef,
  });

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevCard, setPrevCard] = useState(card);
  if (open !== prevOpen || card !== prevCard) {
    setPrevOpen(open);
    setPrevCard(card);
    setNewFolderName("");
    setIsCreating(false);
    setError("");
  }

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  if (!card) return null;

  const currentFolder = (card.folder || "").trim();

  function handleSelectFolder(targetFolder) {
    onMove?.(card, targetFolder);
    onClose();
  }

  function handleCreateAndMove(event) {
    event?.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      setError("Please enter a folder name.");
      return;
    }

    try {
      setError("");
      onCreateFolder?.(trimmed);
      onMove?.(card, trimmed);
      onClose();
    } catch (err) {
      setError(err.message || "Could not create folder.");
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            className="dialog-card move-card-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-modal-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Move Card</p>
                <h2 id="move-modal-title">Select destination folder</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="move-card-target-preview">
              <span className="eyebrow">Card</span>
              <strong>{card.title || "Untitled card"}</strong>
            </div>

            <div className="move-folder-options">
              <button
                type="button"
                className={`move-folder-option ${!currentFolder ? "is-current" : ""}`}
                onClick={() => handleSelectFolder("")}
              >
                <span className="move-folder-option-name">
                  <Inbox size={16} />
                  <span>Unfiled (No folder)</span>
                </span>
                {!currentFolder ? (
                  <span className="current-badge">
                    <Check size={14} /> Current
                  </span>
                ) : null}
              </button>

              {folders.map((folder) => {
                const isSelected =
                  currentFolder.toLowerCase() === folder.toLowerCase();
                return (
                  <button
                    key={folder}
                    type="button"
                    className={`move-folder-option ${isSelected ? "is-current" : ""}`}
                    onClick={() => handleSelectFolder(folder)}
                  >
                    <span className="move-folder-option-name">
                      <Folder size={16} />
                      <span>{folder}</span>
                    </span>
                    {isSelected ? (
                      <span className="current-badge">
                        <Check size={14} /> Current
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {!isCreating ? (
              <button
                type="button"
                className="create-folder-trigger-btn"
                onClick={() => setIsCreating(true)}
              >
                <FolderPlus size={16} />
                <span>Create new folder & move here…</span>
              </button>
            ) : (
              <form onSubmit={handleCreateAndMove} className="move-new-folder-form">
                <div className="field">
                  <span>New folder name</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Work, Ideas, Study"
                  />
                  {error ? <p className="form-error-msg">{error}</p> : null}
                </div>
                <div className="move-new-folder-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      setIsCreating(false);
                      setNewFolderName("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button button-primary">
                    Create & Move
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
