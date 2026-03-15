import { Opportunity } from "@/types/opportunity";

type Topic = "tech" | "marketing" | "business" | "finance" | "design" | "health" | "education" | "default";

const TOPIC_IMAGE_POOLS: Record<Topic, string[]> = {
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
  ],
  marketing: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
  ],
  business: [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop",
  ],
  finance: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1462899006636-339e08d1844e?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80&auto=format&fit=crop",
  ],
  design: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop",
  ],
  health: [
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
  ],
  education: [
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80&auto=format&fit=crop",
  ],
  default: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80&auto=format&fit=crop",
  ],
};

function normalize(value: string): string {
  return value.toLowerCase();
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function detectTopic(opp: Opportunity): Topic {
  const titleCategory = normalize([opp.title, opp.category].join(" "));
  const haystack = normalize(
    [opp.title, opp.category, opp.company, opp.description, ...(opp.tags || [])].join(" ")
  );

  // Prioritize explicit role intent from title/category to avoid mismatched images.
  if (/marketing|brand|seo|content|social|digital/.test(titleCategory)) return "marketing";
  if (/language|teaching|teacher|tutor|education|school|learning|english|french|spanish|italian|portuguese/.test(titleCategory)) return "education";
  if (/developer|software|engineer|data|\bit\b|ai|ml|tech|programming/.test(titleCategory)) return "tech";
  if (/sales|business|management|operations|entrepreneur/.test(titleCategory)) return "business";
  if (/finance|account|audit|bank|investment|tax/.test(titleCategory)) return "finance";
  if (/design|ui|ux|creative|graphic|visual/.test(titleCategory)) return "design";
  if (/health|medical|clinic|hospital|care|nursing/.test(titleCategory)) return "health";

  if (/marketing|brand|seo|content|social|digital/.test(haystack)) return "marketing";
  if (/language|teaching|teacher|tutor|education|school|learning|english|french|spanish|italian|portuguese|esol/.test(haystack)) return "education";
  if (/developer|software|engineer|data|\bit\b|ai|ml|tech|programming/.test(haystack)) return "tech";
  if (/sales|business|management|operations|entrepreneur/.test(haystack)) return "business";
  if (/finance|account|audit|bank|investment|tax/.test(haystack)) return "finance";
  if (/design|ui|ux|creative|graphic|visual/.test(haystack)) return "design";
  if (/health|medical|clinic|hospital|care|nursing/.test(haystack)) return "health";
  if (/training/.test(haystack)) return "education";
  return "default";
}

export function assignOpportunityImages(opportunities: Opportunity[]): Record<string, string> {
  const assignedById: Record<string, string> = {};
  const usedImages = new Set<string>();
  const topicCursor: Record<Topic, number> = {
    tech: 0,
    marketing: 0,
    business: 0,
    finance: 0,
    design: 0,
    health: 0,
    education: 0,
    default: 0,
  };

  const allPools = Object.values(TOPIC_IMAGE_POOLS).flat();

  opportunities.forEach((opportunity) => {
    if (assignedById[opportunity.id]) return;

    if (opportunity.imageUrl && /^https?:\/\//i.test(opportunity.imageUrl)) {
      assignedById[opportunity.id] = opportunity.imageUrl;
      usedImages.add(opportunity.imageUrl);
      return;
    }

    const topic = detectTopic(opportunity);
    const pool = TOPIC_IMAGE_POOLS[topic] || TOPIC_IMAGE_POOLS.default;

    let selected: string | null = null;
    const start = topicCursor[topic] % pool.length;
    for (let i = 0; i < pool.length; i += 1) {
      const candidate = pool[(start + i) % pool.length];
      if (!usedImages.has(candidate)) {
        selected = candidate;
        topicCursor[topic] = (start + i + 1) % pool.length;
        break;
      }
    }

    if (!selected) {
      const fallback = allPools.find((candidate) => !usedImages.has(candidate));
      selected = fallback || pool[hashString(`${opportunity.id}:${opportunity.title}:${opportunity.company}`) % pool.length];
    }

    assignedById[opportunity.id] = selected;
    usedImages.add(selected);
  });

  return assignedById;
}

export function getOpportunityImage(opp: Opportunity): string {
  if (opp.imageUrl && /^https?:\/\//i.test(opp.imageUrl)) {
    return opp.imageUrl;
  }

  const topic = detectTopic(opp);
  const pool = TOPIC_IMAGE_POOLS[topic] || TOPIC_IMAGE_POOLS.default;
  const index = hashString(`${opp.id}:${opp.title}:${opp.company}`) % pool.length;

  return pool[index];
}
