/**
 * Scores a candidate against a query for the command palette. Higher is better; 0 means no match.
 * Substring match in the primary label ranks above a keyword-only match, which ranks above a
 * loose in-order subsequence match (typo/abbreviation tolerance) — plenty for a ~12-item list.
 */
export function fuzzyScore(query: string, label: string, keywords = ''): number {
  const q = query.trim().toLowerCase()
  if (!q) return 1

  const l = label.toLowerCase()
  if (l.includes(q)) return 3

  const k = keywords.toLowerCase()
  if (k.includes(q)) return 2

  if (isSubsequence(q, l) || isSubsequence(q, k)) return 1

  return 0
}

function isSubsequence(query: string, text: string): boolean {
  let i = 0
  for (let j = 0; j < text.length && i < query.length; j++) {
    if (text[j] === query[i]) i++
  }
  return i === query.length
}
