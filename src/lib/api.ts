import { FetchOpportunitiesParams, Opportunity, OpportunityResponse } from "@/types/opportunity";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

/**
 * Normalize an opportunity from the API response to add computed UI-friendly fields.
 */
function normalizeOpportunity(opp: Opportunity): Opportunity {
  return {
    ...opp,
    remoteType: opp.remoteOpportunity === "true" ? "Remote" : "On-site",
    stipend: opp.salary ? `$${opp.salary} ${opp.salaryPeriodicity || ""}`.trim() : undefined,
    duration: opp.duration || "Not specified",
    country: opp.country || "Not specified",
    description: opp.description || "No description provided.",
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
  if (params.category) query.set("category", params.category);
  if (params.country) query.set("country", params.country);
  if (params.remoteType) query.set("remoteType", params.remoteType);
  if (params.paid) query.set("paid", params.paid);

  const queryString = query.toString();
  const url = `${API_BASE}/opportunities${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch opportunities (${response.status})`);
  }

  const json: OpportunityResponse = await response.json();

  return {
    data: json.data.map(normalizeOpportunity),
    paging: json.paging,
  };
}

/**
 * Fetches a single opportunity by ID from the backend API.
 */
export async function fetchOpportunityById(id: string): Promise<Opportunity | null> {
  try {
    const response = await fetch(`${API_BASE}/opportunities/${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch opportunity (${response.status})`);
    }

    const opp: Opportunity = await response.json();
    return normalizeOpportunity(opp);
  } catch {
    return null;
  }
}
