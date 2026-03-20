import { AnimatePresence, motion } from 'framer-motion';
import {
  Braces,
  CloudCog,
  Code2,
  DatabaseZap,
  PanelsTopLeft,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';
import { getTechStackItems } from '../lib/techStack.js';

const ICONS = {
  react: PanelsTopLeft,
  vite: Sparkles,
  css: WandSparkles,
  firebase: DatabaseZap,
  motion: Braces,
  lucide: Code2,
  deploy: CloudCog,
};

export function TechStackModal({ open, onClose }) {
  const items = getTechStackItems();

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
          <motion.section
            className="dialog-card tech-stack-card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Architecture</p>
                <h2>Project Tech Stack</h2>
                <p className="tech-stack-intro">This app is built using the following technologies:</p>
              </div>

              <button type="button" className="icon-button" onClick={onClose} aria-label="Close tech stack modal">
                <X size={18} />
              </button>
            </div>

            <div className="tech-stack-list">
              {items.map((item) => {
                const Icon = ICONS[item.kind] || Code2;
                return (
                  <div key={item.id} className="tech-stack-item">
                    <div className={`tech-stack-icon tech-stack-icon-${item.kind}`}>
                      <Icon size={18} />
                    </div>
                    <div className="tech-stack-copy">
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
