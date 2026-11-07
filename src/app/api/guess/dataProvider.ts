import type { Match, NorwegianPersonItem } from "@/types";

const REQUEST_TIMEOUT_MS = 5000;

function isNorwegianPerson(item: NorwegianPersonItem): boolean {
  // Must be a biography
  if (item.article_type_id !== 2) return false;

  if (typeof item.rank !== "number" || item.rank <= 100) return false;

  // Must mention Norwegian-ness in any relevant field
  const combinedText = [
    item.taxonomy_title || "",
    item.subject_title || "",
    item.first_sentences || "",
    item.snippet || "",
  ].join(" ");
  return /(norsk|norske|norges|norge)/i.test(combinedText);
}

async function fetchDescription(articleUrl: string | undefined): Promise<string | undefined> {
  if (!articleUrl) return undefined;
  try {
    const response = await fetch(articleUrl, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!response.ok) return undefined;
    const article = await response.json();
    return article.metadata?.occupation ?? article.subject_title ?? undefined;
  } catch {
    return undefined;
  }
}

export async function findNorwegianPerson(input: string): Promise<Match> {
  const apiUrl = `https://snl.no/api/v1/search?query=${encodeURIComponent(input)}&limit=5`;
  const response = await fetch(apiUrl, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`SNL search failed with status ${response.status}`);
  }

  const data = await response.json();
  const hits: NorwegianPersonItem[] = Array.isArray(data) ? data : Array.isArray(data?.hits) ? data.hits : [];
  const person = hits.find(isNorwegianPerson);

  if (!person) {
    return { input, name: undefined, description: undefined, correct: false };
  }

  return {
    input,
    name: person.title || person.headword,
    description: await fetchDescription(person.article_url_json),
    correct: true,
  };
}
