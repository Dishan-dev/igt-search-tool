import { Opportunity } from "@/types/opportunity";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "for",
  "in",
  "on",
  "at",
  "to",
  "of",
  "and",
  "or",
  "with",
]);

const SYNONYMS: Record<string, string[]> = {
  dev: ["developer", "software", "engineering", "programming", "tech"],
  developer: ["dev", "software", "engineering", "tech"],
  software: ["developer", "dev", "engineering", "tech"],
  marketing: ["brand", "seo", "digital", "content", "social"],
  sales: ["business", "bd", "business development"],
  business: ["sales", "bd", "business development"],
  finance: ["accounting", "accounts", "auditing"],
  hr: ["human resources", "talent", "recruitment"],
  remote: ["virtual", "online", "wfh", "work from home"],
  paid: ["salary", "stipend", "allowance", "compensation"],
  unpaid: ["volunteer", "no stipend"],
  intern: ["internship", "trainee"],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalizeText(value);
  if (!normalized) return [];

  return Array.from(
    new Set(
      normalized
        .split(" ")
        .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
    )
  );
}

function expandToken(token: string): string[] {
  const expanded = new Set<string>([token]);
  const direct = SYNONYMS[token] || [];
  direct.forEach((candidate) => tokenize(candidate).forEach((t) => expanded.add(t)));

  for (const [key, values] of Object.entries(SYNONYMS)) {
    if (values.some((value) => tokenize(value).includes(token))) {
      expanded.add(key);
      values.forEach((value) => tokenize(value).forEach((t) => expanded.add(t)));
    }
  }

  return Array.from(expanded);
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[a.length][b.length];
}

function tokenMatchScore(token: string, fieldText: string): number {
  if (!token || !fieldText) return 0;
  if (fieldText === token) return 3;
  if (fieldText.includes(token)) return 2;

  const words = fieldText.split(" ");
  const threshold = token.length <= 4 ? 1 : 2;

  for (const word of words) {
    if (!word) continue;
    if (editDistance(token, word) <= threshold) {
      return 1.2;
    }
  }

  return 0;
}

function scoreField(queryTokens: string[], fieldValue: string, weight: number): number {
  const normalizedField = normalizeText(fieldValue);
  if (!normalizedField) return 0;

  let score = 0;
  for (const token of queryTokens) {
    const tokenVariants = expandToken(token);
    let bestForToken = 0;

    for (const variant of tokenVariants) {
      bestForToken = Math.max(bestForToken, tokenMatchScore(variant, normalizedField));
    }

    score += bestForToken;
  }

  return score * weight;
}

function scoreIntent(queryTokens: string[], opportunity: Opportunity): number {
  let score = 0;

  const wantsRemote = queryTokens.some((token) => ["remote", "wfh", "online", "virtual"].includes(token));
  const wantsPaid = queryTokens.some((token) => ["paid", "salary", "stipend", "allowance"].includes(token));

  const remoteFlag = (opportunity.remoteOpportunity || "").toLowerCase();
  const isRemote = remoteFlag === "true" || remoteFlag === "remote";

  if (wantsRemote && isRemote) score += 3;
  if (wantsRemote && !isRemote) score -= 1;
  if (wantsPaid && opportunity.paid) score += 2;
  if (wantsPaid && !opportunity.paid) score -= 1;

  return score;
}

export function rankOpportunities(opportunities: Opportunity[], query: string): Opportunity[] {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return opportunities;

  const scored = opportunities.map((opportunity, index) => {
    const score =
      scoreField(queryTokens, opportunity.title, 4) +
      scoreField(queryTokens, opportunity.company, 3) +
      scoreField(queryTokens, opportunity.category, 2.5) +
      scoreField(queryTokens, opportunity.tags?.join(" ") || "", 2) +
      scoreField(queryTokens, `${opportunity.city} ${opportunity.country}`, 1.8) +
      scoreField(queryTokens, opportunity.description || "", 1) +
      scoreIntent(queryTokens, opportunity);

    return {
      index,
      score,
      opportunity,
    };
  });

  return scored
    .sort((a, b) => {
      if (b.score === a.score) {
        return a.index - b.index;
      }
      return b.score - a.score;
    })
    .map((item) => item.opportunity);
}
