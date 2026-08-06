/*
 * Tags are free-form — you can type anything into the tag field — so a card's
 * rail colour can't come from a fixed lookup table. Named tags keep the colour
 * they have always had; anything else hashes onto the same eight-slot palette,
 * so a given tag is always the same colour on every card and across devices.
 */

const TAG_SLOTS = 8;

const NAMED_TAGS = {
  coding: 0,
  prompt: 1,
  general: 2,
  research: 3,
  other: 4,
};

export function getTagColorIndex(tag) {
  const key = String(tag ?? "")
    .trim()
    .toLowerCase();
  if (!key) return 2;

  if (key in NAMED_TAGS) return NAMED_TAGS[key];

  // djb2, kept small and stable — the exact hash matters less than that it
  // never changes, because a tag switching colour between sessions is worse
  // than any particular assignment.
  let hash = 5381;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash << 5) + hash + key.charCodeAt(index)) >>> 0;
  }

  return hash % TAG_SLOTS;
}

export function getTagColorVar(tag) {
  return `var(--tag-${getTagColorIndex(tag)})`;
}

/** Day + short month, for the card's margin rail. */
export function getRailDate(dateString) {
  if (!dateString) return { day: "--", month: "" };

  const parsed = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return { day: "--", month: "" };

  return {
    day: String(parsed.getDate()).padStart(2, "0"),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(parsed),
  };
}
