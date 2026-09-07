import { useCallback, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Braces,
  Check,
  CloudCog,
  Code2,
  Copy,
  DatabaseZap,
  PanelsTopLeft,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { getTechStackItems } from "../lib/techStack.js";
import { useModalA11y } from "../hooks/useModalA11y.js";

const ICONS = {
  react: PanelsTopLeft,
  vite: Sparkles,
  css: WandSparkles,
  firebase: DatabaseZap,
  motion: Braces,
  lucide: Code2,
  deploy: CloudCog,
};

export function TechStackModal({ open, onClose, onCopySuccess }) {
  const items = getTechStackItems();
  const panelRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useModalA11y({ open, onClose, containerRef: panelRef });

  const handleCopy = useCallback(async () => {
    const summary = items
      .map(
        (item) =>
          `• ${item.name} (${item.category})\n  ${item.description}${
            item.highlights?.length ? `\n  Tags: ${item.highlights.join(", ")}` : ""
          }`,
      )
      .join("\n\n");

    const fullText = `My Notebook Flashcards — Project Tech Stack\n\n${summary}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      onCopySuccess?.("Tech stack copied to clipboard");
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error("Failed to copy tech stack:", error);
    }
  }, [items, onCopySuccess]);

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
            ref={panelRef}
            className="dialog-card tech-stack-card bento-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tech-stack-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header tech-stack-header">
              <div>
                <div className="bento-header-eyebrow">
                  <span className="eyebrow">Architecture & Tooling</span>
                  <span className="bento-count-pill">{items.length} Technologies</span>
                </div>
                <h2 id="tech-stack-title">Project Tech Stack</h2>
                <p className="tech-stack-intro">
                  High-performance stack powering the notebook flashcard application:
                </p>
              </div>

              <div className="bento-header-actions">
                <button
                  type="button"
                  className={`button button-secondary bento-copy-btn ${copied ? "is-active" : ""}`}
                  onClick={handleCopy}
                  aria-label="Copy tech stack to clipboard"
                  title="Copy tech stack details"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? "Copied!" : "Copy Stack"}</span>
                </button>

                <button
                  type="button"
                  className="icon-button"
                  onClick={onClose}
                  aria-label="Close tech stack modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="bento-grid">
              {items.map((item) => {
                const Icon = ICONS[item.kind] || Code2;
                return (
                  <div
                    key={item.id}
                    className={`bento-card bento-card-${item.kind} ${item.span === 2 ? "bento-col-2" : "bento-col-1"}`}
                  >
                    <div className="bento-card-top">
                      <div
                        className={`bento-icon bento-icon-${item.kind}`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="bento-category">{item.category}</span>
                    </div>

                    <div className="bento-card-body">
                      <h3 className="bento-title">{item.name}</h3>
                      <p className="bento-desc">{item.description}</p>
                    </div>

                    {item.highlights?.length ? (
                      <div className="bento-tags">
                        {item.highlights.map((tag) => (
                          <span key={tag} className="bento-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
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
