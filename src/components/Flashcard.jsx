import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Link2, Pencil, Pin, Trash2 } from "lucide-react";
import { parseRichNote } from "../lib/cards.js";
import { getRailDate, getTagColorVar } from "../lib/tags.js";

// Roughly six lines of note before the card collapses and offers "Read more".
// Matches .flashcard-note's 0.92rem/1.7 in card.css.
const COLLAPSED_NOTE_HEIGHT = 150;

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

function FlashcardComponent({ card, onEdit, onDelete, onCopy, onTogglePin }) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const noteRef = useRef(null);

  useEffect(() => {
    const element = noteRef.current;
    if (!element) return;
    setCanExpand(element.scrollHeight > COLLAPSED_NOTE_HEIGHT);
  }, [card.attachments, card.note]);

  // Markdown parsing is the most expensive thing this component does, and the
  // note only changes on edit — not on every re-render from a search keystroke.
  const richBlocks = useMemo(() => parseRichNote(card.note), [card.note]);

  const { day, month } = useMemo(() => getRailDate(card.date), [card.date]);

  // The rail takes its colour from the first tag, which is the tag the sidebar
  // groups by, so the colour and the filter always agree.
  const railColor = getTagColorVar(card.tags?.[0]);

  const renderInline = useCallback(function renderInline(parts, keyPrefix) {
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
        return <strong key={key}>{part.content}</strong>;
      }

      return <span key={key}>{part.content}</span>;
    });
  }, []);

  const priorityLabel =
    card.priority && card.priority !== "none"
      ? PRIORITY_LABELS[card.priority] || card.priority
      : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`flashcard note-${card.color} ${card.pinned ? "is-pinned" : ""}`}
      style={{ "--rail-color": railColor }}
    >
      <div className="flashcard-rail">
        <span className="flashcard-day">{day}</span>
        <span className="flashcard-month">{month}</span>
        {card.pinned ? (
          <span className="flashcard-pin-marker" aria-hidden="true">
            <Pin size={13} />
          </span>
        ) : null}
      </div>

      <h3 className="flashcard-title">{card.title || "Untitled"}</h3>

      <div
        ref={noteRef}
        className={`flashcard-note ${canExpand && !expanded ? "is-clamped" : ""}`}
        style={
          canExpand && !expanded
            ? { maxHeight: `${COLLAPSED_NOTE_HEIGHT}px` }
            : undefined
        }
      >
        {richBlocks.length > 0 || card.attachments?.length ? (
          <div className="note-rich-content">
            {richBlocks.map((block, index) => {
              if (block.type === "heading") {
                const Tag = block.level === 1 ? "h4" : "h5";
                return (
                  <Tag key={`block-${index}`} className="note-heading">
                    {renderInline(block.content, `heading-${index}`)}
                  </Tag>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={`block-${index}`} className="note-list">
                    {block.items.map((item, itemIndex) => (
                      <li key={`item-${index}-${itemIndex}`}>
                        {renderInline(item, `list-${index}-${itemIndex}`)}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={`block-${index}`} className="note-paragraph">
                  {renderInline(block.content, `para-${index}`)}
                </p>
              );
            })}

            {card.attachments?.length ? (
              <div className="note-attachments">
                {card.attachments.map((attachment) => (
                  <a
                    key={attachment}
                    href={attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="attachment-link"
                  >
                    <Link2 size={13} />
                    <span>{attachment}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          "No note content yet."
        )}
      </div>

      {canExpand ? (
        <button
          type="button"
          className="read-more-button"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}

      <footer className="flashcard-footer">
        <div className="flashcard-meta">
          {card.tags.map((tag, index) => (
            <span key={`${card.id}-${tag}`}>
              {index > 0 ? <span className="meta-sep">· </span> : null}
              {tag}
            </span>
          ))}
          {priorityLabel ? (
            <span className={`meta-priority-${card.priority}`}>
              {card.tags.length > 0 ? <span className="meta-sep">· </span> : null}
              {priorityLabel}
            </span>
          ) : null}
        </div>

      <div className="flashcard-actions">
        <button
          type="button"
          className={`icon-button ${card.pinned ? "is-active" : ""}`}
          onClick={() => onTogglePin(card)}
          aria-label={card.pinned ? "Unpin card" : "Pin card"}
        >
          <Pin size={14} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(card)}
          aria-label="Edit card"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => onCopy(card)}
          aria-label="Copy card"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => onDelete(card)}
          aria-label="Delete card"
        >
          <Trash2 size={14} />
        </button>
      </div>
      </footer>
    </motion.article>
  );
}

export const Flashcard = memo(FlashcardComponent);
