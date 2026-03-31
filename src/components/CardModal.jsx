import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pin, X } from 'lucide-react';
import { COLOR_OPTIONS, PRIORITY_OPTIONS } from '../lib/constants.js';
import { getTodayDateString, parseAttachmentLines } from '../lib/cards.js';

function getInitialForm(card) {
  if (!card) {
    return {
      title: '',
      note: '',
      attachmentsText: '',
      date: getTodayDateString(),
      tags: ['General'],
      priority: 'none',
      pinned: false,
      color: 'cream',
    };
  }

  return {
    title: card.title || '',
    note: card.note || '',
    attachmentsText: Array.isArray(card.attachments) ? card.attachments.join('\n') : '',
    date: card.date || getTodayDateString(),
    tags: card.tags?.length ? card.tags : ['General'],
    priority: card.priority || 'none',
    pinned: Boolean(card.pinned),
    color: card.color || 'cream',
  };
}

export function CardModal({ open, card, onClose, onSubmit }) {
  const [form, setForm] = useState(getInitialForm(card));
  const [tagDraft, setTagDraft] = useState('');
  const titleRef = useRef(null);

  function handleSave() {
    const payload = {
      ...form,
      attachments: parseAttachmentLines(form.attachmentsText),
    };
    delete payload.attachmentsText;
    onSubmit(payload);
  }

  useEffect(() => {
    setForm(getInitialForm(card));
  }, [card]);

  useEffect(() => {
    if (!open) return undefined;
    const timeoutId = window.setTimeout(() => {
      titleRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form, onClose, onSubmit, open]);

  function commitTag() {
    const nextTag = tagDraft.trim().replace(/,$/, '');
    if (!nextTag) return;
    if (form.tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
      setTagDraft('');
      return;
    }

    setForm((current) => ({ ...current, tags: [...current.tags, nextTag] }));
    setTagDraft('');
  }

  function removeTag(tagToRemove) {
    setForm((current) => {
      const nextTags = current.tags.filter((tag) => tag !== tagToRemove);
      return { ...current, tags: nextTags.length > 0 ? nextTags : ['General'] };
    });
  }

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
            className="modal-card"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{card ? 'Edit card' : 'New flashcard'}</p>
                <h2>{card ? 'Update your note' : 'Capture a new note'}</h2>
              </div>
              <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <label className="field">
                <span>Title</span>
                <input
                  ref={titleRef}
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Topic or heading"
                />
              </label>

              <label className="field">
                <span>Note</span>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                  placeholder={'Jot down the idea, reminder, or summary\nUse # headings, - lists, **bold**, `code`, or [links](https://...)'}
                  rows={7}
                />
              </label>

              <label className="field">
                <span>Attachments / links</span>
                <textarea
                  value={form.attachmentsText}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      attachmentsText: event.target.value,
                    }))
                  }
                  placeholder={'Add one URL per line\nhttps://example.com\nhttps://github.com/...'}
                  rows={4}
                />
              </label>

              <div className="field">
                <span>Tags</span>
                <div className="tag-input-shell">
                  <div className="tag-chip-list">
                    {form.tags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        className="tag-chip"
                        onClick={() => removeTag(tag)}
                        title={`Remove ${tag}`}
                      >
                        {tag}
                        <X size={12} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagDraft}
                    onChange={(event) => setTagDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ',') {
                        event.preventDefault();
                        commitTag();
                      }
                      if (event.key === 'Backspace' && !tagDraft && form.tags.length > 1) {
                        removeTag(form.tags[form.tags.length - 1]);
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                  />
                </div>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  />
                </label>

                <label className="field">
                  <span>Priority</span>
                  <select
                    value={form.priority}
                    onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="field">
                <span>Card color</span>
                <div className="color-picker">
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`color-swatch color-${option.value} ${form.color === option.value ? 'is-selected' : ''}`}
                      onClick={() => setForm((current) => ({ ...current, color: option.value }))}
                      aria-label={`Use ${option.label}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`pin-toggle ${form.pinned ? 'is-active' : ''}`}
                onClick={() => setForm((current) => ({ ...current, pinned: !current.pinned }))}
              >
                <span className="pin-toggle-icon">
                  <Pin size={16} />
                </span>
                <span className="pin-toggle-copy">
                  <strong>{form.pinned ? 'Pinned to top' : 'Pin this card'}</strong>
                  <span>{form.pinned ? 'This note will stay above regular cards.' : 'Keep this note easy to find in your notebook.'}</span>
                </span>
              </button>
            </div>

            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="button button-primary" onClick={handleSave}>
                Save Card
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
