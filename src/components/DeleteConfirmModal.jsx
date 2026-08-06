import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useModalA11y } from "../hooks/useModalA11y.js";

export function DeleteConfirmModal({ open, card, onCancel, onConfirm }) {
  const panelRef = useRef(null);
  const cancelRef = useRef(null);

  // Focus lands on Cancel, not Delete — this dialog is the last stop before an
  // irreversible action, so the safe choice should be the one Enter triggers.
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
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-copy"
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
                <p className="eyebrow">Delete Card</p>
                <h2 id="delete-modal-title">Are you sure?</h2>
              </div>
            </div>

            <p className="delete-dialog-copy" id="delete-modal-copy">
              This action cannot be undone. The selected note will be removed
              from your notebook and that deletion will sync across your
              devices.
            </p>

            <div className="delete-dialog-preview">
              <span className="delete-dialog-label">Selected card</span>
              <strong>{card?.title || "Untitled card"}</strong>
            </div>

            <div className="delete-dialog-warning">
              <AlertTriangle size={16} />
              <span>
                Delete this only if you are sure you no longer need it.
              </span>
            </div>

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
                Delete Forever
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
