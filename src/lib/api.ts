import { FetchOpportunitiesParams, Opportunity, OpportunityResponse } from "@/types/opportunity";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";
const OPPORTUNITIES_BASE_PATH = "/api/opportunities";

function decodeHtmlEntities(value: string): string {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  return value.replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, (entity) => entities[entity] || entity);
}

function htmlToReadableText(value: string): string {
  if (!value) return "";

  const withListBreaks = value
    .replace(/^\s*#\s*(?=<)/, "")
    .replace(/<\s*li\s*>/gi, "\n- ")
    .replace(/<\s*\/\s*li\s*>/gi, "")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/\s*p\s*>/gi, "\n")
    .replace(/<\s*p[^>]*>/gi, "")
    .replace(/<\s*\/\s*div\s*>/gi, "\n")
    .replace(/<\s*div[^>]*>/gi, "");

  const withoutTags = withListBreaks.replace(/<[^>]+>/g, " ");
  const decoded = decodeHtmlEntities(withoutTags);

  return decoded
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function extractListItemsFromHtml(value: string): string[] {
  const items: string[] = [];
  const regex = /<\s*li[^>]*>([\s\S]*?)<\s*\/\s*li\s*>/gi;
  let match: RegExpExecArray | null = regex.exec(value);

  while (match) {
    const content = htmlToReadableText(match[1] || "");
    if (content) {
      items.push(content.replace(/^[-#\s]+/, "").trim());
    }
    match = regex.exec(value);
  }

  return items;
}

function normalizeTags(rawTags: string[] | undefined): string[] {
  if (!rawTags?.length) return [];

  const normalized = rawTags.flatMap((tag) => {
    if (!tag) return [];

    const extractedItems = extractListItemsFromHtml(tag);
    if (extractedItems.length > 0) {
      return extractedItems;
    }

    const cleaned = htmlToReadableText(tag).replace(/^[-#\s]+/, "").trim();
    return cleaned ? [cleaned] : [];
  });

  return Array.from(new Set(normalized));
}

/**
 * Normalize an opportunity from the API response to add computed UI-friendly fields.
 */
function normalizeOpportunity(opp: Opportunity): Opportunity {
  const remoteValue = (opp.remoteOpportunity || "").toLowerCase();
  const isRemote = remoteValue === "remote" || remoteValue === "true";

  return {
    ...opp,
    remoteType: isRemote ? "remote" : "onsite",
    stipend: opp.salary ? `$${opp.salary} ${opp.salaryPeriodicity || ""}`.trim() : undefined,
    duration: opp.duration || "Not specified",
    country: opp.country || "Not specified",
    description: htmlToReadableText(opp.description || "") || "No description provided.",
    tags: normalizeTags(opp.tags),
    startDate: opp.startDate || null,
  };
}

/**
 * Fetches a list of opportunities from the backend API.
 */
export async function fetchOpportunities(params: FetchOpportunitiesParams = {}): Promise<OpportunityResponse> {
  const query = new URLSearchParams();

  if (params.q) query.set("q", params.q);
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (!params.q && params.category) query.set("q", params.category);
  if (params.country) query.set("country", params.country);
  if (params.status) query.set("status", params.status);

  // Backend currently applies this filter only for remote=true.
  if (params.remote === true || params.remoteType?.toLowerCase() === "remote") {
    query.set("remote", "true");
  }

  // Backend currently applies this filter only for paid=true.
  if (params.paid === true || params.paid?.toString().toLowerCase() === "paid") {
    query.set("paid", "true");
  }

  const queryString = query.toString();
  const url = `${API_BASE}${OPPORTUNITIES_BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch opportunities (${response.status})`);
  }

  const json: OpportunityResponse = await response.json();
  let normalized = json.data.map(normalizeOpportunity);

  // Apply fallback filters client-side for UI options not fully supported by backend.
  if (params.remoteType && params.remoteType.toLowerCase() !== "remote") {
    normalized = normalized.filter(
      (opp) => opp.remoteType?.toLowerCase() === params.remoteType?.toLowerCase()
    );
  }

  if (params.paid?.toString().toLowerCase() === "unpaid") {
    normalized = normalized.filter((opp) => !opp.paid);
  }

  if (params.duration) {
    normalized = normalized.filter(
      (opp) => opp.duration?.toLowerCase() === params.duration?.toLowerCase()
    );
  }

  if (params.sortBy === "oldest") {
    normalized = [...normalized].sort((a, b) => {
      const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
      const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
      return aTime - bTime;
    });
  }

  if (params.sortBy === "latest") {
    normalized = [...normalized].sort((a, b) => {
      const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
      const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
      return bTime - aTime;
    });
  }

  return {
    data: normalized,
    paging: json.paging,
  };
}

/**
 * Fetches a single opportunity by ID from the backend API.
 */
export async function fetchOpportunityById(id: string): Promise<Opportunity | null> {
  try {
    const response = await fetch(`${API_BASE}${OPPORTUNITIES_BASE_PATH}/${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch opportunity (${response.status})`);
    }

    const payload = (await response.json()) as { data?: Opportunity } | Opportunity;
    const opportunity =
      payload && typeof payload === "object" && "data" in payload
        ? payload.data
        : (payload as Opportunity);

    if (!opportunity) {
      return null;
    }

    return normalizeOpportunity(opportunity);
  } catch {
    return null;
  }
}
