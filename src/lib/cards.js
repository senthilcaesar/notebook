export function getTodayDateString() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function pickDateValue(rawDate) {
  if (typeof rawDate === 'string' && rawDate) {
    return rawDate.slice(0, 10);
  }

  if (rawDate?.toDate instanceof Function) {
    return rawDate.toDate().toISOString().slice(0, 10);
  }

  return getTodayDateString();
}

export function normalizeCard(doc) {
  const data = doc.data();
  const tags = Array.isArray(data.tags) && data.tags.length > 0
    ? data.tags
    : data.category
      ? [String(data.category)]
      : ['General'];

  return {
    id: doc.id,
    title: data.title ?? '',
    note: data.note ?? '',
    attachments: Array.isArray(data.attachments)
      ? data.attachments.map((item) => String(item).trim()).filter(Boolean)
      : [],
    tags,
    category: data.category ?? '',
    date: pickDateValue(data.date),
    priority: data.priority ?? 'none',
    pinned: Boolean(data.pinned),
    read: Boolean(data.read),
    color: data.color ?? 'cream',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export function buildCardPayload(card) {
  const normalizedTags = (card.tags ?? [])
    .map((tag) => String(tag).trim())
    .filter(Boolean);

  const fallbackTags = normalizedTags.length > 0 ? normalizedTags : ['General'];

  const attachments = (card.attachments ?? [])
    .map((item) => String(item).trim())
    .filter(Boolean);

  return {
    title: String(card.title ?? '').trim(),
    note: String(card.note ?? '').trim(),
    attachments,
    tags: fallbackTags,
    category: fallbackTags[0].toLowerCase(),
    date: card.date || getTodayDateString(),
    priority: card.priority || 'none',
    pinned: Boolean(card.pinned),
    read: Boolean(card.read),
    color: card.color || 'cream',
  };
}

export function buildCopyText(card) {
  return String(card.note ?? '').trim();
}

export function parseAttachmentLines(value) {
  if (value === undefined || value === null) return [];
  return String(value).split('\n');
}

function applyInlineFormatting(text) {
  const parts = [];
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }

    if (match[2] && match[3]) {
      parts.push({ type: 'link', label: match[2], href: match[3] });
    } else if (match[4]) {
      parts.push({ type: 'code', content: match[4] });
    } else if (match[5]) {
      parts.push({ type: 'strong', content: match[5] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

export function parseRichNote(note) {
  const source = String(note ?? '').replace(/\r\n/g, '\n').trim();
  if (!source) return [];

  const lines = source.split('\n');
  const blocks = [];
  let paragraph = [];
  let list = [];
  let checklist = [];
  let nextTaskIndex = 0;

  function flushParagraph() {
    if (paragraph.length === 0) return;
    blocks.push({
      type: 'paragraph',
      content: applyInlineFormatting(paragraph.join(' ')),
    });
    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) return;
    blocks.push({
      type: 'list',
      items: list.map((item) => applyInlineFormatting(item)),
    });
    list = [];
  }

  function flushChecklist() {
    if (checklist.length === 0) return;
    blocks.push({
      type: 'checklist',
      items: checklist,
    });
    checklist = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      flushChecklist();
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      flushChecklist();
      blocks.push({ type: 'heading', level: 2, content: applyInlineFormatting(line.slice(3)) });
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      flushChecklist();
      blocks.push({ type: 'heading', level: 1, content: applyInlineFormatting(line.slice(2)) });
      continue;
    }

    const taskMatch = line.match(/^[-*]\s*\[([ xX])\]\s*(.*)$/);
    if (taskMatch) {
      flushParagraph();
      flushList();
      checklist.push({
        checked: taskMatch[1].toLowerCase() === 'x',
        content: applyInlineFormatting(taskMatch[2]),
        taskIndex: nextTaskIndex++,
      });
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      flushChecklist();
      list.push(line.slice(2));
      continue;
    }

    flushList();
    flushChecklist();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushChecklist();

  return blocks;
}

export function toggleTaskInNote(note, targetTaskIndex) {
  const source = String(note ?? '');
  const lines = source.split('\n');
  let currentTaskIndex = 0;

  const updatedLines = lines.map((line) => {
    const match = line.match(/^(\s*[-*]\s*\[)([ xX])(\]\s*.*)$/);
    if (match) {
      if (currentTaskIndex === targetTaskIndex) {
        const isChecked = match[2].toLowerCase() === 'x';
        const nextMark = isChecked ? ' ' : 'x';
        currentTaskIndex++;
        return `${match[1]}${nextMark}${match[3]}`;
      }
      currentTaskIndex++;
    }
    return line;
  });

  return updatedLines.join('\n');
}

export function splitHighlightedText(text, searchQuery) {
  const rawText = String(text ?? '');
  const query = String(searchQuery ?? '').trim();
  if (!query || !rawText) {
    return [{ type: 'text', content: rawText }];
  }

  const terms = query
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) {
    return [{ type: 'text', content: rawText }];
  }

  const pattern = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: rawText.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'highlight', content: match[0] });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < rawText.length) {
    parts.push({ type: 'text', content: rawText.slice(lastIndex) });
  }

  return parts;
}

export function getGreeting(name) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (name || '').split(' ')[0];
  return firstName ? `${prefix}, ${firstName}` : prefix;
}

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

/**
 * Returns a safe href for a user-supplied attachment, or null if it cannot be
 * made safe. Attachments are free text, so without this a stored
 * `javascript:...` value would execute on click — the inline-link parser in
 * parseRichNote already restricts itself to http(s), and this closes the same
 * hole for the attachment list.
 *
 * A bare host ("example.com/docs") is treated as https rather than discarded,
 * since that is what someone pasting a URL almost always means.
 */
export function toSafeHref(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  let url;
  try {
    url = new URL(raw);
  } catch {
    try {
      url = new URL(`https://${raw}`);
    } catch {
      return null;
    }
  }

  return SAFE_PROTOCOLS.has(url.protocol) ? url.href : null;
}
