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
    color: card.color || 'cream',
  };
}

export function formatDisplayDate(dateString) {
  if (!dateString) return 'No date';

  const parsed = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return 'No date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
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

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 2, content: applyInlineFormatting(line.slice(3)) });
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 1, content: applyInlineFormatting(line.slice(2)) });
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function getGreeting(name) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (name || '').split(' ')[0];
  return firstName ? `${prefix}, ${firstName}` : prefix;
}
