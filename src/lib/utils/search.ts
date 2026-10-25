/**
 * Text helpers shared by the public menu search (client-side filtering) and the
 * admin item search (server-side PostgREST filtering).
 */

/**
 * Arabic combining marks (harakat, Quranic annotations) plus tatweel. Stripped
 * so a query typed without diacritics still matches stored text that has them.
 */
const ARABIC_MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

/**
 * Letters that are commonly typed interchangeably. Folding them makes search
 * tolerant of "أ / إ / آ → ا", "ى → ي", "ة → ه" and hamza seats, which is how
 * people usually type Arabic in a search box.
 */
const LETTER_FOLDS: Record<string, string> = {
  "أ": "ا",
  "إ": "ا",
  "آ": "ا",
  "ٱ": "ا",
  "ى": "ي",
  "ئ": "ي",
  "ؤ": "و",
  "ة": "ه",
};

/**
 * Normalises text for comparison: lowercases (Latin), strips Arabic marks,
 * folds interchangeable Arabic letters and collapses whitespace.
 */
export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(ARABIC_MARKS, "")
    .replace(/[أإآٱىئةؤ]/g, (letter) => LETTER_FOLDS[letter] ?? letter)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Whether `haystack` matches an already-normalised query. An empty query
 * matches everything, so callers can pass the raw input state safely.
 */
export function matchesNormalizedText(
  haystack: string | null | undefined,
  normalizedQuery: string,
): boolean {
  if (!normalizedQuery) return true;
  if (!haystack) return false;
  return normalizeSearchText(haystack).includes(normalizedQuery);
}

/**
 * Turns a user search term into a PostgREST `ilike` pattern.
 *
 * The term is embedded in an `.or("name.ilike.…,description.ilike.…")` string,
 * so the characters that have meaning in that mini-language (`,` `(` `)` `"`),
 * in LIKE itself (`%` `_`) and the escape character (`\`) are removed rather
 * than escaped. Users searching for such punctuation get a broader match
 * instead of a malformed query.
 *
 * Returns `null` when nothing usable remains, so the caller can skip the
 * filter entirely.
 */
export function toPostgrestLikePattern(term: string): string | null {
  const cleaned = term
    .replace(/[\\%_,()*"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;
  return `%${cleaned}%`;
}

/** Longest accepted search term (public and admin), to bound query cost. */
export const SEARCH_TERM_MAX = 80;
