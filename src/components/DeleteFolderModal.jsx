import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useModalA11y } from "../hooks/useModalA11y.js";

export function DeleteFolderModal({ open, folderName, cardCount = 0, onCancel, onConfirm }) {
  const panelRef = useRef(null);
  const cancelRef = useRef(null);

  useModalA11y({
    open,
    onClose: onCancel,
    containerRef: panelRef,
    initialFocusRef: cancelRef,
  });

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            ref={panelRef}
            className="dialog-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-folder-title"
            aria-describedby="delete-folder-copy"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-dialog-header">
              <div className="delete-dialog-icon">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="eyebrow">Delete Folder</p>
                <h2 id="delete-folder-title">Delete folder &ldquo;{folderName}&rdquo;?</h2>
              </div>
            </div>

            <p className="delete-dialog-copy" id="delete-folder-copy">
              {cardCount > 0
                ? `The ${cardCount} note${cardCount === 1 ? "" : "s"} in this folder will NOT be deleted. They will safely be moved to Unfiled.`
                : "This empty folder will be removed from your notebook."}
            </p>

            <div className="dialog-actions">
              <button
                ref={cancelRef}
                type="button"
                className="button button-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button-danger"
                onClick={onConfirm}
              >
                <Trash2 size={16} />
                Delete Folder
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
