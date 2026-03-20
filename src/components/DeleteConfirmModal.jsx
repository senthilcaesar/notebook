import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function DeleteConfirmModal({ open, card, onCancel, onConfirm }) {
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
            className="dialog-card"
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
                <h2>Are you sure?</h2>
              </div>
            </div>

            <p className="delete-dialog-copy">
              This action cannot be undone. The selected note will be removed from your notebook and that deletion will
              sync across your devices.
            </p>

            <div className="delete-dialog-preview">
              <span className="delete-dialog-label">Selected card</span>
              <strong>{card?.title || 'Untitled card'}</strong>
            </div>

            <div className="delete-dialog-warning">
              <AlertTriangle size={16} />
              <span>Delete this only if you are sure you no longer need it.</span>
            </div>

            <div className="dialog-actions">
              <button type="button" className="button button-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="button button-danger" onClick={onConfirm}>
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
