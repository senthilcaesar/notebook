import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Link2, Pencil, Pin, Trash2 } from 'lucide-react';
import { formatDisplayDate, parseRichNote } from '../lib/cards.js';
import { TAG_META } from '../lib/constants.js';

const PRIORITY_META = {
  low: { label: 'Low', tone: 'priority-low' },
  medium: { label: 'Medium', tone: 'priority-medium' },
  high: { label: 'High', tone: 'priority-high' },
  critical: { label: 'Critical', tone: 'priority-critical' },
};

function getTagMeta(tag) {
  return TAG_META[tag.toLowerCase()] || { label: tag, tone: 'general' };
}

export function Flashcard({ card, onEdit, onDelete, onCopy, onTogglePin }) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const noteRef = useRef(null);

  useEffect(() => {
    const element = noteRef.current;
    if (!element) return;
    setCanExpand(element.scrollHeight > 186);
  }, [card.attachments, card.note]);

  const richBlocks = parseRichNote(card.note);

  function renderInline(parts, keyPrefix) {
    return parts.map((part, index) => {
      const key = `${keyPrefix}-${index}`;
      if (part.type === 'link') {
        return (
          <a key={key} href={part.href} target="_blank" rel="noreferrer" className="note-inline-link">
            {part.label}
          </a>
        );
      }

      if (part.type === 'code') {
        return (
          <code key={key} className="note-inline-code">
            {part.content}
          </code>
        );
      }

      if (part.type === 'strong') {
        return <strong key={key}>{part.content}</strong>;
      }

      return <span key={key}>{part.content}</span>;
    });
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      whileHover={{ y: -4 }}
      className={`flashcard note-${card.color} ${card.pinned ? 'is-pinned' : ''}`}
    >
      <div className="flashcard-holes" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={`${card.id}-${index}`} className="flashcard-hole" />
        ))}
      </div>

      <div className="flashcard-inner">
        <header className="flashcard-header">
          <span className="flashcard-date">{formatDisplayDate(card.date)}</span>
          <div className="flashcard-badges">
            {card.priority && card.priority !== 'none' ? (
              <span className={`badge badge-priority badge-${PRIORITY_META[card.priority]?.tone || 'priority-medium'}`}>
                {PRIORITY_META[card.priority]?.label || card.priority}
              </span>
            ) : null}
            {card.tags.map((tag) => {
              const meta = getTagMeta(tag);
              return (
                <span key={`${card.id}-${tag}`} className={`badge badge-${meta.tone}`}>
                  {meta.label}
                </span>
              );
            })}
          </div>
        </header>

        <h3 className="flashcard-title">{card.title || 'Untitled'}</h3>

        <div className="flashcard-body">
          <div
            ref={noteRef}
            className={`flashcard-note ${expanded ? 'is-expanded' : ''}`}
            style={canExpand && !expanded ? { maxHeight: '186px' } : undefined}
          >
            {richBlocks.length > 0 || card.attachments?.length ? (
              <div className="note-rich-content">
                {richBlocks.map((block, index) => {
                  if (block.type === 'heading') {
                    const Tag = block.level === 1 ? 'h4' : 'h5';
                    return (
                      <Tag key={`block-${index}`} className="note-heading">
                        {renderInline(block.content, `heading-${index}`)}
                      </Tag>
                    );
                  }

                  if (block.type === 'list') {
                    return (
                      <ul key={`block-${index}`} className="note-list">
                        {block.items.map((item, itemIndex) => (
                          <li key={`item-${index}-${itemIndex}`}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>
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
                        <Link2 size={14} />
                        <span>{attachment}</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              'No note content yet.'
            )}
          </div>
          {canExpand ? (
            <button type="button" className="read-more-button" onClick={() => setExpanded((value) => !value)}>
              {expanded ? 'Show less' : 'Read more'}
            </button>
          ) : null}
        </div>

        <footer className="flashcard-footer">
          <button
            type="button"
            className={`icon-button ${card.pinned ? 'is-active' : ''}`}
            onClick={() => onTogglePin(card)}
            aria-label={card.pinned ? 'Unpin card' : 'Pin card'}
          >
            <Pin size={16} />
          </button>
          <button type="button" className="icon-button" onClick={() => onEdit(card)} aria-label="Edit card">
            <Pencil size={16} />
          </button>
          <button type="button" className="icon-button" onClick={() => onCopy(card)} aria-label="Copy card">
            <Copy size={16} />
          </button>
          <button type="button" className="icon-button" onClick={() => onDelete(card)} aria-label="Delete card">
            <Trash2 size={16} />
          </button>
        </footer>
      </div>
    </motion.article>
  );
}
