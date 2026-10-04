import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Folder, X } from "lucide-react";
import { useModalA11y } from "../hooks/useModalA11y.js";

export function FolderModal({
  open,
  mode = "create",
  initialName = "",
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useModalA11y({
    open,
    onClose,
    containerRef: panelRef,
    initialFocusRef: inputRef,
  });

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevInitialName, setPrevInitialName] = useState(initialName);
  if (open !== prevOpen || initialName !== prevInitialName) {
    setPrevOpen(open);
    setPrevInitialName(initialName);
    setName(initialName);
    setError("");
  }

  function handleSubmit(event) {
    event?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a folder name.");
      return;
    }

    try {
      onSubmit(trimmed);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save folder.");
    }
  }

  const isEditing = mode === "rename";

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
            className="dialog-card folder-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="folder-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="folder-modal-heading-wrap">
                <div className="folder-dialog-icon">
                  <Folder size={20} />
                </div>
                <div>
                  <p className="eyebrow">{isEditing ? "Manage Folder" : "New Folder"}</p>
                  <h2 id="folder-modal-title">
                    {isEditing ? "Rename folder" : "Create a folder"}
                  </h2>
                </div>
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

            <form onSubmit={handleSubmit} className="folder-modal-form">
              <label className="field">
                <span>Folder Name</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. Work, Research, Personal"
                />
                {error ? <p className="form-error-msg">{error}</p> : null}
              </label>

              <div className="dialog-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  {isEditing ? "Save changes" : "Create folder"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
