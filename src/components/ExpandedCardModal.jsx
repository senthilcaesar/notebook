import { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, ChevronLeft, ChevronRight, Copy, Link2, Pencil, Pin, Trash2, X } from "lucide-react";
import { parseRichNote, splitHighlightedText, toSafeHref } from "../lib/cards.js";
import { getRailDate, getTagColorVar } from "../lib/tags.js";
import { useModalA11y } from "../hooks/useModalA11y.js";

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function ExpandedCardModal({
  open,
  card,
  cardIndex,
  cardTotal,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  searchQuery,
  onClose,
  onEdit,
  onDelete,
  onCopy,
  onTogglePin,
  onToggleRead,
  onToggleTask,
}) {
  const panelRef = useRef(null);

  useModalA11y({
    open: Boolean(open && card),
    onClose,
    containerRef: panelRef,
  });

  useEffect(() => {
    if (!open || !card) return undefined;

    function handleKeyDown(event) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && hasPrev) {
        event.preventDefault();
        onPrev?.();
      } else if (event.key === "ArrowRight" && hasNext) {
        event.preventDefault();
        onNext?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, card, hasPrev, hasNext, onPrev, onNext]);

  const note = card?.note;
  const date = card?.date;
  const attachments = card?.attachments;

  const richBlocks = useMemo(
    () => (note ? parseRichNote(note) : []),
    [note],
  );

  const { day, month } = useMemo(
    () => (date ? getRailDate(date) : { day: "", month: "" }),
    [date],
  );

  const safeAttachments = useMemo(
    () =>
      (attachments ?? [])
        .map((item) => ({ label: item, href: toSafeHref(item) }))
        .filter((item) => item.href !== null),
    [attachments],
  );

  const railColor = card ? getTagColorVar(card.tags?.[0]) : "var(--tag-2)";

  const renderHighlightedSegments = useCallback(
    (text, keyPrefix) => {
      if (!searchQuery) return text;
      const segments = splitHighlightedText(text, searchQuery);
      return segments.map((seg, sIndex) =>
        seg.type === "highlight" ? (
          <mark key={`${keyPrefix}-hl-${sIndex}`} className="search-highlight">
            {seg.content}
          </mark>
        ) : (
          <span key={`${keyPrefix}-txt-${sIndex}`}>{seg.content}</span>
        ),
      );
    },
    [searchQuery],
  );

  const renderInline = useCallback(
    function renderInline(parts, keyPrefix) {
      return parts.map((part, index) => {
        const key = `${keyPrefix}-${index}`;
        if (part.type === "link") {
          return (
            <a
              key={key}
              href={part.href}
              target="_blank"
              rel="noreferrer"
              className="note-inline-link"
            >
              {part.label}
            </a>
          );
        }

        if (part.type === "code") {
          return (
            <code key={key} className="note-inline-code">
              {part.content}
            </code>
          );
        }

        if (part.type === "strong") {
          return (
            <strong key={key}>
              {renderHighlightedSegments(part.content, `${key}-strong`)}
            </strong>
          );
        }

        return (
          <span key={key}>
            {renderHighlightedSegments(part.content, `${key}-span`)}
          </span>
        );
      });
    },
    [renderHighlightedSegments],
  );

  const cardTitle = card?.title;
  const renderedTitle = useMemo(() => {
    const rawTitle = cardTitle || "Untitled";
    if (!searchQuery) return rawTitle;
    const segments = splitHighlightedText(rawTitle, searchQuery);
    return segments.map((seg, index) =>
      seg.type === "highlight" ? (
        <mark key={`exp-title-hl-${index}`} className="search-highlight">
          {seg.content}
        </mark>
      ) : (
        <span key={`exp-title-txt-${index}`}>{seg.content}</span>
      ),
    );
  }, [cardTitle, searchQuery]);

  if (!card) return null;

  const priorityLabel =
    card.priority && card.priority !== "none"
      ? PRIORITY_LABELS[card.priority] || card.priority
      : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.section
            ref={panelRef}
            className={`expanded-card-modal note-${card.color} ${card.pinned ? "is-pinned" : ""}`}
            style={{ "--rail-color": railColor }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="expanded-card-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="expanded-card-rail">
              <span className="expanded-card-day">{day}</span>
              <span className="expanded-card-month">{month}</span>
              {card.pinned ? (
                <span className="expanded-card-pin-marker" aria-hidden="true">
                  <Pin size={15} />
                </span>
              ) : null}
            </div>

            <div className="expanded-card-content">
              <header className="expanded-card-header">
                <div className="expanded-card-header-left">
                  <div className="expanded-eyebrow-row">
                    <span className="eyebrow">Flashcard Note</span>
                    {card.read ? (
                      <span className="deck-counter deck-read-badge">
                        Read
                      </span>
                    ) : null}
                    {cardTotal > 1 ? (
                      <span className="deck-counter">
                        {cardIndex} of {cardTotal}
                      </span>
                    ) : null}
                  </div>
                  <h2 id="expanded-card-title" className="expanded-card-title">
                    {renderedTitle}
                  </h2>
                </div>

                <div className="expanded-header-actions">
                  {cardTotal > 1 ? (
                    <div className="deck-nav-group">
                      <button
                        type="button"
                        className="icon-button deck-nav-btn"
                        onClick={onPrev}
                        disabled={!hasPrev}
                        aria-label="Previous card (Left Arrow)"
                        title="Previous card (←)"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        className="icon-button deck-nav-btn"
                        onClick={onNext}
                        disabled={!hasNext}
                        aria-label="Next card (Right Arrow)"
                        title="Next card (→)"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="icon-button expanded-close-button"
                    onClick={onClose}
                    aria-label="Close expanded view"
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              <div className="expanded-card-body">
                {richBlocks.length > 0 || safeAttachments.length > 0 ? (
                  <div className="note-rich-content">
                    {richBlocks.map((block, index) => {
                      if (block.type === "heading") {
                        const Tag = block.level === 1 ? "h3" : "h4";
                        return (
                          <Tag
                            key={`block-${index}`}
                            className="expanded-note-heading"
                          >
                            {renderInline(block.content, `heading-${index}`)}
                          </Tag>
                        );
                      }

                      if (block.type === "checklist") {
                        return (
                          <ul
                            key={`block-${index}`}
                            className="note-checklist expanded-checklist"
                          >
                            {block.items.map((item, itemIndex) => (
                              <li
                                key={`task-${index}-${itemIndex}`}
                                className="note-task-item"
                              >
                                <label className="task-label">
                                  <input
                                    type="checkbox"
                                    className="task-checkbox"
                                    checked={item.checked}
                                    onChange={() =>
                                      onToggleTask?.(card, item.taskIndex)
                                    }
                                  />
                                  <span
                                    className={`task-text ${item.checked ? "is-checked" : ""}`}
                                  >
                                    {renderInline(
                                      item.content,
                                      `task-${index}-${itemIndex}`,
                                    )}
                                  </span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      if (block.type === "list") {
                        return (
                          <ul
                            key={`block-${index}`}
                            className="expanded-note-list"
                          >
                            {block.items.map((item, itemIndex) => (
                              <li key={`item-${index}-${itemIndex}`}>
                                {renderInline(item, `list-${index}-${itemIndex}`)}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      return (
                        <p
                          key={`block-${index}`}
                          className="expanded-note-paragraph"
                        >
                          {renderInline(block.content, `para-${index}`)}
                        </p>
                      );
                    })}

                    {safeAttachments.length > 0 ? (
                      <div className="expanded-note-attachments">
                        <span className="expanded-attachments-title">
                          Attachments & Links
                        </span>
                        <div className="expanded-attachments-list">
                          {safeAttachments.map(({ label, href }) => (
                            <a
                              key={label}
                              href={href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="attachment-link"
                            >
                              <Link2 size={14} />
                              <span>{label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="expanded-empty-copy">No note content yet.</p>
                )}
              </div>

              <footer className="expanded-card-footer">
                <div className="expanded-card-meta">
                  {(card.tags || []).map((tag, index) => (
                    <span key={`${card.id}-${tag}`}>
                      {index > 0 ? <span className="meta-sep">· </span> : null}
                      {tag}
                    </span>
                  ))}
                  {priorityLabel ? (
                    <span className={`meta-priority-${card.priority}`}>
                      {card.tags?.length > 0 ? (
                        <span className="meta-sep">· </span>
                      ) : null}
                      {priorityLabel}
                    </span>
                  ) : null}
                </div>

                <div className="expanded-card-actions">
                  <button
                    type="button"
                    className={`button button-secondary ${card.read ? "is-active is-read-active" : ""}`}
                    onClick={() => onToggleRead?.(card)}
                    aria-label={card.read ? "Mark note as unread" : "Mark note as read"}
                  >
                    <CheckCheck size={15} />
                    <span>{card.read ? "Read" : "Mark as read"}</span>
                  </button>
                  <button
                    type="button"
                    className={`button button-secondary ${card.pinned ? "is-active" : ""}`}
                    onClick={() => onTogglePin(card)}
                    aria-label={card.pinned ? "Unpin card" : "Pin card"}
                  >
                    <Pin size={15} />
                    <span>{card.pinned ? "Pinned" : "Pin"}</span>
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => onCopy(card)}
                    aria-label="Copy note"
                  >
                    <Copy size={15} />
                    <span>Copy</span>
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      onClose();
                      onEdit(card);
                    }}
                    aria-label="Edit card"
                  >
                    <Pencil size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="button button-secondary button-danger-hover"
                    onClick={() => {
                      onClose();
                      onDelete(card);
                    }}
                    aria-label="Delete card"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </footer>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
